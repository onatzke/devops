FROM node:20-alpine AS builder

WORKDIR /build
COPY src ./

FROM nginx:1.27-alpine AS runtime
ARG NGINX_VERSION
LABEL version=$NGINX_VERSION

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/cache/nginx/stats \
    && chown -R nginx:nginx /var/cache/nginx

COPY --from=builder /build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]