FROM bitnami/nginx:1.29.0

WORKDIR /app

COPY ./_site .
