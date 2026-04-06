from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.upload import router as upload_router
from routes.qa import router as qa_router
from routes.insights import router as insights_router

load_dotenv()

app = FastAPI(title="DocLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api/v1")
app.include_router(qa_router, prefix="/api/v1")
app.include_router(insights_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "DocLens API is running"}
