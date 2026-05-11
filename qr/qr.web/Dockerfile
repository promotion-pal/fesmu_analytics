FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm run build

EXPOSE 4173

CMD ["pnpm", "run", "preview", "--host", "0.0.0.0", "--port", "4173"]