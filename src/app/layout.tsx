import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Wordle",
  description: "Next Worlde: word guessing game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
