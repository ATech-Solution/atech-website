# nginx Performance Config — Apply Instructions

This snippet adds brotli/gzip compression and proxy caching to your nginx setup.

## Prerequisites

- nginx 1.18+
- ngx_brotli module (check: `nginx -V 2>&1 | grep brotli`)
  - If missing, comment out the `brotli` block — gzip fallback still applies

## Step 1 — Copy the file to the server

```bash
scp src/plugins/performance/nginx/performance.conf \
  deploy@143.198.80.149:/home/deploy/nginx-perf.conf
```

## Step 2 — Include in nginx http block

Edit `/etc/nginx/nginx.conf` and add inside the `http {}` block:

```nginx
http {
  include /home/deploy/nginx-perf.conf;
  ...
}
```

## Step 3 — Add proxy cache directives to your server block

Inside your `server {}` block for uat.atech.software:

```nginx
location / {
  proxy_pass             http://atech_node;
  proxy_cache            perf_cache;
  proxy_cache_valid      200 60s;
  proxy_cache_use_stale  error timeout updating http_500 http_502 http_503;
  proxy_cache_bypass     $cookie_payload_token $http_authorization $http_x_bypass_cache;
  proxy_no_cache         $cookie_payload_token $http_authorization;
  add_header             X-Cache-Status $upstream_cache_status always;
  proxy_set_header       Host $host;
  proxy_set_header       X-Real-IP $remote_addr;
}
```

## Step 4 — Test and reload

```bash
sudo nginx -t          # must say: configuration file ... test is successful
sudo systemctl reload nginx
```

## Step 5 — Verify caching

```bash
# First request — cache MISS
curl -sI https://uat.atech.software/ | grep -i "x-cache-status"
# → X-Cache-Status: MISS

# Second request — cache HIT
curl -sI https://uat.atech.software/ | grep -i "x-cache-status"
# → X-Cache-Status: HIT
```
