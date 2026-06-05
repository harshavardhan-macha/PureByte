# PureByte

PureByte analyzes food safety from **one or two images**:

- **Food image** — computer vision checks for spoilage
- **Label image** — OCR reads the ingredients list
- **Both** — full analysis (spoilage + ingredients)

## Pipeline

```
Food image (optional)     Label image (optional)
        ↓                         ↓
[Computer Vision]            [OCR]
  spoilage detection      ingredient extraction
        ↓                         ↓
        └──── Safety classifier ──┘
                    ↓
           Quality score 0–10
           Verdict: Safe / Unsafe
```

At least **one** image is required per scan.

## Run locally

### 1. AI service (Python)

```bash
cd ai-service
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Backend (Node)

```bash
cd BACKEND
npm install
npm start
```

Optional `.env`:

```
PORT=3000
AI_SERVICE_URL=http://localhost:8000/analyze
MONGO_URI=mongodb://localhost:27017/purebyte
```

### 3. Frontend (React)

```bash
cd FRONTEND
npm install
npm run dev
```

Open http://localhost:5173

### Troubleshooting: `WinError 10013` on port 8000

Port **8000** is already in use (often a previous `uvicorn` still running):

```powershell
& $env:SystemRoot\System32\netstat.exe -ano | findstr ":8000"
Stop-Process -Id <PID> -Force
```

Or use port 8001 and set `AI_SERVICE_URL=http://localhost:8001/analyze` in `BACKEND/.env`.

## API

`POST /scan` — `multipart/form-data`

| Field         | Type  | Required |
|---------------|-------|----------|
| `food_image`  | image | no*      |
| `label_image` | image | no*      |

\*At least one of `food_image` or `label_image` must be provided.

Response includes `analysis_mode` (`food_only` | `label_only` | `both`), `score` (0–10), `verdict` (`Safe` | `Unsafe`), `spoilage`, `ingredients`, `safety`, and `flags`.
