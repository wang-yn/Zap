-- 初始化数据库脚本
CREATE DATABASE zapdb;
GRANT ALL PRIVILEGES ON DATABASE zapdb TO zapuser;

-- 注意：在运行 Prisma migrate 和 seed 之前需要先创建数据库
-- 运行以下命令完成完整初始化：
-- 1. npx prisma migrate deploy (或 npx prisma db push)
-- 2. npm run db:seed
