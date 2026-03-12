# Multi-stage Dockerfile for Sanatte Frontend

# Stage 1: build Angular app
FROM node:20-alpine AS builder
WORKDIR /app

# Allow specifying the Angular configuration at build time (default: staging)
ARG NG_CONFIG=staging
ENV NG_CONFIG=${NG_CONFIG}

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=$NG_CONFIG

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist/sanatte_frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
