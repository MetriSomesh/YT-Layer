import { PrismaClient } from "@prisma/client";
import { SignJWT, importJWK } from "jose";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface CustomUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

const generateJWT = async (payload: any) => {
  const secret = process.env.JWT_SECRET || "secret";
  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2w")
    .sign(jwk);
  return jwt;
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "" },
        password: { label: "password", type: "password", placeholder: "" },
      },
      async authorize(credentials: any) {
        await prisma.$connect();
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          await prisma.$disconnect();
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          await prisma.$disconnect();
          return null;
        }

        const jwtToken = await generateJWT({ id: user.id });
        await prisma.$disconnect();
        return {
          id: user.id.toString(),
          name: user.username,
          email: credentials.email,
          token: jwtToken,
        } as CustomUser;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.uid = customUser.id;
        token.jwtToken = customUser.token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.uid as string,
          jwtToken: token.jwtToken as string,
        };
      }
      console.log(session.user);
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export const GET = handler;
export const POST = handler;
