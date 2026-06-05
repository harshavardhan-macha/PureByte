from typing import Annotated, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from pipeline import run_pipeline

app = FastAPI(title="PureByte AI Service", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_IMAGE_BYTES = 10 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"}


async def _read_optional_upload(upload: Optional[UploadFile]) -> bytes | None:
    if upload is None or not upload.filename:
        return None
    content_type = (upload.content_type or "").lower()
    if not content_type.startswith("image/") and content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Images must be JPEG, PNG, or WebP",
        )
    data = await upload.read()
    if not data:
        return None
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Image exceeds 10MB limit")
    return data


@app.get("/health")
def health():
    return {"status": "ok", "service": "purebyte-ai"}


@app.post("/analyze")
async def analyze_food(
    food_image: Annotated[Optional[UploadFile], File()] = None,
    label_image: Annotated[Optional[UploadFile], File()] = None,
):
    try:
        food_bytes = await _read_optional_upload(food_image)
        label_bytes = await _read_optional_upload(label_image)

        if food_bytes is None and label_bytes is None:
            raise HTTPException(
                status_code=400,
                detail="Provide at least one image: food_image and/or label_image",
            )

        return run_pipeline(food_bytes, label_bytes)
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc
