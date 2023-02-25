FROM node:18-alpine

WORKDIR /habits-tracker

ADD pnpm-workspace.yaml .
ADD pnpm-lock.yaml .
ADD package.json .
ADD tsconfig.json .

COPY ./apps/server ./habits-tracker/apps/server

RUN npm i -g pnpm
RUN pnpm -v
RUN pnpm install

# COPY ./apps/server ./apps/server

CMD ["pnpm", "--filter", "server", "dev"]
