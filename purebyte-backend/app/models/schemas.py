from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class HealthProfile(BaseModel):
    conditions: List[str] = Field(
        default_factory=list,
        description="e.g. ['diabetes','hypertension','pregnancy','nut_allergy']",
    )
    allergies: List[str] = Field(default_factory=list)
    notes: Optional[str] = None


class AnalyzeTextRequest(BaseModel):
    ingredientsText: str
    productName: Optional[str] = None


class FlaggedIngredient(BaseModel):
    ingredient: str
    severity: str            # "high" | "medium" | "low"
    reason: str
    relatedConditions: List[str] = Field(default_factory=list)
    deduction: int


class PersonalizedWarning(BaseModel):
    condition: str
    ingredient: str
    message: str


class AnalyzeResponse(BaseModel):
    productName: Optional[str] = None
    safetyScore: int
    ruleBasedScore: int
    mlUnsafeProbability: float
    flaggedIngredients: List[FlaggedIngredient]
    personalizedWarnings: List[PersonalizedWarning]
    totalIngredientsParsed: int
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class ScanHistoryItem(AnalyzeResponse):
    id: str
    userId: str
