import  Navbar  from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from '@/components/Footer'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body className='min-h-screen bg-slate-50'>
        <Navbar/>
        {children}
        <Footer/>
      </body>
      
    </html>
  );
}
