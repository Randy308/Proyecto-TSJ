import React from 'react'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
    return (
        <>
          <Navbar></Navbar>
          <Outlet></Outlet>
          <Footer></Footer>
        </>
      );
}

export default LayoutAdmin