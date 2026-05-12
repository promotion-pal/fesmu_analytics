FROM node:20-alpine

EXPOSE 4000

RUN apk add --no-cache openssl && \
    npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start:prod"]
