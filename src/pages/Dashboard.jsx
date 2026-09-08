import React from 'react'
import { useVisitors, useMessages, useProjects } from '../hooks/useDashboard'
import { Loader2, TrendingUp, Users, MessageSquare, FolderGit2 } from 'lucide-react'

export default function Dashboard() {
  const { data: visitors, isLoading: loadingVisitors } = useVisitors()
  const { data: messages, isLoading: loadingMessages } = useMessages()
  const { data: projects, isLoading: loadingProjects } = useProjects()

  const totalVisitors = visitors ? visitors.reduce((acc, v) => acc + v.hitCount, 0) : 0
  const unreadMessages = messages ? messages.filter(m => !m.isRead).length : 0
  const totalProjects = projects ? projects.length : 0

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">Dashboard Overview</h1>
        <p className="text-sm text-stone-400">Monitor your portfolio activity, views, and messages at a glance.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Metric 1: Total Hits (Flame #E73F1E) */}
        <div className="glass p-6 rounded-2xl border border-[#241d18] hover:border-[#E73F1E]/40 transition-all duration-300 relative overflow-hidden group shadow-lg">
          <div className="absolute -right-4 -top-4 w-28 h-28 bg-[#E73F1E]/15 rounded-full blur-2xl group-hover:bg-[#E73F1E]/25 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-[#E73F1E] uppercase tracking-wider">Total Hits</p>
            <div className="p-2 rounded-xl bg-[#E73F1E]/10 text-[#E73F1E]">
              <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <div className="flex items-end space-x-2">
            {loadingVisitors ? (
              <Loader2 className="w-8 h-8 animate-spin text-stone-500" />
            ) : (
              <p className="text-4xl font-extrabold text-white tracking-tight">{totalVisitors}</p>
            )}
            <span className="text-xs font-medium text-[#FFDD9C]/70 mb-1">all time</span>
          </div>
        </div>
        
        {/* Metric 2: Unread Messages (Vivid Orange #FB6C00) */}
        <div className="glass p-6 rounded-2xl border border-[#241d18] hover:border-[#FB6C00]/40 transition-all duration-300 relative overflow-hidden group shadow-lg">
          <div className="absolute -right-4 -top-4 w-28 h-28 bg-[#FB6C00]/15 rounded-full blur-2xl group-hover:bg-[#FB6C00]/25 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-[#FB6C00] uppercase tracking-wider">Unread Messages</p>
            <div className="p-2 rounded-xl bg-[#FB6C00]/10 text-[#FB6C00]">
              <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <div className="flex items-end space-x-2">
            {loadingMessages ? (
              <Loader2 className="w-8 h-8 animate-spin text-stone-500" />
            ) : (
              <p className="text-4xl font-extrabold text-white tracking-tight">{unreadMessages}</p>
            )}
            <span className="text-xs font-medium text-[#FFDD9C]/70 mb-1">in inbox</span>
          </div>
        </div>
        
        {/* Metric 3: Active Projects (Honey Gold #F9B637) */}
        <div className="glass p-6 rounded-2xl border border-[#241d18] hover:border-[#F9B637]/40 transition-all duration-300 relative overflow-hidden group shadow-lg">
          <div className="absolute -right-4 -top-4 w-28 h-28 bg-[#F9B637]/15 rounded-full blur-2xl group-hover:bg-[#F9B637]/25 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-[#F9B637] uppercase tracking-wider">Active Projects</p>
            <div className="p-2 rounded-xl bg-[#F9B637]/10 text-[#F9B637]">
              <FolderGit2 className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <div className="flex items-end space-x-2">
            {loadingProjects ? (
              <Loader2 className="w-8 h-8 animate-spin text-stone-500" />
            ) : (
              <p className="text-4xl font-extrabold text-white tracking-tight">{totalProjects}</p>
            )}
            <span className="text-xs font-medium text-[#FFDD9C]/70 mb-1">published</span>
          </div>
        </div>
      </div>

      <div className="glass p-4 sm:p-6 rounded-2xl border border-[#241d18] mt-6 sm:mt-8 shadow-xl">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#FB6C00]" />
          Recent Visitors
        </h2>
        {loadingVisitors ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#FB6C00]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[520px]">
              <thead>
                <tr className="border-b border-[#241d18] text-sm font-medium text-stone-400">
                  <th className="py-4 px-4">Visitor</th>
                  <th className="py-4 px-4">IP / Location</th>
                  <th className="py-4 px-4">Hits</th>
                  <th className="py-4 px-4">Last Visit</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {visitors?.slice(0, 10).map((v) => (
                  <tr key={v._id} className="border-b border-[#241d18]/60 hover:bg-[#1a1511]/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-stone-100">
                      {v.name || 'Anonymous Visitor'}
                    </td>
                    <td className="py-4 px-4 text-stone-400">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-[#FFDD9C]">{v.ipAddress}</span>
                        <span className="text-xs text-stone-500 truncate max-w-[200px]">{v.userAgent}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#241d18] text-[#FFDD9C] font-semibold text-xs border border-[#3b322a]">
                        {v.hitCount}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-stone-400">{new Date(v.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {visitors?.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-stone-500">No visitors found yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

