FROM  registry.access.redhat.com/ubi8/nodejs-20:latest as base

WORKDIR /src
COPY package.json package-lock.json /src/
EXPOSE 3000

# Change ownership of the current directory to the 'node' user
USER root
RUN chown -R 1001:0 /src

# Switch to the 'node' user
USER 1001

ENV NODE_ENV=production
RUN npm install
COPY . /src
CMD ["npm","start"]

