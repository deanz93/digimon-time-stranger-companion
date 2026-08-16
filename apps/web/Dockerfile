FROM node:22-alpine
RUN corepack enable
WORKDIR /app
COPY . .
RUN corepack prepare pnpm@10.15.0 --activate && pnpm install --frozen-lockfile=false && pnpm --filter @dts/web build
EXPOSE 3000
CMD ["pnpm","--filter","@dts/web","start"]
