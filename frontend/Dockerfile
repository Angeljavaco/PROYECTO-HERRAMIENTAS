FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG REACT_APP_API_BASE_URL=http://localhost:8080/OnlineStoreApp
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV GENERATE_SOURCEMAP=false

RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN npm install -g serve@14.2.4

COPY --from=build --chown=node:node /app/build ./build

USER node

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
