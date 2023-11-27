import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Experience the Future of Interview Prep with VRPlaced",
  description:
    "Ace Your HR Interview - Chat with Our AI Coach Now! Start by saying 'Hello' to begin your journey.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
