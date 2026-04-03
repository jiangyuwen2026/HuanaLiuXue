"""FastAPI 主应用 - Word 导入服务"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.import_doc import router as import_router

app = FastAPI(
    title="Word Import Service",
    description="Word 文档导入服务 - 支持分页符、公式、图片等",
    version="1.0.0"
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(import_router, prefix="/api/import")

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "ok", "service": "word-import"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
