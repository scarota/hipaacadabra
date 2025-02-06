import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth(
  async function middleware(req: { kindeAuth: any }) {
    // console.log("look at me", req.kindeAuth);
  },
  {
    isReturnToCurrentPage: true,
  },
);

export const config = {
  matcher: [
    "/customers/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/portal/:path*",
    "/schema/:path*",
    "/profile/:path*",
    "/invoices/:path*",
  ],
};
