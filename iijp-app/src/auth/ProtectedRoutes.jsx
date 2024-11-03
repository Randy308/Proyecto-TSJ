import React from 'react'
import { Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoutes
