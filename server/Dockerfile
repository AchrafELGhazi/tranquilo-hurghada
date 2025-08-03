FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build
RUN adduser -D -s /bin/sh nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 5000
CMD ["npm", "start"]