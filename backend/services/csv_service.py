import pandas as pd
from io import BytesIO

def parse_csv(file_bytes: bytes) -> dict:
    df = pd.read_csv(BytesIO(file_bytes))
    
    profile = {
        "num_rows": len(df),
        "num_cols": len(df.columns),
        "columns": df.columns.tolist(),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "summary": df.describe(include="all").fillna("").to_dict(),
        "sample": df.head(5).to_dict(orient="records")
    }
    
    return profile
