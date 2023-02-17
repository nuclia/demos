from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import StreamingResponse
from starlette.background import BackgroundTask
from sentence_transformers import SentenceTransformer

import httpx
import json

app = FastAPI()
client = httpx.AsyncClient(base_url="http://localhost:8080/")
model = SentenceTransformer("all-MiniLM-L6-v2")
# model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

async def _reverse_proxy(request: Request):
    method = request.method
    query = request.url.query.encode("utf-8")
    content = await request.body()
    headers = dict(request.headers.raw)
    if method == "POST" and request.url.path.endswith("/search"):
        params = json.loads(content)
        search_query = params['query']
        if search_query:
            vector = model.encode([search_query])[0]
            params['vector'] = vector.tolist()
            params['min_score'] = 0.7
            params['vectorset'] = "all-MiniLM-L6-v2"
            content = json.dumps(params).encode("utf-8")
            headers[b'content-length'] = f"{len(content)}"
    url = httpx.URL(path=request.url.path,
                    query=query)
    rp_req = client.build_request(method, url,
                                  headers=headers.items(),
                                  content=content)
    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(),
        status_code=rp_resp.status_code,
        headers=rp_resp.headers,
        background=BackgroundTask(rp_resp.aclose),
    )

app.add_route("/api/{path:path}",
              _reverse_proxy, ["GET", "POST", "HEAD", "OPTIONS"])

@app.get("/")
async def root():
    return {"message": "Hello World"}