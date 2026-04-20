import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = () => {
  return (
    <div id="wrapper">
      <div id="page" className="">
        <div className="layout-wrap">
          <Sidebar />
          <div className="section-content-right">
            <div className="main-content">
              <div className="main-content-inner">
                <div className="main-content-wrap">
                  <Outlet />
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
