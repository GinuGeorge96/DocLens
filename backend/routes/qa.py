from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rag_service import answer_question

router = APIRouter()

class QARequest(BaseModel):
    question: str

@router.post("/qa")
def ask_question(request: QARequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    result = answer_question(request.question)
    return result
