import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "purebyte")

JWT_SECRET = os.getenv("JWT_SECRET", "purebyteanalyzer")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

TESSERACT_CMD = os.getenv("TESSERACT_CMD")

ALLOWED_ORIGINS = [o.strip() for o in os.getenv(
    "ALLOWED_ORIGINS", "https://pure-byte-liart.vercel.app/,http://localhost:5173"
).split(",")]

PORT = int(os.getenv("PORT", 8000))

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml", "model.joblib"))
VECTORIZER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml", "vectorizer.joblib"))
