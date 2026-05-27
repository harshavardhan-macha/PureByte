from fastapi import FastAPI
from pydantic import BaseModel, Field

from scorer import get_quality_score

app = FastAPI(title="PureByte AI Service")


class ScanRequest(BaseModel):
    barcode: str | None = None
    product_name: str | None = None
    ingredients: list[str] = Field(default_factory=list)
    nutrients: dict = Field(default_factory=dict)


@app.post("/analyze")
def analyze_food(data: ScanRequest):
    result = get_quality_score(data)
    return {
        "score": result["score"],
        "verdict": result["verdict"],
        "confidence": result["confidence"],
        "matched_product": result["matched"],
        "flags": result["flags"],
    }
