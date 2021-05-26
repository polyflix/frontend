FROM node:14-alpine as build
ARG GITLAB_REGISTRY_TOKEN
ARG REACT_APP_API_URL
RUN apk add g++ make python
RUN npm config set --global @polyflix:registry https://gitlab.polytech.umontpellier.fr/api/v4/projects/1343/packages/npm/
RUN npm config set --global -- '//gitlab.polytech.umontpellier.fr/api/v4/projects/1343/packages/npm/:_authToken' "${GITLAB_REGISTRY_TOKEN}"
WORKDIR /app
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm i
COPY . ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
