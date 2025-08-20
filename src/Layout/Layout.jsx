import Footer from '@/comp/Footer/Footer'
import Header from '@/comp/Header/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='bg-gradient-to-br from-gray-900 to-gray-800'>
        <Header/>

        <Outlet/>

        <Footer/>
    </div>
  )
}

export default Layout