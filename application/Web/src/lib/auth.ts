import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@sitestack/schemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Username, email or phone", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "text" },
      },
      async authorize(credentials) {
        // signIn() coerces booleans to strings — normalize before validating.
        const normalized = {
          ...credentials,
          rememberMe: credentials?.rememberMe === "true",
        };
        const parsed = loginSchema.safeParse(normalized);
        if (!parsed.success) return null;

        // Replace with your actual backend API call
        // const res = await apiClient.post("/auth/login", parsed.data);
        // return res.data.user;

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: unknown }).role = token.role;
      }
      return session;
    },
  },
});
