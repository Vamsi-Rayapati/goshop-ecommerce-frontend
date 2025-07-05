# GoShop - E-commerce Shopping Application

A modern e-commerce shopping application built with Next.js, TypeScript, and Tailwind CSS featuring authentication and product shopping functionality.

## Features

### 🔐 Authentication
- **Signup Page**: User registration with form validation
- **Login Page**: User authentication with secure form handling
- **Form Validation**: Client-side validation using React Hook Form and Zod
- **Responsive Design**: Mobile-friendly authentication forms

### 🛍️ Shopping Experience
- **Product Listing**: Browse products with filtering and sorting
- **Category Navigation**: Shop by product categories
- **Product Search**: Find specific products quickly
- **Shopping Cart**: Add products to cart (ready for cart functionality)
- **Responsive UI**: Optimized for desktop and mobile devices

### 🎨 Modern UI/UX
- **Tailwind CSS**: Clean and modern styling
- **Lucide Icons**: Beautiful and consistent iconography
- **Hover Effects**: Smooth animations and transitions
- **Accessibility**: Semantic HTML and proper form labels

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/
│   ├── about/           # About page
│   ├── categories/      # Categories page
│   ├── login/          # Login page
│   ├── onboard/        # User onboarding page
│   ├── products/       # Products listing page
│   ├── signup/         # Signup page
│   ├── layout.tsx      # Root layout with header and auth
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── components/
│   ├── Header.tsx         # Navigation header component
│   ├── OnboardingGuard.tsx # Handles onboarding redirects
│   └── ProtectedRoute.tsx  # Protected route wrapper
├── contexts/
│   └── AuthContext.tsx    # Authentication context
└── lib/
    └── api.ts            # API client and auth functions
```

## Pages Overview

### Homepage (`/`)
- Hero section with call-to-action
- Features showcase
- Featured products
- Modern landing page design

### Authentication
- **Signup** (`/signup`): User registration form
- **Login** (`/login`): User authentication form

### Shopping
- **Products** (`/products`): Product listing with filters and sorting
- **Categories** (`/categories`): Browse products by category
- **About** (`/about`): Company information and mission

### User Management
- **Onboard** (`/onboard`): Complete user profile after signup or when profile incomplete

## API Integration

The application is now integrated with your backend API endpoints:

### Authentication Endpoints
- **POST** `/auth/api/v1/signup` - User registration
- **POST** `/auth/api/v1/login` - User authentication  
- **POST** `/auth/api/v1/token/refresh` - Token refresh

### User Profile Endpoints
- **GET** `/account/api/v1/users/me` - Get current user profile
- **POST** `/account/api/v1/users/onboard` - Complete user onboarding

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Update `NEXT_PUBLIC_API_BASE_URL` to match your backend server URL:

```bash
# For local development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# For production
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### Authentication Flow
1. **Signup**: Creates new user account and returns JWT tokens → Redirects to onboarding
2. **Onboarding**: User completes profile with first/last name → Redirects to home
3. **Login**: Authenticates user and returns JWT tokens
   - If user profile incomplete (404 from `/users/me`): Redirects to onboarding
   - If user profile complete: Redirects to home
4. **Token Storage**: JWT tokens are stored in localStorage
5. **Protected Routes**: Use `ProtectedRoute` component for authenticated pages
6. **Auto Logout**: Tokens are cleared on logout

### Onboarding System
- **After Signup**: Users are automatically redirected to complete their profile
- **After Login**: If `/users/me` returns 404, user is redirected to onboarding
- **Profile Completion**: Users must provide first name and last name
- **Automatic Redirect**: OnboardingGuard component handles automatic redirects

### API Request/Response Types

#### Signup
```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  user_id: string;
  token: string;
  refresh_token: string;
}
```

#### Login
```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  user_id: string;
  token: string;
  refresh_token: string;
}
```

#### Onboarding
```typescript
// Request
{
  first_name: string;
  last_name: string;
}

// Response - UserResponse object
{
  id: string;
  username: string;
  first_name: string;
  full_name: string;
  last_name: string;
  primary_address: string;
  mobile: string;
  role: string;
  status: string;
  avatar: string;
  created_at: string;
}
```

#### User Profile (/users/me)
```typescript
// Response - UserResponse object (same as onboarding)
// Returns 404 if user needs onboarding
```

### Adding More Endpoints
To add more API endpoints, update `src/lib/api.ts` with new functions following the existing pattern.

## Customization

### Adding New Categories
Update the categories array in `src/app/categories/page.tsx`

### Modifying Products
Update the mockProducts array in `src/app/products/page.tsx`

### Styling
All styling is done with Tailwind CSS. Modify classes directly in components or extend the theme in `tailwind.config.js`.

## Deployment

The application can be deployed on any platform that supports Next.js:

- **Vercel** (recommended): Connect your GitHub repository
- **Netlify**: Build command `npm run build`, publish directory `.next`
- **Docker**: Use the included Dockerfile
- **Static hosting**: Use `npm run export` for static generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
