import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";

/**
 *  This is the way of declaring metadata for the page in next js
 */
export const metadata = {
  title: "Threads",
  description: "A Next.js 13.4 Meta Threads Application.",
};

/**
 * This is the way of using font in next js
 */
const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /**
     * Need to have a CLERK_SECRET_KEY from clerk by creating a new application in clerk website where we can set authentication of different sign like google, facebook, email and password, github and more.
     *
     * also create a middleware.ts file in the root directory to create protection over our routes.
     */
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="w-full flex justify-center items-center min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
