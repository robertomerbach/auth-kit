# Auth Kit 🔐

A modern authentication starter kit built with **Next.js 15**, **Prisma**, and **NextAuth.js**.  
This project provides a robust foundation for implementing authentication in your web applications.

---

## Features ✨

- 🔒 Secure authentication system  
- 👤 User management with Prisma  
- 📧 Email verification  
- 🔑 Password reset functionality  
- 🎨 Modern UI with Tailwind CSS and Radix UI  
- 🌓 Dark/Light mode support  
- 🔐 Protected routes and API endpoints  
- 📱 Responsive design  
- 🌐 Internationalization support  

---

## Tech Stack 🛠️

- **Framework**: Next.js 15.3.2  
- **Database ORM**: Prisma 6.8.2  
- **Authentication**: NextAuth.js 4  
- **UI Components**: Radix UI  
- **Styling**: Tailwind CSS  
- **Form Handling**: React Hook Form  
- **Validation**: Zod  
- **API Client**: Axios  
- **Email Service**: Resend  
- **State Management**: TanStack Query (React Query)  
- **TypeScript**: For type safety  

---

## Getting Started 🚀

### Prerequisites

- Node.js (Latest LTS version recommended)  
- PostgreSQL database  
- npm or yarn package manager  

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/robertomerbach/auth-kit.git
   cd auth-kit


### Environment Variables
Rename the `.env.example` file to `.env` and set up your environment variables in root of the project.

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

DATABASE_URL=postgresql://your_username:your_password@localhost:5432/your_database_name

RESEND_API_KEY=your-resend-api-key

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

```

### Running the project in development mode

```bash
pnpm install
pnpm dev
```

### Running the project in production mode

```bash
pnpm build
pnpm start
```

