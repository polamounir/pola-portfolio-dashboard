import React from 'react'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { useSidebar } from '../context/SidebarContext'
import { 
  LayoutDashboard, 
  UserCircle, 
  Link as LinkIcon, 
  FolderGit2, 
  Briefcase, 
  Lightbulb, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Palette
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Profile', href: '/profile', icon: UserCircle },
  { name: 'Nav Links', href: '/links', icon: LinkIcon },
  { name: 'Projects', href: '/projects', icon: FolderGit2 },
  { name: 'Experiences', href: '/experiences', icon: Briefcase },
  { name: 'Skills', href: '/skills', icon: Lightbulb },
  { name: 'App Alert', href: '/alert', icon: Bell },
  { name: 'App Theme', href: '/theme', icon: Palette },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
]

export default function Layout() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()
  const { 
    isCollapsed, 
    toggleSidebar, 
    isMobileOpen, 
    toggleMobileMenu, 
    closeMobileMenu 
  } = useSidebar()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-[#090807] flex flex-col md:flex-row text-[#fff8f0] overflow-x-hidden">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 flex items-center justify-between px-4 py-3 border-b border-[#241d18] bg-[#090807]/90 backdrop-blur-lg z-40">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-[#E73F1E] via-[#FB6C00] to-[#F9B637] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(231,63,30,0.5)]">
            <span className="font-black text-white text-sm">P</span>
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] bg-clip-text text-transparent">
            Admin Panel
          </span>
        </div>

        <button 
          onClick={toggleMobileMenu} 
          aria-label={isMobileOpen ? 'Close Menu' : 'Open Menu'}
          className="p-2 text-stone-300 hover:text-white rounded-xl bg-[#14100d] border border-[#241d18] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar (Desktop Collapsible & Mobile Drawer) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 glass flex flex-col border-r border-[#241d18] transition-all duration-300 ease-in-out md:relative ${
          // Mobile state
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${
          // Desktop state
          isCollapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`h-16 hidden md:flex items-center border-b border-[#241d18]/70 px-4 shrink-0 transition-all ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center min-w-0">
            <div className="h-8 w-8 bg-gradient-to-br from-[#E73F1E] via-[#FB6C00] to-[#F9B637] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(231,63,30,0.5)]">
              <span className="font-black text-white text-sm">P</span>
            </div>
            {!isCollapsed && (
              <h1 className="ml-3 text-base font-bold bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] bg-clip-text text-transparent truncate tracking-tight animate-in fade-in duration-200">
                Admin Panel
              </h1>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className={`p-1.5 rounded-lg border border-[#3b322a] bg-[#14100d] text-stone-400 hover:text-white hover:border-[#FB6C00]/50 transition-all ${
              isCollapsed ? 'absolute -right-3 top-5 shadow-lg z-50 bg-[#1a1511]' : ''
            }`}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-[#FB6C00]" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto mt-2 md:mt-0">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={`relative group flex items-center py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isCollapsed ? 'justify-center px-0' : 'px-3.5'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E73F1E]/20 via-[#FB6C00]/15 to-transparent text-[#FFDD9C] border border-[#FB6C00]/35 shadow-[inset_0_0_15px_rgba(231,63,30,0.12)]'
                    : 'text-stone-400 hover:bg-stone-800/40 hover:text-[#fff8f0] border border-transparent'
                }`}
              >
                <Icon
                  className={`flex-shrink-0 h-5 w-5 transition-colors duration-300 ${
                    isCollapsed ? '' : 'mr-3'
                  } ${
                    isActive ? 'text-[#F9B637] drop-shadow-[0_0_8px_rgba(249,182,55,0.6)]' : 'text-stone-500 group-hover:text-stone-300'
                  }`}
                />

                {!isCollapsed ? (
                  <span className="truncate">{item.name}</span>
                ) : (
                  /* Tooltip on Collapsed Hover */
                  <span className="hidden md:block absolute left-full ml-3 px-3 py-1.5 bg-[#14100d] text-xs font-bold text-[#FFDD9C] rounded-xl shadow-2xl border border-[#3b322a] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer / Sign Out */}
        <div className={`p-3 border-t border-[#241d18]/70 shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => dispatch(logout())}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={`group relative flex items-center py-2.5 text-sm font-medium text-stone-400 rounded-xl hover:bg-[#E73F1E]/15 hover:text-[#FFDD9C] hover:border-[#E73F1E]/30 border border-transparent transition-all duration-300 ${
              isCollapsed ? 'justify-center w-10 h-10 p-0' : 'w-full px-3.5'
            }`}
          >
            <LogOut className={`flex-shrink-0 h-5 w-5 group-hover:text-[#E73F1E] transition-colors ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed ? (
              <span>Sign Out</span>
            ) : (
              <span className="hidden md:block absolute left-full ml-3 px-3 py-1.5 bg-[#14100d] text-xs font-bold text-red-400 rounded-xl shadow-2xl border border-[#3b322a] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto h-[calc(100vh-61px)] md:h-screen relative">
        {/* Ambient atmospheric lighting */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#E73F1E]/8 rounded-full blur-[160px] pointer-events-none hidden md:block" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FB6C00]/6 rounded-full blur-[160px] pointer-events-none hidden md:block" />
        
        <div className="flex-1 p-3.5 sm:p-6 lg:p-8 z-10 relative">
          <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
