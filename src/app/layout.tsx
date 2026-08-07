import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Management System",
  description: "Minimal CRUD demo frontend for the Student Management Spring Boot API",
};

/**
 * Runs synchronously before React hydrates — reads localStorage and applies
 * the `dark` class immediately so there is never a flash of wrong theme.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('sms-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        {/* Blocking script — must be first child to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <AuthProvider>
            <Nav />
            <main className="container">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
