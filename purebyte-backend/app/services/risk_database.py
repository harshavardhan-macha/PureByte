"""
Curated flagged-ingredient database.

Each key is an ingredient name (lowercase, as it would appear on a label).
`aliases` lets us match common synonyms/E-numbers.
`severity` drives the point deduction in the deterministic score.
`conditions` links the ingredient to health conditions for personalized
warnings (must match the values you let users pick in their health profile).

This list is a STARTING POINT (~70 common offenders). Expand it heavily using
the datasets suggested in the README (Open Food Facts additive taxonomy,
FDA GRAS/food additive status list, CSPI "Chemical Cuisine" ratings, etc).
Store the *authoritative* copy of this data in MongoDB (see ml/seed_ingredients.py)
so you can update it without redeploying code.
"""

SEVERITY_DEDUCTION = {"high": 15, "medium": 8, "low": 4}

FLAGGED_INGREDIENTS = {
    "high fructose corn syrup": {
        "aliases": ["hfcs", "corn syrup"],
        "severity": "high",
        "reason": "Rapidly spikes blood glucose; linked to insulin resistance.",
        "conditions": ["diabetes", "obesity", "fatty_liver"],
    },
    "sodium nitrite": {
        "aliases": ["e250", "sodium nitrate", "e251"],
        "severity": "high",
        "reason": "Preservative linked to elevated blood pressure and, in processed meats, carcinogenic nitrosamine formation.",
        "conditions": ["hypertension", "heart_disease", "cancer_risk"],
    },
    "trans fat": {
        "aliases": ["partially hydrogenated oil", "hydrogenated vegetable oil"],
        "severity": "high",
        "reason": "Raises LDL and lowers HDL cholesterol; strongly linked to cardiovascular disease.",
        "conditions": ["heart_disease", "hypertension", "cholesterol"],
    },
    "monosodium glutamate": {
        "aliases": ["msg", "e621"],
        "severity": "medium",
        "reason": "High sodium load; some individuals report sensitivity (headaches, flushing).",
        "conditions": ["hypertension", "kidney_disease"],
    },
    "aspartame": {
        "aliases": ["e951"],
        "severity": "medium",
        "reason": "Artificial sweetener; avoid with phenylketonuria (PKU); debated long-term effects.",
        "conditions": ["pku", "pregnancy"],
    },
    "sucralose": {
        "aliases": ["e955"],
        "severity": "low",
        "reason": "Artificial sweetener; generally recognized as safe but may affect gut microbiome with heavy use.",
        "conditions": ["ibs"],
    },
    "sodium benzoate": {
        "aliases": ["e211"],
        "severity": "medium",
        "reason": "Preservative that can form benzene when combined with vitamin C; hyperactivity concerns in children.",
        "conditions": ["adhd_sensitivity"],
    },
    "potassium bromate": {
        "aliases": ["e924", "bromated flour"],
        "severity": "high",
        "reason": "Banned in most countries; classified as a possible human carcinogen.",
        "conditions": ["cancer_risk"],
    },
    "red 40": {
        "aliases": ["allura red", "e129"],
        "severity": "medium",
        "reason": "Synthetic dye linked to hyperactivity in children; allergen for some.",
        "conditions": ["adhd_sensitivity", "allergy"],
    },
    "yellow 5": {
        "aliases": ["tartrazine", "e102"],
        "severity": "medium",
        "reason": "Synthetic dye; can trigger allergic/asthmatic reactions in sensitive individuals.",
        "conditions": ["asthma", "allergy"],
    },
    "yellow 6": {
        "aliases": ["sunset yellow", "e110"],
        "severity": "medium",
        "reason": "Synthetic dye linked to hyperactivity and occasional allergic reactions.",
        "conditions": ["adhd_sensitivity", "allergy"],
    },
    "bha": {
        "aliases": ["butylated hydroxyanisole", "e320"],
        "severity": "high",
        "reason": "Preservative; classified as a possible carcinogen by IARC.",
        "conditions": ["cancer_risk"],
    },
    "bht": {
        "aliases": ["butylated hydroxytoluene", "e321"],
        "severity": "medium",
        "reason": "Preservative with debated endocrine-disrupting potential.",
        "conditions": ["thyroid"],
    },
    "carrageenan": {
        "aliases": ["e407"],
        "severity": "medium",
        "reason": "Thickener linked to gut inflammation in some studies.",
        "conditions": ["ibs", "crohns"],
    },
    "sodium": {
        "aliases": ["salt", "sodium chloride"],
        "severity": "low",
        "reason": "High sodium intake raises blood pressure; watch cumulative amount across the label.",
        "conditions": ["hypertension", "kidney_disease", "heart_disease"],
    },
    "sugar": {
        "aliases": ["cane sugar", "dextrose", "sucrose", "glucose syrup", "maltose"],
        "severity": "medium",
        "reason": "Added sugar contributes to blood glucose spikes and weight gain.",
        "conditions": ["diabetes", "obesity", "fatty_liver"],
    },
    "palm oil": {
        "aliases": ["palm kernel oil"],
        "severity": "low",
        "reason": "High in saturated fat; also an environmental/ethical concern for some consumers.",
        "conditions": ["heart_disease", "cholesterol"],
    },
    "caffeine": {
        "aliases": [],
        "severity": "low",
        "reason": "Stimulant; avoid or limit during pregnancy and with certain heart conditions.",
        "conditions": ["pregnancy", "heart_disease", "anxiety"],
    },
    "alcohol": {
        "aliases": ["ethanol", "ethyl alcohol"],
        "severity": "high",
        "reason": "Not recommended during pregnancy; interacts with several medications.",
        "conditions": ["pregnancy", "liver_disease"],
    },
    "gluten": {
        "aliases": ["wheat flour", "barley", "rye", "malt"],
        "severity": "high",
        "reason": "Unsafe for celiac disease; triggers symptoms in gluten sensitivity.",
        "conditions": ["celiac", "gluten_intolerance"],
    },
    "casein": {
        "aliases": ["milk solids", "whey", "lactose"],
        "severity": "medium",
        "reason": "Dairy-derived; unsafe for milk allergy, problematic for lactose intolerance.",
        "conditions": ["dairy_allergy", "lactose_intolerance"],
    },
    "soy lecithin": {
        "aliases": ["soy protein", "soybean oil"],
        "severity": "low",
        "reason": "Common emulsifier derived from soy; relevant for soy allergy.",
        "conditions": ["soy_allergy"],
    },
    "peanut": {
        "aliases": ["groundnut", "peanut oil"],
        "severity": "high",
        "reason": "One of the most common and severe food allergens.",
        "conditions": ["nut_allergy"],
    },
    "tree nuts": {
        "aliases": ["almond", "cashew", "walnut", "hazelnut", "pistachio"],
        "severity": "high",
        "reason": "Common severe allergen group.",
        "conditions": ["nut_allergy"],
    },
    "shellfish": {
        "aliases": ["shrimp", "crab", "lobster"],
        "severity": "high",
        "reason": "Common severe allergen.",
        "conditions": ["shellfish_allergy"],
    },
    "egg": {
        "aliases": ["albumin", "egg white", "egg yolk"],
        "severity": "medium",
        "reason": "Common allergen, especially relevant for children and pregnant individuals (raw egg risk).",
        "conditions": ["egg_allergy"],
    },
}


def lookup_all_names():
    """Flatten ingredient + aliases into a single searchable map -> canonical key."""
    flat = {}
    for canonical, meta in FLAGGED_INGREDIENTS.items():
        flat[canonical] = canonical
        for alias in meta.get("aliases", []):
            flat[alias.lower()] = canonical
    return flat
