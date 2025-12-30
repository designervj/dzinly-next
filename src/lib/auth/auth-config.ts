import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userService } from './user-service';
import { tenantService } from '../tenant/tenant-service';

export const authConfig: NextAuthConfig = {
  // Dynamically set the base URL based on environment
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantSlug: { label: 'Tenant', type: 'hidden' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
       
          return null;
        }
        const inputTenantSlug = credentials.tenantSlug as string;
       
    
        // Get tenant
      const tenant = await tenantService.getTenantBySlug(inputTenantSlug);
    
        // if (!tenant || tenant.status !== 'active') {
        //   return null;
        // }

   
        // Get user
        const user = await userService.getUserByEmail(
          // tenant._id,
          credentials.email as string
        );

  console.log("useruseruseruser",user)

        if (!user ) {
          return null;
        }
        // Verify password
        const isValid = await userService.verifyPassword(
          user,
          credentials.password as string
        );
          console.log(" error password",isValid)
        if (!isValid) {
          console.log(" error password",isValid)
          return null;
        }
          console.log("user====", user)
        // Update last login
        await userService.updateLastLogin(user._id);
        let resolvedTenantId = "";
        let resolvedTenantSlug = "";
        // UserRole 'C' is customer/client
        if (user.role !== "C" && tenant) {
          resolvedTenantId = tenant._id?.toString?.() || "";
          resolvedTenantSlug = tenant.slug || "";
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          tenantId: resolvedTenantId,
          tenantSlug: resolvedTenantSlug,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.name = user.name;
        token.email = user.email;
        token.tenantId = user?.tenantId??"";
        token.tenantSlug = user.tenantSlug??"";
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantSlug = token.tenantSlug as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};
