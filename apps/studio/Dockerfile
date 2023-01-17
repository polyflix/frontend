ARG BUILD_MODE=production
ARG WORKSPACE_APP=studio

FROM node:16 AS builder
ARG WORKSPACE_APP
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune --scope=$WORKSPACE_APP --docker

# --------------------------------------
# Add lockfile and package.json's of isolated subworkspace
FROM node:16 AS installer
WORKDIR /app
ARG BUILD_MODE
ARG WORKSPACE_APP
ENV BUILD_MODE=$BUILD_MODE
# Install pnpm
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm fetch
RUN pnpm install --offline

COPY --from=builder /app/out/full/ .
RUN pnpm build

# --------------------------------------
FROM nginx:stable-alpine
WORKDIR /app
ARG WORKSPACE_APP
## Add permissions for nginx user
RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/log/nginx && \
  chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid
USER nginx
# Copy the build output
COPY --from=installer /app/apps/$WORKSPACE_APP/dist /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD [ "nginx", "-g", "daemon off;" ]
