from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import ALLOWED_ORIGINS
from app.database import ensure_indexes
from app.routes import analyze, history, ingredients, community

app = FastAPI(
    title="PureByte ML/API Service",
    description="Ingredient safety scoring service for PureByte. "
                 "Runs alongside your existing Node.js auth backend.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(history.router)
app.include_router(ingredients.router)
app.include_router(community.router)


@app.on_event("startup")
def on_startup():
    ensure_indexes()


@app.get("/")
def root():
    return {"status": "ok", "message": "Purebyte API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
