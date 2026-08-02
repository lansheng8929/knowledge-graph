# graph-query-service 镜像
# 注意：build context 为仓库根（见 infra/docker-compose.yml），故可用 COPY services/... 相对仓库根引用
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# 可选：构建代理（由 compose build args 注入，见 infra/docker-compose.yml）
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

WORKDIR /app

COPY services/graph-query-service/requirements.txt .
RUN pip install -r requirements.txt

# ABAC PEP 客户端（L2，shared/pep-client）
COPY shared/pep-client ./shared/pep-client
RUN pip install ./shared/pep-client

# 审计 sink（T4.8，shared/audit）
COPY shared/audit ./shared/audit
RUN pip install ./shared/audit

COPY services/graph-query-service/app ./app

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/healthz')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
