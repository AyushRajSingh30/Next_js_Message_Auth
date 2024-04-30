import NextAuth from "next-auth";
import { authOptions } from "./options";

// NextAuth is a method to take NextAuthOptions as input

const handler = NextAuth(authOptions);

// This next-auth.js route method is this
export { handler as GET, handler as POST };
