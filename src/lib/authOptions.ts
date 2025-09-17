import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

function getStringProperty(obj: unknown, key: string): string | undefined {
  if (typeof obj !== 'object' || obj === null) return undefined;
  const dict = obj as Record<string, unknown>;
  const value = dict[key];
  return typeof value === 'string' ? value : undefined;
}

async function authenticateUser(username: string, password: string) {
  try {
    const user = await prisma.admin.findUnique({
      where: { username }
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return {
      id: user.id.toString(),
      username: user.username,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const user = await authenticateUser(credentials.username, credentials.password);
        if (user) return user;
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 6 * 60 * 60,
  },
  jwt: {
    maxAge: 6 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const id = getStringProperty(user, 'id');
        if (id) token.id = id;
        const username = getStringProperty(user, 'username');
        if (username) token.username = username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === 'string') session.user.id = token.id as string;
        if (typeof token.username === 'string') session.user.username = token.username as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
  }
}


