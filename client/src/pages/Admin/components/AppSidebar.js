import React from 'react'

import {
  CCloseButton,
  CNavLink,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config

const AppSidebar = () => {

    const items = [
        { 
            component: CNavLink,
            name: "Музыкальные релизы",
            to: '/admin/music',
        },
        { 
            component: CNavLink,
            name: "Участники",
            to: '/admin/members',
        },
        { 
            component: CNavLink,
            name: "Выступления",
            to: '/admin/gigs',
        },
        {
            component: CNavLink,
            name: "Роли",
            to: "/admin/roles",
        }
    ]

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
        />
      </CSidebarHeader>
      <AppSidebarNav items={items} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
