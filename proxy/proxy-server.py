# To run the code, use the command "python3 proxy-server.py"


from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import uvicorn

API_KEY = <API KEY> # Generate one from the dashboard by navigating to the "API Keys" tab
REGION = <REGION> # The Region where your KB resides. Find it in the dashboard under the "Home" tab

if not API_KEY:
    raise ValueError("Missing environment variable: NUCLIA_API_KEY")
if not REGION:
    raise ValueError("Missing environment variable: NUCLIA_REGION")

TARGET_URL = f"https://{REGION}.rag.progress.cloud/api"

app = FastAPI()

# CORS (adjust allow_origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy(request: Request, path: str):
    url = f"{TARGET_URL}/{path}"

    headers = dict(request.headers)
    headers.pop("host", None)
    headers["X-NUCLIA-SERVICEACCOUNT"] = f"Bearer {API_KEY}"

    body = await request.body()

    async def iter_response():
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                request.method,
                url,
                headers=headers,
                content=body,
                params=request.query_params,
            ) as resp:
                async for chunk in resp.aiter_bytes():
                    yield chunk

    # Forward upstream content type if possible, fallback to octet-stream
    return StreamingResponse(
        iter_response(),
        media_type=headers.get("content-type", "application/octet-stream"),
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
