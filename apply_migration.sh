! /bin/sh
echo "Running Prisma migrations in development..."
npx prisma migrate dev --name init-scheme
echo "Prisma migrations applied."
echo "Running Prisma seeds in development..."
npx prisma db seed
echo "Prisma seeds applied."

