import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth/next";
import CredentialsProviders from "next-auth/providers/credentials";
const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProviders({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "" },
        password: { label: "password", type: "password", placeholder: "" },
      },
      async authorize(credentials: any) {
        console.log(credentials);
        const userId = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            username: true,
            password: true,
            id: true,
          },
        });
        if (userId === null) {
          return {
            id: "",
            email: "",
            username: "",
          };
        }
        return {
          id: userId.id.toString(),
          username: userId.username,
          email: credentials.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_URL,
  callbacks: {
    session: ({ session, token, userId }: any) => {
      if (session && session.userId) {
        session.userId.id = token.sub;
      }

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export const GET = handler;
export const POST = handler;

// async authorize(credentials: any) {
//         try {
//           if (process.env.LOCAL_CMS_PROVIDER) {
//             return {
//               id: '1',
//               name: 'test',
//               email: 'test@gmail.com',
//               token: await generateJWT({
//                 id: '1',
//               }),
//             };
//           }
//           const hashedPassword = await bcrypt.hash(credentials.password, 10);

//           const userDb = await prisma.user.findFirst({
//             where: {
//               email: credentials.username,
//             },
//             select: {
//               password: true,
//               id: true,
//               name: true,
//             },
//           });
//           if (
//             userDb &&
//             userDb.password &&
//             (await bcrypt.compare(credentials.password, userDb.password))
//           ) {
//             const jwt = await generateJWT({
//               id: userDb.id,
//             });
//             await db.user.update({
//               where: {
//                 id: userDb.id,
//               },
//               data: {
//                 token: jwt,
//               },
//             });
// return {
//               id: userDb.id,
//               name: userDb.name,
//               email: credentials.username,
//               token: jwt,
//             };
//           }
//           console.log('not in db');
//           const user: AppxSigninResponse = await validateUser(
//             credentials.username,
//             credentials.password,
//           );

//           const jwt = await generateJWT({
//             id: user.data?.userid,
//           });

//           if (user.data) {
//             try {
//               await db.user.upsert({
//                 where: {
//                   id: user.data.userid,
//                 },
//                 create: {
//                   id: user.data.userid,
//                   name: user.data.name,
//                   email: credentials.username,
//                   token: jwt,
//                   password: hashedPassword,
//                 },
//                 update: {
//                   id: user.data.userid,
//                   name: user.data.name,
//                   email: credentials.username,
//                   token: jwt,
//                   password: hashedPassword,
//                 },
//               });
//             } catch (e) {
//               console.log(e);
//             }

//             return {
//               id: user.data.userid,
//               name: user.data.name,
//               email: credentials.username,
//               token: jwt,
//             };
//           }

//           // Return null if user data could not be retrieved
//           return null;
//         } catch (e) {
//           console.error(e);
//         }
//         return null;
//       },
//     }),
