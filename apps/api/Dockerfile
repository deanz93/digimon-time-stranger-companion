FROM node:22-alpine
RUN corepack enable
WORKDIR /app
COPY . .
RUN corepack prepare pnpm@10.15.0 --activate && pnpm install --frozen-lockfile=false && pnpm db:generate && pnpm --filter @dts/api build
EXPOSE 4000
CMD ["pnpm","--filter","@dts/api","start"]
