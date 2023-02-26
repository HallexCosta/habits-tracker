FROM node:18-alpine

WORKDIR /habits-tracker

RUN npm i -g pnpm

ADD ./pnpm-workspace.yaml .
ADD ./pnpm-lock.yaml .
ADD ./package.json .
ADD ./tsconfig.json .

ADD ./apps/server ./apps/server

RUN pnpm install 

RUN pnpm --filter server exec prisma generate

# COPY ./apps/server ./apps/server

# EXPOSE 3333
EXPOSE 80

CMD pnpm --filter server dev
