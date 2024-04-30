import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      // `credentials` is used to generate a form on the sign in page mean genrated ui of sign in page.
      // in this case behind the scenes html make form on bases of credentials email and password fields you add more like username it also make username input in this form
      credentials: {
        //we used email and password key for access this in authorize function 👇
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      //if you created custome crediential than we need to make authorize

      // authorize function hold a logic of login , cheak username and email is valid or not or password is corrected or not. but we used O-Authincation that time we not need authorize next-auth automaticaly do authincation and it always return promise.

      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier.email },
              { username: credentials.identifier.username },
            ],
          });
          if (!user) {
            throw new Error("No user found with email and username");
          }

          if (!user.isVerified) {
            throw new Error("Plese verify your account before login");
          }

          const isPasswordcorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordcorrect) {
            return user;
          } else {
            throw new Error("Password Incorrected");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],

  //jwt and session is modifyed in (next-auth.d.ts)  file
  //we used callback because we used jwt and session we easly access from token and session.
  //we modify callback because we not call database again and again we only call database one time and extract all values from database.

  //By using these callbacks, you can customize the JWT and session objects to include additional data or modify existing data as per your requirements. This can be useful for enhancing security, optimizing performance, or adding custom user attributes to the authentication flow.
  //By using these callbacks, you can customize the JWT and session objects to include additional data or modify existing data as per your requirements. This can be useful for enhancing security, optimizing performance, or adding custom user attributes to the authentication flow.

  callbacks: {
    //user come from authOption and user store in jwt
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, user, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },

  //perpose of pages is /auth show in route we used pages that time we used /sign-in it replace /auth
  //by using this method pages we not need to desine pages of sign-in this auth mehod automaticaly desine new page for sign-in on route /sign-in
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },

  //secret required
  secret: process.env.NEXTAUTH_SECRET,
};
