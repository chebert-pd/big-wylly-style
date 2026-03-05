import "./globals.css"
import localFont from "next/font/local"
import { SmoothCornersInit } from "./smooth-corners-init"

// Runs before hydration to restore color-theme + dark mode without flash.
const antiFlashScript = `(function(){try{
  var ct=localStorage.getItem('color-theme');
  if(ct==='black')document.documentElement.setAttribute('data-theme','black');
  var t=localStorage.getItem('theme');
  if(t==='dark'){document.documentElement.classList.add('dark');}
  else if(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.classList.add('dark');}
}catch(e){}})()`

const inter = localFont({
  src: "../public/fonts/InterVariable.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
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
    <html lang="en" className={inter.variable}>
      <body>
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
        <SmoothCornersInit />
        {children}
      </body>
    </html>
  )
}