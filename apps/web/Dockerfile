FROM node:18-alpine

WORKDIR /habits-tracker

ADD pnpm-workspace.yaml .
ADD pnpm-lock.yaml .
ADD package.json .
ADD tsconfig.json .

COPY ./apps/web ./habits-tracker/apps/web

RUN npm i -g pnpm
RUN pnpm -v
RUN pnpm install

# COPY ./apps/web ./apps/web

# CMD ["pnpm", "--filter", "web", "dev"]