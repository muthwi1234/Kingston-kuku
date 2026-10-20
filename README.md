# Kingston Chicken E-commerce

A complete, production-ready e-commerce website for Kingston Chicken, a Nairobi-based chicken seller. Built with Next.js 14, Express, MongoDB, and featuring a customer storefront and admin dashboard.

## Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **lucide-react** icons
- **Zustand** for cart state (persisted to localStorage)
- **React Hook Form + Zod** for form validation
- **TanStack Query** for data fetching
- **Sonner** for toast notifications

### Backend
- **Node.js + Express** (TypeScript)
- **MongoDB** with **Mongoose ODM**
- **JWT** authentication (httpOnly cookie)
- **bcrypt** for password hashing
- **Zod** validation
- **Helmet**, **CORS**, rate limiting
- **Pino** logging

### Infrastructure
- **Docker** & **Docker Compose**
- **Nginx** ready for VPS deployment

## Project Structure

```
Kingston-kuku/
├── client/                 # Next.js frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities & API client
│   ├── public/           # Static assets
│   └── package.json
├── server/               # Express backend
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, error handling
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Validators
│   ├── prisma/           # Prisma schema & seed
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB 7+ (or use Docker)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

**Server (.env):**
```env
MONGODB_URI="mongodb://localhost:27017/kingston_chicken"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NODE_ENV="development"
PORT=5000
CLIENT_URL="http://localhost:3000"
LOG_LEVEL="info"
```

**Client (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

```bash
cd server

# Seed database (creates admin user, categories, products)
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@kingstonchicken.co.ke`
- Password: `Admin@123` (change on first login)

### 4. Run Development Servers

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

### 5. Docker Deployment (Optional)

```bash
# Build and start all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Features

### Storefront
- **Home Page:** Hero section, features strip, product grid, contact banner
- **Products Page:** Category filtering, search, responsive grid
- **Shopping Cart:** Quantity management, real-time totals
- **Checkout:** 3-step process (Delivery → Payment → Confirm)
- **M-Pesa Integration:** Manual till number verification (STK Push stubbed)
- **Contact Form:** Stores messages in database
- **Responsive Design:** Mobile-first approach

### Admin Dashboard
- **Dashboard Overview:** KPI cards (sales, orders, pending, low stock)
- **Sales Charts:** Recharts visualization
- **Product Management:** CRUD operations
- **Order Management:** Status updates, payment verification
- **Settings:** Configure delivery fee, till number, business info
- **Reports:** CSV export of sales data

### Authentication
- JWT-based authentication with httpOnly cookies
- Role-based access (CUSTOMER, ADMIN)
- Guest checkout support

### Payment Methods
- M-Pesa (Till Number: 1591045)
- Cash on Pickup
- Card (marked as coming soon)

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with category & search filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - List categories

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get my orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status (admin)
- `PATCH /api/orders/:id/verify-payment` - Verify M-Pesa payment (admin)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/reports/sales` - Sales report (CSV export)

### Settings
- `GET /api/settings` - Get all settings
- `PATCH /api/settings/:key` - Update setting (admin)

### Contact
- `POST /api/contact` - Send contact message

## Products & Pricing

| Product | Price (KSh/kg) |
|---------|---------------|
| Chicken Legs | 500 |
| Boneless | 600 |
| Wings | 500 |
| Gizzard | 500 |
| Drumsticks | 580 |
| Chicken Thighs | 480 |
| Kuku Katakata | 240 |
| Katakata Without Skin | 280 |

## Design System

### Colors
- Primary Dark Green: `#0B3D2E`
- Primary Green Hover: `#0F4F3B`
- Accent Gold: `#F5B400`
- Page Background: `#FBFAF6`
- M-Pesa Green: `#43B02A`
- Dashboard Dark: `#0F172A`

### Typography
- Font: Inter (weights 400-800)
- Headings: Bold (700-800)

### Components
- Radius: 8px buttons, 12px cards
- Soft shadows
- Smooth hover transitions

## Deployment Notes

### VPS Deployment with Nginx

1. **Build the application:**
```bash
cd client && npm run build
cd ../server && npm run build
```

2. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

3. **Use PM2 for process management:**
```bash
npm install -g pm2
pm2 start server/dist/index.js --name kingston-server
pm2 start client --name kingston-client -- start
```

## License

© 2025 Kingston Chicken. All rights reserved.