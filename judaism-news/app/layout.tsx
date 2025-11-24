import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "חדשות יהדות - המהדורה המרכזית",
    description: "אגרגטור חדשות יהדות מוביל",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="he" dir="rtl">
            <body className={inter.className}>
                <header className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-900">חדשות יהדות</h1>
                        </div>
                        <nav className="flex gap-4">
                            <a href="/" className="text-gray-600 hover:text-primary-700">ראשי</a>
                            <a href="/admin" className="text-gray-600 hover:text-primary-700">ניהול</a>
                        </nav>
                    </div>
                </header>
                <main className="min-h-screen bg-gray-50">
                    {children}
                </main>
                <footer className="bg-white border-t mt-12 py-8">
                    <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                        © {new Date().getFullYear()} חדשות יהדות. כל הזכויות שמורות.
                    </div>
                </footer>
            </body>
        </html>
    );
}
