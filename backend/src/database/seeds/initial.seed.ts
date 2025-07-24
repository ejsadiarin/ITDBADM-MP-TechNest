import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { CartItem } from '../../cart-items/entities/cart-item.entity';
import { Order, OrderStatus } from '../../orders/entities/order.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

export async function runSeed(dataSource: DataSource) {
  console.log('Seeding database...');

  // Get repositories
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  const productRepository = dataSource.getRepository(Product);
  const inventoryRepository = dataSource.getRepository(Inventory);
  const cartRepository = dataSource.getRepository(Cart);
  const cartItemRepository = dataSource.getRepository(CartItem);
  const orderRepository = dataSource.getRepository(Order);
  const orderItemRepository = dataSource.getRepository(OrderItem);

  // 1. Insert Users
  const usersData = [
    {
      username: 'admin_user',
      email: 'admin@technest.com',
      password_hash: '$2b$10$examplehash.admin',
      first_name: 'Admin',
      last_name: 'User',
      address: '1 Admin Way',
      phone_number: '111-222-3333',
      role: UserRole.ADMIN,
    },
    {
      username: 'staff_user',
      email: 'staff@technest.com',
      password_hash: '$2b$10$examplehash.staff',
      first_name: 'Staff',
      last_name: 'Person',
      address: '2 Staff St',
      phone_number: '444-555-6666',
      role: UserRole.STAFF,
    },
    {
      username: 'johndoe',
      email: 'john.doe@email.com',
      password_hash: '$2b$10$examplehash.customer',
      first_name: 'John',
      last_name: 'Doe',
      address: '123 Maple Street',
      phone_number: '123-456-7890',
      role: UserRole.CUSTOMER,
    },
    {
      username: 'janesmith',
      email: 'jane.smith@email.com',
      password_hash: '$2b$10$examplehash.customer2',
      first_name: 'Jane',
      last_name: 'Smith',
      address: '456 Oak Avenue',
      phone_number: '987-654-3210',
      role: UserRole.CUSTOMER,
    },
  ];
  const users = await userRepository.save(usersData);
  console.log('Users seeded.');

  // 2. Insert Categories
  const categoriesData = [
    {
      name: 'Smartphones',
      description: 'The latest and greatest smartphones from top brands.',
    },
    {
      name: 'Laptops',
      description: 'Powerful laptops for work, gaming, and everyday use.',
    },
    {
      name: 'Audio',
      description: 'Headphones, earbuds, and speakers for immersive sound.',
    },
    {
      name: 'Gaming Peripherals',
      description:
        'Mice, keyboards, and headsets for the ultimate gaming experience.',
    },
    {
      name: 'Accessories',
      description: 'Chargers, cases, and other essential tech accessories.',
    },
  ];
  const categories = await categoryRepository.save(categoriesData);
  console.log('Categories seeded.');

  // 3. Insert Products
  const productsData = [
    {
      name: 'TechPhone 12',
      description:
        'A flagship smartphone with a stunning display and pro-grade camera.',
      price: 999.99,
      category_id: categories[0].category_id,
      image_url: '/images/techphone12.jpg',
      brand: 'TechBrand',
    },
    {
      name: 'ProBook X',
      description:
        'An ultrathin laptop with exceptional performance and all-day battery life.',
      price: 1299.99,
      category_id: categories[1].category_id,
      image_url: '/images/probookx.jpg',
      brand: 'TechBrand',
    },
    {
      name: 'SoundWave Buds',
      description:
        'True wireless earbuds with active noise cancellation and rich audio.',
      price: 149.99,
      category_id: categories[2].category_id,
      image_url: '/images/soundwavebuds.jpg',
      brand: 'AudioPhile',
    },
    {
      name: 'GamerKey Pro',
      description:
        'A mechanical gaming keyboard with customizable RGB lighting.',
      price: 119.99,
      category_id: categories[3].category_id,
      image_url: '/images/gamerkeypro.jpg',
      brand: 'GamerGear',
    },
    {
      name: 'PowerUp Charger',
      description: 'A fast-charging wall adapter for all your devices.',
      price: 29.99,
      category_id: categories[4].category_id,
      image_url: '/images/powerupcharger.jpg',
      brand: 'TechBrand',
    },
    {
      name: 'Stealth Mouse',
      description:
        'A high-precision wireless gaming mouse with an ergonomic design.',
      price: 89.99,
      category_id: categories[3].category_id,
      image_url: '/images/stealthmouse.jpg',
      brand: 'GamerGear',
    },
  ];
  const products = await productRepository.save(productsData);
  console.log('Products seeded.');

  // 4. Populate Inventory
  const inventoryData = [
    { product_id: products[0].product_id, stock_quantity: 100 },
    { product_id: products[1].product_id, stock_quantity: 50 },
    { product_id: products[2].product_id, stock_quantity: 200 },
    { product_id: products[3].product_id, stock_quantity: 75 },
    { product_id: products[4].product_id, stock_quantity: 500 },
    { product_id: products[5].product_id, stock_quantity: 120 },
  ];
  await inventoryRepository.save(inventoryData);
  console.log('Inventory seeded.');

  // 5. Create Carts for Customers
  const cartsData = [
    { user_id: users[2].user_id }, // John Doe
    { user_id: users[3].user_id }, // Jane Smith
  ];
  const carts = await cartRepository.save(cartsData);
  console.log('Carts seeded.');

  // 6. Add Items to John Doe's Cart
  const cartItemsDataJohn = [
    {
      cart_id: carts[0].cart_id,
      product_id: products[0].product_id,
      quantity: 1,
    }, // TechPhone 12
    {
      cart_id: carts[0].cart_id,
      product_id: products[3].product_id,
      quantity: 1,
    }, // GamerKey Pro
  ];
  await cartItemRepository.save(cartItemsDataJohn);
  console.log(`John Doe's cart items seeded.`);

  // 7. Add Items to Jane Smith's Cart
  const cartItemsDataJane = [
    {
      cart_id: carts[1].cart_id,
      product_id: products[2].product_id,
      quantity: 2,
    }, // SoundWave Buds
  ];
  await cartItemRepository.save(cartItemsDataJane);
  console.log(`Jane Smith's cart items seeded.`);

  // 8. Create a past order for John Doe
  const orderJohn = await orderRepository.save({
    user_id: users[2].user_id,
    total_amount: 89.99,
    status: OrderStatus.DELIVERED,
    shipping_address: '123 Maple Street',
  });
  await orderItemRepository.save({
    order_id: orderJohn.order_id,
    product_id: products[5].product_id,
    quantity: 1,
    price_at_purchase: 89.99,
  });
  console.log(`John Doe's past order seeded.`);

  console.log('Database seeding complete.');
}
