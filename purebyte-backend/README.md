# PureByte — ML/API Backend

This is the **ingredient-analysis backend** for PureByte. It's a separate
Python service that sits *alongside* your existing Node.js/Express
authentication backend — it does not replace it.

```
┌─────────────┐      login/register       ┌──────────────────────┐
│ React        │ ─────────────────────────▶ │ Node/Express          │
│ frontend     │                            │ (existing auth)       │
│ (lovable)    │◀─────────── JWT ───────────│ MongoDB: users        │
└──────┬───────┘                            └──────────┬────────────┘
       │                                                │ same
       │  scan / history / ingredients                  │ MongoDB
       │  (Authorization: Bearer <JWT>)                  │ cluster
       ▼                                                 ▼
┌────────────────────────────────────────────────────────────────┐
│ Python FastAPI service (this repo)                              │
│  - verifies the SAME JWT Node issued (shared JWT_SECRET)         │
│  - OCR (label photo) + ingredient tokenizer                      │
│  - rule-based risk engine + logistic regression model            │
│  - reads/writes MongoDB: users.healthProfile, scans, ingredients  │
└────────────────────────────────────────────────────────────────┘
```

Why split it this way instead of rewriting your Node backend in Python?
Your auth is already working — don't touch it. Python is simply the better
tool for the ML/NLP/OCR piece (scikit-learn, pandas, pytesseract), and both
services talk to the *same* MongoDB database, so a user who logs in through
Node can hit the Python endpoints with the same token, no second login.

If you'd rather have a single backend, you can alternatively port the auth
routes into this FastAPI app later — the structure here doesn't block that,
but it isn't necessary to ship the AI feature.

---

## 1. What's inside

```
purebyte-backend/
├── app/
│   ├── main.py                 # FastAPI app, mounts all routes
│   ├── config.py                # env var loading
│   ├── database.py               # MongoDB connection + collections
│   ├── auth.py                    # verifies Node's JWT
│   ├── models/schemas.py           # request/response shapes
│   ├── services/
│   │   ├── risk_database.py         # curated flagged-ingredient list (edit this!)
│   │   ├── text_extractor.py          # OCR + ingredient tokenizer
│   │   ├── ml_model.py                  # loads trained logistic regression
│   │   └── scoring_engine.py              # combines rules + ML + personalization
│   └── routes/
│       ├── analyze.py    # POST /api/scan/analyze-text, /api/scan/analyze-image
│       ├── history.py    # GET  /api/scan/history
│       └── ingredients.py # GET /api/ingredients, PUT /api/users/health-profile
├── ml/
│   ├── data/sample_training_data.csv   # tiny illustrative example (10 rows)
│   ├── build_dataset_from_off.py         # turns Open Food Facts export into training data
│   ├── train_model.py                      # trains + saves the logistic regression
│   └── seed_ingredients.py                   # loads risk_database.py into MongoDB
├── requirements.txt
└── .env.example
```

## 2. How the score is actually computed

The landing page promises a **"Deterministic Score — transparent 0–100
score with itemized deductions per ingredient."** So the design here is
rules-first, ML-assisted, not a black box:

1. **Rule engine** (`risk_database.py`): every ingredient list is tokenized
   and checked against a curated table of flagged additives/allergens, each
   with a severity (`high`/`medium`/`low`) and a point deduction
   (`15`/`8`/`4`). Starting score is 100.
2. **Logistic regression model** (`ml_model.py`): trained on ingredient text
   to predict the probability the *whole list* looks like an
   "unsafe/ultra-processed" product — this catches patterns the fixed rule
   list misses (e.g. combinations, wording variants).
3. **Blend**: `final = 0.7 * rule_score + 0.3 * (100 * (1 - ml_probability))`
4. **Personalization**: if the logged-in user's health profile has
   conditions (diabetes, hypertension, pregnancy, nut allergy, etc.), any
   flagged ingredient relevant to *their* condition generates a specific
   warning ("Contains high fructose corn syrup, a concern for diabetes...")
   and nudges the score down further (capped at −25) since it matters more
   to that person than to a general shopper.

This keeps every deduction traceable to a specific ingredient (for the UI's
"itemized deductions") while still letting the ML model add signal.

## 3. Setup — step by step

### 3.1 Prerequisites
- Python 3.10+
- MongoDB (Atlas, or the same instance your Node backend already connects to)
- Tesseract OCR binary installed (for the "snap a label" photo feature):
  - Mac: `brew install tesseract`
  - Ubuntu/Debian: `sudo apt-get install tesseract-ocr`
  - Windows: install from https://github.com/UB-Mannheim/tesseract/wiki

### 3.2 Install
```bash
cd purebyte-backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` / `MONGO_DB_NAME` — point at the **same** database your
  Node auth service uses, so `users` collection is shared.
- `JWT_SECRET` / `JWT_ALGORITHM` — must exactly match what your Node
  backend uses to *sign* tokens (check your Node `jsonwebtoken` config).
  This is the one value that MUST match across both services.
- `TESSERACT_CMD` — path to your installed tesseract binary.
- `ALLOWED_ORIGINS` — your React dev URL and deployed frontend URL.

### 3.3 Train the model (do this before first run)
```bash
cd ml
python train_model.py --data data/food_dataset_clean.csv
```
This produces `ml/model.joblib` and `ml/vectorizer.joblib`. The API works
even without this step (it falls back to a neutral 0.5 ML probability and
relies on the rule engine alone), but you'll want a real model — see the
**Datasets** section below for how to train on real data instead of the
10-row sample.

### 3.4 (Optional) Seed the ingredient database into MongoDB
```bash
python ml/seed_ingredients.py
```

### 3.5 Run
```bash
uvicorn app.main:app --reload --port 8000
```
Visit `http://localhost:8000/docs` for interactive Swagger docs of every
endpoint (auto-generated by FastAPI).

### 3.6 Point your React frontend at it
Wherever your frontend currently calls the Node auth API, add a second base
URL for this service, e.g.:
```js
const AI_API_BASE = "http://localhost:8000"; // or your deployed URL
```
Every call needs the same JWT your Node login already stores (e.g. in
localStorage) sent as `Authorization: Bearer <token>`.

## 4. API reference

All endpoints below require `Authorization: Bearer <JWT>` unless noted.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/scan/analyze-text` | Body: `{ ingredientsText, productName? }` → safety score |
| POST | `/api/scan/analyze-image` | Multipart file upload (label photo) → OCR + safety score |
| GET | `/api/scan/history` | Paginated scan history for the logged-in user |
| GET | `/api/scan/history/{scan_id}` | Single past scan |
| GET | `/api/ingredients` *(public)* | Browse/search the flagged-ingredient database |
| GET | `/api/ingredients/{name}` *(public)* | Detail on one ingredient |
| GET/PUT | `/api/users/health-profile` | Read/update the user's conditions + allergies |
| GET | `/health` *(public)* | Liveness check |

Example response from `/api/scan/analyze-text`:
```json
{
  "safetyScore": 53,
  "ruleBasedScore": 65,
  "mlUnsafeProbability": 0.59,
  "flaggedIngredients": [
    {
      "ingredient": "high fructose corn syrup",
      "severity": "high",
      "reason": "Rapidly spikes blood glucose; linked to insulin resistance.",
      "relatedConditions": ["diabetes", "obesity", "fatty_liver"],
      "deduction": 15
    }
  ],
  "personalizedWarnings": [
    {
      "condition": "diabetes",
      "ingredient": "high fructose corn syrup",
      "message": "Contains high fructose corn syrup, a concern for diabetes: ..."
    }
  ],
  "totalIngredientsParsed": 6
}
```

### Health profile shape (what a user sets once, used on every future scan)
```json
{
  "conditions": ["diabetes", "hypertension"],
  "allergies": ["peanut", "shellfish"],
  "notes": "trying to reduce sodium"
}
```
Recognized condition tags out of the box (extend `risk_database.py` to add
more): `diabetes`, `hypertension`, `heart_disease`, `pregnancy`,
`kidney_disease`, `celiac`, `gluten_intolerance`, `dairy_allergy`,
`lactose_intolerance`, `soy_allergy`, `nut_allergy`, `shellfish_allergy`,
`egg_allergy`, `pku`, `cholesterol`, `fatty_liver`, `obesity`, `asthma`,
`adhd_sensitivity`, `ibs`, `crohns`, `thyroid`, `liver_disease`,
`cancer_risk`, `anxiety`.

## 5. Datasets you should collect (for training a real model)

The 10-row CSV in `ml/data/sample_training_data.csv` is only there to prove
the pipeline runs — it is **not enough to train a usable model.** There is
no ready-made public dataset that maps "ingredient list → 0–100 safety
score," so the practical path is a **proxy-label** approach: pick a dataset
that already classifies products by processing level or additive content,
and use that as your label.

**Primary recommendation — Open Food Facts** (free, huge, exactly the
shape you need):
- Full export: https://world.openfoodfacts.org/data (CSV/MongoDB dumps,
  millions of products with `ingredients_text`, `additives_tags`,
  `nova_group`, `allergens`, `nutriscore_grade`)
- `build_dataset_from_off.py` in this repo turns that export into a
  labeled CSV using `nova_group == 4` ("ultra-processed") as the proxy
  "unsafe" label — this is the fastest way to get a real training set.
- You can also try labeling by `nutriscore_grade` (D/E → unsafe) or by
  additive count (`additives_n` above a threshold) as alternate proxies,
  or blend more than one.

**To build/verify the curated ingredient risk list** (`risk_database.py`),
cross-reference:
- FDA GRAS substances list & Food Additive Status list —
  https://www.fda.gov/food/food-additives-petitions
- FDA CAERS (adverse event reports tied to foods/additives) —
  https://www.fda.gov/food/compliance-enforcement-food/cfsan-adverse-event-reporting-system-caers
- EWG Food Scores — https://www.ewg.org/foodscores/ (additive and
  processing risk ratings; check their terms before bulk-scraping)
- CSPI Chemical Cuisine ratings — https://www.cspinet.org/eating-healthy/chemical-cuisine
- EU additive database (E-numbers) — https://food.ec.europa.eu/food-safety/food-improvement-agents/additives_en

**For the disease/condition-specific rules** (not ML training data, but the
source of truth for which ingredient matters for which condition):
- American Diabetes Association nutrition guidance (sugar/glycemic ingredients)
- American Heart Association sodium/saturated-fat guidance
- Celiac Disease Foundation gluten-ingredient lists
- FDA "Big 9" major food allergens
- NIH/MedlinePlus condition-specific dietary guidance pages

**Kaggle mirrors** (easier to download in one file, may lag the live OFF data):
- Search "Open Food Facts" or "food ingredients" on kaggle.com/datasets

**If you want to go further than proxy labels:** hand-label a sample of
500–1000 real product ingredient lists yourself (safe/moderate/unsafe) — a
small, high-quality labeled set often beats a huge proxy-labeled one, and
you can use it as a held-out test set even if you train on OFF+NOVA.

## 6. Notes, limits, and what to harden before production

- This is **not medical advice** — keep that disclaimer in the UI (the
  landing page copy already has it). The personalization logic is a
  best-effort ingredient-matching heuristic, not a clinical tool.
- The OCR step is only as good as the photo; add a "review extracted text"
  step in the frontend before running analysis so users can fix OCR typos.
- `risk_database.py` currently has ~25 illustrative entries — budget real
  time to expand this to hundreds of entries using the sources above; it's
  the single highest-leverage thing you can do for score quality.
- Add rate limiting to `/api/scan/analyze-image` (OCR + inference are the
  most expensive calls).
- Once you have a larger, real dataset, re-run `train_model.py` periodically
  and consider tracking model version/date alongside each saved scan so you
  can audit which model produced a given historical score.
