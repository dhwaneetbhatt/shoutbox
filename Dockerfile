FROM node:10-alpine

# install required packages and setup workdir
RUN apk add --no-cache curl && \
  mkdir -p /app && chown node:node /app
WORKDIR /app

# switch to non-root user
USER node

# install dependencies
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

# copy code
COPY --chown=node:node . .

# setup healthcheck
HEALTHCHECK --start-period=5s CMD curl --fail http://localhost:3000/healthcheck

# setup the executable
EXPOSE 3000
CMD ["node", "server.js"]
