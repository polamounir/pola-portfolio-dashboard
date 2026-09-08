import React from 'react'
import { useMessages } from '../hooks/useDashboard'
import { useMarkMessageRead, useDeleteMessage } from '../hooks/useOtherEntities'
import { Loader2, Mail, Trash2, CheckCircle } from 'lucide-react'

export default function Messages() {
  const { data: messages, isLoading } = useMessages()
  const markRead = useMarkMessageRead()
  const deleteMsg = useDeleteMessage()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#FB6C00]" />
      </div>
    )
  }

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">Messages Inbox</h1>
        <p className="text-sm text-stone-400">Manage contact form submissions from your portfolio.</p>
      </div>

      <div className="grid gap-4">
        {messages?.length === 0 && (
          <div className="glass p-8 sm:p-12 text-center rounded-2xl border border-[#241d18] shadow-xl">
            <Mail className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No messages yet</h3>
            <p className="text-stone-400 text-sm">When visitors contact you, their messages will appear here.</p>
          </div>
        )}

        {messages?.map(msg => (
          <div 
            key={msg._id} 
            className={`glass p-4 sm:p-6 rounded-2xl border transition-all duration-300 shadow-lg ${
              msg.isRead 
                ? 'border-[#241d18] opacity-75' 
                : 'border-[#FB6C00]/40 bg-gradient-to-r from-[#FB6C00]/10 via-[#E73F1E]/5 to-transparent shadow-[0_0_20px_rgba(251,108,0,0.06)]'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-white break-words">{msg.subject}</h3>
                  {!msg.isRead && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E73F1E]/20 text-[#FFDD9C] border border-[#E73F1E]/30 text-xs font-bold">New</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-400 mb-3">
                  <span className="flex items-center gap-1.5 font-medium text-[#FFDD9C] break-all">
                    <Mail className="w-3.5 h-3.5 text-[#FB6C00] shrink-0" /> {msg.name} ({msg.email})
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-stone-400 text-xs">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-stone-200 text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-start">
                {!msg.isRead && (
                  <button
                    onClick={() => markRead.mutate(msg._id)}
                    disabled={markRead.isPending}
                    className="p-2.5 bg-[#1a1511] hover:bg-[#F9B637]/20 text-stone-400 hover:text-[#F9B637] border border-[#241d18] rounded-xl transition-colors disabled:opacity-50"
                    title="Mark as Read"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm('Delete this message?')) deleteMsg.mutate(msg._id)
                  }}
                  disabled={deleteMsg.isPending}
                  className="p-2.5 bg-[#1a1511] hover:bg-[#E73F1E]/20 text-stone-400 hover:text-[#E73F1E] border border-[#241d18] rounded-xl transition-colors disabled:opacity-50"
                  title="Delete Message"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
