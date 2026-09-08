import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store'

// Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import NavLinks from './pages/NavLinks'
import Projects from './pages/Projects'
import Experiences from './pages/Experiences'
import Skills from './pages/Skills'
import AlertSettings from './pages/AlertSettings'
import ThemeSettings from './pages/ThemeSettings'
import Layout from './components/Layout'

import { SidebarProvider } from './context/SidebarContext'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Private Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/links" element={<NavLinks />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/experiences" element={<Experiences />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/alert" element={<AlertSettings />} />
                <Route path="/theme" element={<ThemeSettings />} />
                {/* Other routes will be added here */}
              </Route>
            </Routes>
          </Router>
        </SidebarProvider>
      </QueryClientProvider>
    </Provider>
  )
}


export default App
