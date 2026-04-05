from pydantic import BaseModel
from typing import Optional

class UploadResponse(BaseModel):
    filename: str
    file_type: str
    message: str
    num_chunks: Optional[int] = None
    num_rows: Optional[int] = None
    columns: Optional[list] = None
