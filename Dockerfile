FROM nginx:stable-alpine
COPY apps/polyflix/dist /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD [ "nginx", "-g", "daemon off;" ]
