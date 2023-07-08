FROM node:18-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
RUN npm i -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
