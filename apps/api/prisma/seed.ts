import { PrismaClient } from '@prisma/client';
import faker from 'faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = [];
  for (let i = 0; i < 5; i++) {
    const c = await prisma.category.create({ data: { name: faker.commerce.department(), slug: `cat-${i}`, description: faker.commerce.productDescription() } });
    categories.push(c);
  }

  for (let i = 0; i < 15; i++) {
    const cat = categories[i % categories.length];
    await prisma.product.create({ data: { name: faker.commerce.productName(), slug: `prod-${i}`, description: faker.commerce.productDescription(), price: parseFloat(faker.commerce.price()), imageUrl: faker.image.imageUrl(), stock: Math.floor(Math.random() * 100), categoryId: cat.id } });
  }

  await prisma.user.create({ data: { name: 'Admin User', email: 'admin@example.com', passwordHash: await require('bcrypt').hash('password', 10) } });

  console.log('Seeding finished');
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
