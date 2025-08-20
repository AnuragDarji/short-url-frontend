import Header from '@/comp/Header/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='bg-gradient-to-br from-gray-900 to-gray-800'>
        <Header/>

        <Outlet/>
    </div>
  )
}

export default Layout