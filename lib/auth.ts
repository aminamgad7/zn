import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import User from '@/models/User';

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
        role: { label: 'نوع الحساب', type: 'text' },
        name: { label: 'الاسم', type: 'text' },
        phone: { label: 'رقم الهاتف', type: 'text' },
        isRegistering: { label: 'تسجيل جديد', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
        }

        await connectDB();

        // Check if this is a registration request
        if (credentials.isRegistering === 'true') {
          // Check if user already exists
          const existingUser = await User.findOne({ email: credentials.email.toLowerCase() });
          if (existingUser) {
            throw new Error('المستخدم موجود بالفعل');
          }

          // Hash password
          const hashedPassword = await bcrypt.hash(credentials.password, 12);

          // Create new user
          const newUser = await User.create({
            name: credentials.name,
            email: credentials.email.toLowerCase(),
            password: hashedPassword,
            role: credentials.role || 'customer',
            phone: credentials.phone,
          });

          return {
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            phone: newUser.phone,
            isActive: newUser.isActive,
          };
        } else {
          // Login flow
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          if (!user) {
            throw new Error('بيانات الدخول غير صحيحة');
          }

          if (!user.isActive) {
            throw new Error('الحساب غير مفعل');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error('بيانات الدخول غير صحيحة');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            isActive: user.isActive,
          };
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}