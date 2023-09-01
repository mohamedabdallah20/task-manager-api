FROM node:16 as base
WORKDIR /app
COPY package.json .


FROM base as production

RUN npm install --omit=dev
COPY . .
EXPOSE 8888
CMD ["npm", "run", "start"]

FROM base as development

RUN npm install
COPY . .
EXPOSE 8888
CMD ["npm", "run", "docker-dev"]