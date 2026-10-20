import { PrismaClient, UserRole, PaymentMethod, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kingstonchicken.co.ke' },
    update: {},
    create: {
      email: 'admin@kingstonchicken.co.ke',
      password: hashedPassword,
      name: 'Admin User',
      phone: '+254712345678',
      role: UserRole.ADMIN,
    },
  });
  console.log('Created admin user:', admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'chicken-legs' },
      update: {},
      create: { name: 'Chicken Legs', slug: 'chicken-legs', description: 'Fresh chicken legs' },
    }),
    prisma.category.upsert({
      where: { slug: 'boneless' },
      update: {},
      create: { name: 'Boneless', slug: 'boneless', description: 'Boneless chicken cuts' },
    }),
    prisma.category.upsert({
      where: { slug: 'wings' },
      update: {},
      create: { name: 'Wings', slug: 'wings', description: 'Chicken wings' },
    }),
    prisma.category.upsert({
      where: { slug: 'gizzard' },
      update: {},
      create: { name: 'Gizzard', slug: 'gizzard', description: 'Fresh chicken gizzard' },
    }),
    prisma.category.upsert({
      where: { slug: 'drumsticks' },
      update: {},
      create: { name: 'Drumsticks', slug: 'drumsticks', description: 'Chicken drumsticks' },
    }),
    prisma.category.upsert({
      where: { slug: 'chicken-thighs' },
      update: {},
      create: { name: 'Chicken Thighs', slug: 'chicken-thighs', description: 'Chicken thighs' },
    }),
    prisma.category.upsert({
      where: { slug: 'kuku-katakata' },
      update: {},
      create: { name: 'Kuku Katakata', slug: 'kuku-katakata', description: 'Kuku katakata' },
    }),
    prisma.category.upsert({
      where: { slug: 'katakata-without-skin' },
      update: {},
      create: { name: 'Katakata Without Skin', slug: 'katakata-without-skin', description: 'Katakata without skin' },
    }),
  ]);
  console.log('Created categories:', categories.length);

  // Create products
  const products = [
    { name: 'Chicken Legs', slug: 'chicken-legs', price: 500, categoryId: categories[0].id },
    { name: 'Boneless', slug: 'boneless', price: 600, categoryId: categories[1].id },
    { name: 'Wings', slug: 'wings', price: 500, categoryId: categories[2].id },
    { name: 'Gizzard', slug: 'gizzard', price: 500, categoryId: categories[3].id },
    { name: 'Drumsticks', slug: 'drumsticks', price: 580, categoryId: categories[4].id },
    { name: 'Chicken Thighs', slug: 'chicken-thighs', price: 480, categoryId: categories[5].id },
    { name: 'Kuku Katakata', slug: 'kuku-katakata', price: 240, categoryId: categories[6].id },
    { name: 'Katakata Without Skin', slug: 'katakata-without-skin', price: 280, categoryId: categories[7].id },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: `Fresh ${product.name} - Quality you can taste`,
        pricePerKg: product.price,
        stockKg: 50,
        imageUrl: `/products/${product.slug}.jpg`,
        categoryId: product.categoryId,
        isActive: true,
        lowStockThreshold: 5,
      },
    });
  }
  console.log('Created products:', products.length);

  // Create settings
  await prisma.setting.upsert({
    where: { key: 'delivery_fee' },
    update: {},
    create: { key: 'delivery_fee', value: '150', description: 'Delivery fee in KSh' },
  });

  await prisma.setting.upsert({
    where: { key: 'mpesa_till_number' },
    update: {},
    create: { key: 'mpesa_till_number', value: '1591045', description: 'M-Pesa till number' },
  });

  await prisma.setting.upsert({
    where: { key: 'business_phone' },
    update: {},
    create: { key: 'business_phone', value: '+254 143 188357', description: 'Business phone number' },
  });

  await prisma.setting.upsert({
    where: { key: 'business_name' },
    update: {},
    create: { key: 'business_name', value: 'Kingston Chicken', description: 'Business name' },
  });

  console.log('Created settings');

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-001',
      userId: admin.id,
      guestName: 'John Doe',
      guestPhone: '+254711234567',
      deliveryType: 'delivery',
      address: '123 Nairobi West',
      notes: 'Leave at gate',
      subtotal: 1500,
      deliveryFee: 150,
      total: 1650,
      paymentMethod: PaymentMethod.MPESA,
      mpesaCode: 'QP12345678',
      paymentStatus: 'VERIFIED',
      status: OrderStatus.COMPLETED,
      items: {
        create: [
          {
            productId: products[0].id,
            quantityKg: 2,
            pricePerKg: 500,
            subtotal: 1000,
          },
          {
            productId: products[1].id,
            quantityKg: 1,
            pricePerKg: 500,
            subtotal: 500,
          },
        ],
      },
    },
  });
  console.log('Created sample order:', order1.orderNumber);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
