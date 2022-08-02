import type { NextPage } from 'next'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import React from 'react'
interface LayoutProps {
  children:React.ReactNode
}
const Layout = ({ children}:LayoutProps) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
