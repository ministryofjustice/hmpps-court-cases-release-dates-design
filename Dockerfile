FROM nginxinc/nginx-unprivileged:1.29.1-bookworm

USER root

ARG user=apppuser
ARG uid=1001
RUN addgroup --gid ${uid} ${user} && \
    adduser --disabled-login --disabled-password --ingroup ${user} --home /${user} --gecos "${user} user" --shell /bin/bash --uid ${uid} ${user} && \
    usermod -a -G ${user} nginx

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./_site /usr/share/nginx/html

USER ${uid}