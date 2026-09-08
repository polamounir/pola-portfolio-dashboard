/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext({
  isCollapsed: false,
  toggleSidebar: () => {},
  isMobileOpen: false,
  toggleMobileMenu: () => {},
  closeMobileMenu: () => {},
})

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('sidebar_collapsed', isCollapsed.toString())
    } catch {
      // Ignore localStorage errors in private browsing
    }
  }, [isCollapsed])

  const toggleSidebar = () => setIsCollapsed((prev) => !prev)
  const toggleMobileMenu = () => setIsMobileOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileOpen(false)

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        isMobileOpen,
        toggleMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
