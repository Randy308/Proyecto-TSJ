import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthUser from './AuthUser'

const ProtectedRoutes = () => {
  const {getToken} = AuthUser()
  if(!getToken()){
    return <Navigate to={'/'} />
  }
  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoutes
