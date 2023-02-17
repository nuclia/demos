import sys
from nucliadb_sdk.utils import get_or_create
from sentence_transformers import SentenceTransformer

KBSLUG = "philosophy"
kb = get_or_create(KBSLUG)

encoder = SentenceTransformer("all-MiniLM-L6-v2")

query = sys.argv[1]
query_vectors = encoder.encode([query])[0]
results = kb.search(text=query, vector=query_vectors, vectorset="all-MiniLM-L6-v2", min_score=0.5)
   
for result in results:
    print(f'{result.text} - Score {result.score}')
