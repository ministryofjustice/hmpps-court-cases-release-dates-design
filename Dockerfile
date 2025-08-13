FROM bitnami/nginx:1.29.1

WORKDIR /app

COPY ./_site .
