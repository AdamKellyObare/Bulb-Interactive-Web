FROM node:18.17.1 as build
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build:ssr


FROM nginx:latest
COPY --from=build app/dist/bulb_interactive/browser /usr/share/nginx/html
EXPOSE 8000
