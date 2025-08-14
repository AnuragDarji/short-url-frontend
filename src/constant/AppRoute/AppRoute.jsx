import Layout from '@/Layout/Layout'
import Home from '@/pages/Home/Home'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AppRoute = () => {
  return (
    <Routes>
        <Route path='/' element={<Layout/>}>
            <Route index element={<Home/>}/>
        </Route>
    </Routes>
  )
}

export default AppRoute