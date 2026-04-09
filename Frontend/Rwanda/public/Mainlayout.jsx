import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom'


const MainLayout = () => {
    
    const token = localStorage.getItem('token')
    if(!token){
     return <Navigate to='/' replace />
    }
  return (
    <div>
<Header />
      <Navbar />
      <main >
         <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
