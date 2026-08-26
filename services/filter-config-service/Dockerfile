# filter-config-service 镜像（build context 为仓库根）
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

WORKDIR /app

COPY services/filter-config-service/requirements.txt .
RUN pip install -r requirements.txt

# JWT 统一实现（service-common）
COPY shared/service-common ./shared/service-common
RUN pip install ./shared/service-common

COPY services/filter-config-service/app ./app

EXPOSE 8007

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8007/healthz')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8007"]
