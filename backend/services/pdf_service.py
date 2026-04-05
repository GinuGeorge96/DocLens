import pdfplumber
from langchain_text_splitters import RecursiveCharacterTextSplitter

def extract_and_chunk_pdf(file_bytes: bytes) -> list[str]:
    text = ""
    with pdfplumber.open(file_bytes) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_text(text)
    return chunks
