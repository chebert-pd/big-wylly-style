import "./globals.css"
import localFont from "next/font/local"
import { JetBrains_Mono } from "next/font/google"
import { SmoothCornersInit } from "./smooth-corners-init"

// Runs before hydration to restore dark mode without flash.
const antiFlashScript = `(function(){try{
  var t=localStorage.getItem('theme');
  if(t==='dark'){document.documentElement.classList.add('dark');}
  else if(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.classList.add('dark');}
  document.documentElement.removeAttribute('data-theme');
  localStorage.removeItem('color-theme');
}catch(e){}})()`

const inter = localFont({
  src: "../public/fonts/InterVariable.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata = {
  title: "Design System",
  description: "Design system gallery",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
        <SmoothCornersInit />
        {children}
      </body>
    </html>
  )
}