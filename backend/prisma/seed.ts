import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 检查是否已存在管理员用户
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@zap.com' }
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed...');
    return;
  }

  // 创建默认管理员用户
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@zap.com',
      username: 'admin',
      password: hashedPassword,
      avatar: null,
    },
  });

  console.log('Default admin user created:', {
    id: adminUser.id,
    email: adminUser.email,
    username: adminUser.username,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });