import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SignupProvider } from "./contexts/SignupContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Afya Roleta",
  description: "Projeto de roleta de prêmios",
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
