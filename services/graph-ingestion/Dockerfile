# graph-ingestion 镜像
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# 可选：构建代理（由 compose build args 注入）
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

WORKDIR /app

COPY services/graph-ingestion/requirements.txt .
RUN pip install -r requirements.txt

# 共享基础包（统一日志 / 统一异常出口）
COPY shared/service-common ./shared/service-common
RUN pip install ./shared/service-common

COPY services/graph-ingestion/app ./app

EXPOSE 8003

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8003/healthz')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8003"]
