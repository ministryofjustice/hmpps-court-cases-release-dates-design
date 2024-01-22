FROM bitnami/nginx:1.25.3

WORKDIR /app

COPY ./_site .
