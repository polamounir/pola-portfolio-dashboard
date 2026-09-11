import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavLinks, useCreateNavLink, useUpdateNavLink, useDeleteNavLink } from '../hooks/useOtherEntities'
import { Loader2, Plus, Edit2, Trash2, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useSidebar } from '../context/SidebarContext'

export default function NavLinks() {
  const { isCollapsed } = useSidebar()
  const { data: links, isLoading } = useNavLinks()
  const createLink = useCreateNavLink()
  const updateLink = useUpdateNavLink()
  const deleteLink = useDeleteNavLink()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const { register, handleSubmit, reset } = useForm()

  const openModal = (link = null) => {
    if (link) {
      setEditingId(link._id)
      reset({ name: link.name, path: link.path, icon: link.icon || '', order: link.order || 0 })
    } else {
      setEditingId(null)
      reset({ name: '', path: '', icon: '', order: (links?.length || 0) + 1 })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const onSubmit = (data) => {
    const payload = {
      ...data,
      order: Number(data.order) || 0
    }
    if (editingId) {
      updateLink.mutate({ id: editingId, data: payload }, { onSuccess: closeModal })
    } else {
      createLink.mutate(payload, { onSuccess: closeModal })
    }
  }

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FB6C00]" /></div>

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">Navigation Links</h1>
          <p className="text-sm text-stone-400">Manage the main menu links shown on your portfolio.</p>
        </div>
        <button onClick={() => openModal()} className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Link
        </button>
      </div>

      <div className="glass rounded-2xl border border-[#241d18] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-[#241d18] bg-[#14100d]/90 text-sm font-semibold text-stone-400 uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Path</th>
                <th className="py-4 px-6">Icon</th>
                <th className="py-4 px-6 text-center">Order</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {links?.sort((a,b) => a.order - b.order).map(link => (
                <tr key={link._id} className="border-b border-[#241d18]/60 hover:bg-[#1a1511]/50 transition-colors group">
                  <td className="py-4 px-6 font-semibold text-stone-100">{link.name}</td>
                  <td className="py-4 px-6 text-[#FFDD9C] font-mono text-xs">{link.path}</td>
                  <td className="py-4 px-6 text-stone-400">{link.icon || '-'}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-[#1a1511] text-[#FFDD9C] font-mono text-xs px-2.5 py-1 rounded-md border border-[#3b322a]">{link.order}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(link)} className="p-2 text-stone-400 hover:text-[#FB6C00] hover:bg-[#FB6C00]/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if(window.confirm('Are you sure you want to delete this link?')) deleteLink.mutate(link._id) }} className="p-2 text-stone-400 hover:text-[#E73F1E] hover:bg-[#E73F1E]/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {links?.length === 0 && (
                <tr><td colSpan="5" className="py-8 text-center text-stone-500">No navigation links configured yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className={`fixed inset-0 ${isCollapsed ? 'md:left-20' : 'md:left-64'} z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 transition-all`}>
          <div className="glass w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#241d18] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-[#241d18] bg-[#14100d]/90">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Link' : 'Add New Link'}</h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-white hover:bg-[#1a1511] p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <label htmlFor="nav-name" className="block text-xs font-semibold text-stone-300 ml-1">Display Name</label>
                <input id="nav-name" {...register('name')} name="name" autoComplete="off" required className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 transition-all text-sm" placeholder="e.g. About" />
              </div>
              <div className="space-y-1">
                <label htmlFor="nav-path" className="block text-xs font-semibold text-stone-300 ml-1">URL Path</label>
                <input id="nav-path" {...register('path')} name="path" autoComplete="off" required className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 transition-all font-mono text-sm" placeholder="e.g. /about" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="nav-icon" className="block text-xs font-semibold text-stone-300 ml-1">Icon ID (optional)</label>
                  <input id="nav-icon" {...register('icon')} name="icon" autoComplete="off" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 transition-all text-sm" placeholder="e.g. user" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="nav-order" className="block text-xs font-semibold text-stone-300 ml-1">Display Order</label>
                  <input id="nav-order" {...register('order')} name="order" autoComplete="off" type="number" required className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 transition-all text-sm" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-[#241d18]">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-stone-400 hover:text-white rounded-xl text-sm transition-colors">Cancel</button>
                <button type="submit" disabled={createLink.isPending || updateLink.isPending} className="px-6 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm flex items-center">
                  {(createLink.isPending || updateLink.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
