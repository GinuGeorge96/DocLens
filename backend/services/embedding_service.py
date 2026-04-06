from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

# In-memory store
faiss_index = None
stored_chunks = []

def build_index(chunks: list[str]):
    global faiss_index, stored_chunks
    stored_chunks = chunks
    embeddings = model.encode(chunks, show_progress_bar=False)
    embeddings = np.array(embeddings).astype("float32")
    dimension = embeddings.shape[1]
    faiss_index = faiss.IndexFlatL2(dimension)
    faiss_index.add(embeddings)
def search_index(query: str, top_k: int = 5) -> list[dict]:
    global faiss_index, stored_chunks
    query_embedding = model.encode([query])
    query_embedding = np.array(query_embedding).astype("float32")
    distances, indices = faiss_index.search(query_embedding, top_k)
    
    results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx < len(stored_chunks):
            # Convert L2 distance to a 0-100 relevance score
            score = round(max(0, 100 - float(dist) * 10), 1)
            results.append({
                "text": stored_chunks[idx],
                "score": score
            })
    return results
