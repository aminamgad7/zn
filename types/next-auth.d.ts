import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      phone?: string;
      isActive: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
    isActive: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    phone?: string;
    isActive: boolean;
  }
}