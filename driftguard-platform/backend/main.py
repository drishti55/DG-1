from fastapi import FastAPI
from api.router import router

app = FastAPI(title="DriftGuard API")

app.include_router(router)

@app.get("/")
def root():
    return {"status": "ok", "service": "DriftGuard"}
