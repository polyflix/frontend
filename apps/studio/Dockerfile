ARG BUILD_MODE=production
ARG WORKSPACE_APP=studio

FROM node:16 as build-web
WORKDIR /build
# As we are in multistage build, we need to specify that for this stage,
# we want to use the build arg. If not, the argument isn't substitued
# and the variable will be empty
ARG BUILD_MODE
ENV BUILD_MODE=$BUILD_MODE
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm build --filter=cms

FROM nginx:stable-alpine
COPY --from=build-web /build/dist /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD [ "nginx", "-g", "daemon off;" ]
