from fastapi import APIRouter, UploadFile, File, HTTPException
from services.insights_service import generate_insights

router = APIRouter()

@router.post("/insights")
async def get_insights(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    file_bytes = await file.read()
    result = generate_insights(file_bytes)
    return result
