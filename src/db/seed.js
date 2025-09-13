import bcrypt from 'bcryptjs';
import prisma from "./prisma.js";

const SALT_ROUNDS = 10;

async function main() {
  const adminPasswordHash = await bcrypt.hash('admin123', SALT_ROUNDS);
  const userPasswordHash = await bcrypt.hash('user123', SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      Name: 'Admin User',
      email: 'admin@example.com',
      password: adminPasswordHash,
      rol: 'ADMIN',
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      Name: 'Normal User',
      email: 'user@example.com',
      password: userPasswordHash,
      rol: 'USER',
    },
  });

  const post = await prisma.post.create({
    data: {
      title: 'Mi primer post',
      content: 'Este es el contenido del post de prueba',
      image: 'https://picsum.photos/200',
      published: true,
      author: {
        connect: { id: normalUser.id },
      },
    },
  });

  const comment = await prisma.comments.create({
    data: {
      author: { connect: { id: admin.id } },
      post: { connect: { id: post.id } },
    },
  });

  console.log('Seed completado ✅');
  console.log({
    admin: { id: admin.id, email: admin.email },
    user: { id: normalUser.id, email: normalUser.email },
    post: { id: post.id, title: post.title },
    comment: { id: comment.id },
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