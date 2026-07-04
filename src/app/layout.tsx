import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/providers/app-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "assistant",
  description:
    "A dark-theme AI assistant console: hover-reveal provider bar, per-model theming, inline reasoning steps, and a responsive composer — fully simulated client-side, provider-agnostic.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">
        <AppProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
