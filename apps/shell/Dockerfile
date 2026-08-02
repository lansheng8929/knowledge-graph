# shell 前端容器镜像（prod web）：多阶段构建 → Nginx 托管
#
# 阶段1（bun）：构建 shell（含 subapps 子应用产物，public/ 拷入 dist）
# 阶段2（nginx）：托管静态文件 + /api 代理到网关 + SPA 回退 + 静态缓存
#
# 构建（由 infra/docker-compose.yml 的 web 服务执行，context=仓库根）：
#   docker compose -f infra/docker-compose.yml build web
FROM oven/bun:1.1 AS build
WORKDIR /app

# 先复制清单，利用缓存装依赖
COPY package.json bun.lock ./
COPY apps/shell/package.json apps/shell/package.json
COPY apps/graph-app/package.json apps/graph-app/package.json
COPY graph/package.json graph/package.json
COPY shared/api-client/package.json shared/api-client/package.json
RUN bun install

# 源码 + 构建 shell（public/subapps 已含子应用产物，随 dist 拷入）
COPY apps apps
COPY graph graph
COPY shared shared
COPY scripts scripts
RUN cd apps/shell && bun run build

FROM nginx:1.27-alpine
COPY apps/shell/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/shell/dist /usr/share/nginx/html
EXPOSE 80
