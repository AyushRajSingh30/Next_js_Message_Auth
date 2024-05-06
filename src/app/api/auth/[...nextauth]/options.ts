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
        // console.log(credentials);
        // console.log(credentials.identifier);
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          // console.log("user: ", user);
          if (!user) {
            throw new Error("No user found with email and username");
          }
          // console.log("user.isverified", user.isVerified);

          if (!user.isVerified) {
            throw new Error("Plese verify your account before login");
          }

          const isPasswordcorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          // console.log("isPasswordcorrect:", isPasswordcorrect);

          if (isPasswordcorrect) {
            console.log("user:", user);
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

  //Callbacks are asynchronous functions you can use to control what happens when an action is performed. Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs.

  //datatype is define in next-auth.d.ts
  callbacks: {
    // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client). The returned value will be encrypted, and it is stored in a cookie. Without database call
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    // The session callback is called whenever a session is checked. By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token (like access_token and user.id from above) via the jwt() callback, you have to explicitly forward it here to make it available to the client.
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

  //pages mean in frontend i called SignIn page by used /sign-in
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },

  //secret required
  secret: process.env.NEXTAUTH_SECRET,
};
