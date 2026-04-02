import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { AdminProvider } from "./lib/AdminContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shan Jiang | Health Economist",
  description:
    "Personal academic website of Shan Jiang — PhD Candidate at MUCHE, Macquarie University. Research in distributional cost-effectiveness analysis, health equity, and advanced health economic modelling.",
  keywords: ["Shan Jiang", "DCEA", "health economics", "equity", "MUCHE", "Macquarie"],
  openGraph: {
    title: "Shan Jiang | Health Economist",
    description: "Research in distributional cost-effectiveness analysis and health equity.",
    url: "https://shanjiang.com",
    siteName: "Shan Jiang",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@ShanJiangHE",
    creator: "@ShanJiangHE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AdminProvider>
          <div className="page-wrapper">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
        </AdminProvider>
      </body>
    </html>
  );
}
