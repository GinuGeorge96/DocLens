import os
from groq import Groq
from services.csv_service import parse_csv

def generate_insights(file_bytes: bytes) -> dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    # Step 1: Parse CSV
    profile = parse_csv(file_bytes)
    
    # Step 2: Build summary for LLM
    summary = f"""
Dataset has {profile['num_rows']} rows and {profile['num_cols']} columns.
Columns: {', '.join(profile['columns'])}
Data types: {profile['dtypes']}
Statistical summary: {profile['summary']}
Sample rows: {profile['sample']}
"""

    # Step 3: Ask Groq for insights
    prompt = f"""You are a data analyst. Analyze this dataset and return exactly 3 key insights.
Also suggest the best chart to visualize this data.

Dataset Summary:
{summary}

Respond in this exact JSON format:
{{
  "insights": [
    "insight 1",
    "insight 2", 
    "insight 3"
  ],
  "chart": {{
    "type": "bar",
    "x_column": "column_name",
    "y_column": "column_name",
    "title": "chart title"
  }}
}}

Only return valid JSON, nothing else."""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    import json
    raw = response.choices[0].message.content.strip()
    result = json.loads(raw)
    
    return {
        "insights": result["insights"],
        "chart": result["chart"],
        "columns": profile["columns"],
        "sample": profile["sample"],
        "num_rows": profile["num_rows"]
    }
