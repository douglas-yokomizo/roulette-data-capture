import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SignupProvider } from "./contexts/SignupContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignupProvider>
      <html lang="en" className={GeistSans.className}>
        <body>
          <main>{children}</main>
        </body>
      </html>
    </SignupProvider>
  );
}
