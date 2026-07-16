from pymongo import MongoClient
from app.config import MONGO_URI, MONGO_DB_NAME

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

# Collections. `users` should be the SAME collection your Node.js auth
# service already writes to at registration/login — we only read/extend it,
# never touch password fields.
users_collection = db["users"]
scans_collection = db["scans"]
ingredients_collection = db["ingredients"]


def ensure_indexes():
    users_collection.create_index("email", unique=True)
    scans_collection.create_index("userId")
    scans_collection.create_index("createdAt")
    ingredients_collection.create_index("name")
