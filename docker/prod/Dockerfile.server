FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 5000

CMD ["node", "dist/server.js"]