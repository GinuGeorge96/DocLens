from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_service import extract_and_chunk_pdf
from services.embedding_service import build_index
from services.csv_service import parse_csv
from models.schemas import UploadResponse
import io

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename
    file_bytes = await file.read()

    if filename.endswith(".pdf"):
        chunks = extract_and_chunk_pdf(io.BytesIO(file_bytes))
        build_index(chunks)
        return UploadResponse(
            filename=filename,
            file_type="pdf",
            message="PDF processed and indexed successfully",
            num_chunks=len(chunks)
        )

    elif filename.endswith(".csv"):
        profile = parse_csv(file_bytes)
        return UploadResponse(
            filename=filename,
            file_type="csv",
            message="CSV parsed successfully",
            num_rows=profile["num_rows"],
            columns=profile["columns"]
        )

    else:
        raise HTTPException(status_code=400, detail="Only PDF and CSV files are supported")
