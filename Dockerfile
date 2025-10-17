# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./src/prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/apply_migration.sh ./
RUN chmod +x /app/apply_migration.sh