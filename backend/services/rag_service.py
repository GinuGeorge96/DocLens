import os
from groq import Groq
from services.embedding_service import search_index, get_all_chunks

def answer_question(question: str) -> dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    results = search_index(question, top_k=5)
    context = "\n\n".join([r["text"] for r in results])
    
    prompt = f"""You are a helpful assistant. Use the context below to answer the question.
If the answer is not in the context, say "I couldn't find that in the document."

Context:
{context}

Question: {question}

Answer:"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": [r["text"] for r in results],
        "relevance_scores": [r["score"] for r in results]
    }

def generate_surprise_questions() -> dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    chunks = get_all_chunks()
    if not chunks:
        return {"questions": []}
    
    # Use first 10 chunks as document sample
    sample = "\n\n".join(chunks[:10])
    
    prompt = f"""You are a curious analyst. Based on this document excerpt, generate exactly 3 interesting and specific questions that would reveal key insights about this document.

Document excerpt:
{sample}

Return exactly 3 questions as a JSON array like this:
{{"questions": ["question 1", "question 2", "question 3"]}}

Only return valid JSON, nothing else."""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    import json
    raw = response.choices[0].message.content.strip()
    result = json.loads(raw)
    return result
