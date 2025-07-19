# Arabic E-commerce Platform

A comprehensive Arabic e-commerce platform built with Next.js 14, supporting multiple user roles including vendors, marketers, wholesalers, and customers.

## Features

- **Multi-role System**: Support for admin, vendor, marketer, wholesaler, and customer roles
- **Arabic Language Support**: Full RTL (Right-to-Left) layout support
- **Authentication**: Secure authentication with NextAuth.js
- **Product Management**: Complete product catalog with categories
- **Order Management**: Comprehensive order processing system
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with RTL support
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose ODM
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ribh-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/arabic-ecommerce
   
   # NextAuth
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   NEXTAUTH_URL=http://localhost:3000
   
   # Application
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud MongoDB instance.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ribh-v2/
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── products/          # Product pages
│   ├── vendor/            # Vendor pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── lib/                   # Utility libraries
├── models/                # Mongoose data models
├── types/                 # TypeScript type definitions
└── middleware.ts          # Next.js middleware
```

## User Roles

### Admin
- Full platform management
- User management
- System configuration

### Vendor
- Product management
- Inventory control
- Order processing

### Marketer
- Affiliate marketing
- Commission tracking
- Marketing tools

### Wholesaler
- Bulk pricing
- Large quantity orders
- Special discounts

### Customer
- Product browsing
- Shopping cart
- Order placement

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/products` - Product management
- `/api/categories` - Category management

## Database Models

- **User**: User accounts with role-based access
- **Product**: Product catalog with multilingual support
- **Category**: Product categories with hierarchical structure
- **Order**: Order management with status tracking

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- RTL support for Arabic language

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Base URL for NextAuth.js | Yes |
| `NODE_ENV` | Environment mode | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. "# zn" 
