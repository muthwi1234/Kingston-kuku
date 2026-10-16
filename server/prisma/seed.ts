import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User, { UserRole } from '../src/models/User';
import Category from '../src/models/Category';
import Product from '../src/models/Product';
import Order, { OrderStatus, PaymentMethod, DeliveryType } from '../src/models/Order';
import Setting from '../src/models/Setting';

async function getMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongo = await MongoMemoryServer.create();
    return mongo.getUri();
  } catch (error) {
    throw new Error('MONGODB_URI is not set and mongodb-memory-server is unavailable. Add a MongoDB connection string to the server .env file.');
  }
}

async function seed() {
  try {
    const mongoUri = await getMongoUri();
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Setting.deleteMany({});

    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@kingstonchicken.co.ke',
      password: hashedPassword,
      phone: '+254712345678',
      role: UserRole.ADMIN,
    });
    console.log('Created admin user');

    const categories = await Category.create([
      { name: 'Whole Chicken', slug: 'whole-chicken', description: 'Whole chicken products' },
      { name: 'Chicken Parts', slug: 'chicken-parts', description: 'Chicken cuts and parts' },
      { name: 'Specialty', slug: 'specialty', description: 'Specialty chicken products' },
    ]);
    console.log('Created categories');

    const products = await Product.create([
      {
        name: 'Chicken Legs',
        slug: 'chicken-legs',
        description: 'Fresh chicken legs',
        pricePerKg: 500,
        categoryId: categories[1]._id,
        stockKg: 100,
      },
      {
        name: 'Boneless',
        slug: 'boneless',
        description: 'Boneless chicken breast',
        pricePerKg: 600,
        categoryId: categories[1]._id,
        stockKg: 80,
      },
      {
        name: 'Wings',
        slug: 'wings',
        description: 'Fresh chicken wings',
        pricePerKg: 500,
        categoryId: categories[1]._id,
        stockKg: 60,
      },
      {
        name: 'Gizzard',
        slug: 'gizzard',
        description: 'Fresh chicken gizzard',
        pricePerKg: 500,
        categoryId: categories[2]._id,
        stockKg: 40,
      },
      {
        name: 'Drumsticks',
        slug: 'drumsticks',
        description: 'Fresh chicken drumsticks',
        pricePerKg: 580,
        categoryId: categories[1]._id,
        stockKg: 70,
      },
      {
        name: 'Chicken Thighs',
        slug: 'chicken-thighs',
        description: 'Fresh chicken thighs',
        pricePerKg: 480,
        categoryId: categories[1]._id,
        stockKg: 90,
      },
      {
        name: 'Kuku Katakata',
        slug: 'kuku-katakata',
        description: 'Pre-cut chicken pieces',
        pricePerKg: 240,
        categoryId: categories[2]._id,
        stockKg: 120,
      },
      {
        name: 'Katakata Without Skin',
        slug: 'katakata-without-skin',
        description: 'Pre-cut chicken pieces without skin',
        pricePerKg: 280,
        categoryId: categories[2]._id,
        stockKg: 100,
      },
    ]);
    console.log('Created products');

    await Setting.create([
      { key: 'delivery_fee', value: '150', description: 'Delivery fee in KSh' },
      { key: 'mpesa_till_number', value: '1591045', description: 'M-Pesa till number' },
      { key: 'business_phone', value: '+254 143 188357', description: 'Business phone number' },
      { key: 'business_address', value: 'Nairobi, Kenya', description: 'Business address' },
      { key: 'business_email', value: 'info@kingstonchicken.co.ke', description: 'Business email' },
    ]);
    console.log('Created settings');

    await Order.create([
      {
        userId: admin._id,
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            pricePerKg: products[0].pricePerKg,
            quantityKg: 2,
            subtotal: 1000,
          },
        ],
        total: 1150,
        status: OrderStatus.DELIVERED,
        paymentMethod: PaymentMethod.MPESA,
        paymentVerified: true,
        mpesaCode: 'QP12345678',
        deliveryType: DeliveryType.DELIVERY,
        address: '123 Nairobi Street',
      },
      {
        userId: admin._id,
        items: [
          {
            productId: products[1]._id,
            productName: products[1].name,
            pricePerKg: products[1].pricePerKg,
            quantityKg: 1.5,
            subtotal: 900,
          },
        ],
        total: 1050,
        status: OrderStatus.CONFIRMED,
        paymentMethod: PaymentMethod.MPESA,
        paymentVerified: true,
        mpesaCode: 'QP87654321',
        deliveryType: DeliveryType.PICKUP,
      },
    ]);
    console.log('Created sample orders');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
