import os
from groq import Groq
from services.embedding_service import search_index

def answer_question(question: str) -> dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    # Step 1: Find relevant chunks from FAISS with scores
    results = search_index(question, top_k=5)
    
    # Step 2: Build context from chunks
    context = "\n\n".join([r["text"] for r in results])
    
    # Step 3: Send to Groq LLM
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

    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "sources": [r["text"] for r in results],
        "relevance_scores": [r["score"] for r in results]
    }
