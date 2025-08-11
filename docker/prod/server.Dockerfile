FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./
COPY server/prisma ./prisma

RUN npm ci

RUN npx prisma generate

COPY server/ .

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 5000

CMD ["node", "dist/server.js"]