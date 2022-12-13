ARG BUILD_MODE=production

FROM node:16 as build-web
WORKDIR /build
COPY . .
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    BUILD_MODE=${BUILD_MODE} pnpm build

FROM nginx:stable-alpine
COPY --from=build-web /build/apps/polyflix/dist /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD [ "nginx", "-g", "daemon off;" ]
