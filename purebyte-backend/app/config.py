import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "purebyte")

JWT_SECRET = os.getenv("JWT_SECRET", "purebyteanalyzer")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

TESSERACT_CMD = os.getenv("TESSERACT_CMD")

ALLOWED_ORIGINS = [
    o.strip().rstrip("/")
    for o in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,https://purebyte.lovable.app,https://pure-byte-liart.vercel.app,https://pure-byte-harsha-vardhans-projects-3774e119.vercel.app,https://purebyte-1.onrender.com"
    ).split(",")
    if o.strip()
]

# Always allow localhost dev when no ALLOWED_ORIGINS are configured.
if not ALLOWED_ORIGINS:
    ALLOWED_ORIGINS = ["http://localhost:5173"]

PORT = int(os.getenv("PORT", 8000))

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml", "model.joblib"))
VECTORIZER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml", "vectorizer.joblib"))
