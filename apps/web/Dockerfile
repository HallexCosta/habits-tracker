FROM node:18-alpine

WORKDIR /habits-tracker

RUN npm i -g pnpm

ADD ./pnpm-workspace.yaml .
ADD ./pnpm-lock.yaml .
ADD ./package.json .
ADD ./tsconfig.json .

ADD ./apps/web ./apps/web

RUN pnpm install 

EXPOSE 3333

CMD pnpm --filter web dev
