# DocLens — Document Intelligence Platform

A demo app for PDF Q&A (RAG-powered) and CSV Data Story Generation.

## Stack
- **Frontend:** React + Vite + Tailwind + Recharts
- **Backend:** FastAPI + LangChain + FAISS + Sentence Transformers
- **LLM:** Groq API (llama3-8b-8192)

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
