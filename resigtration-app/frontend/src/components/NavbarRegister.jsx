import React from 'react'
import { useLocation, Link } from 'react-router-dom'

const NavbarRegister = () => {
    const location = useLocation();

    const showNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/phone' || location.pathname === '/email';

    if (!showNavbar) return null;

  return (
    <div className='p-4 space-x-4 shadow text-black-800 bg-blue-500 sticky flex justify-end'>
        <Link to='/login' className="mx-5 mr-2 hover:underline">Login</Link>
        <Link to="/" className="mx-5 mr-2 hover:underline">Register</Link>
    </div>
  )
}

export default NavbarRegister