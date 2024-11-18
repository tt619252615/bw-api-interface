FROM --platform=$TARGETPLATFORM node:18-alpine

WORKDIR /app

COPY bw.js package*.json ./
RUN npm install

EXPOSE 3000

CMD ["node", "bw.js"]
