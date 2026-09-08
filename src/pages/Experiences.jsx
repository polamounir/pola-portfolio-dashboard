import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience } from '../hooks/useOtherEntities'
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useSidebar } from '../context/SidebarContext'

export default function Experiences() {
  const { isCollapsed } = useSidebar()
  const { data: experiences, isLoading } = useExperiences()
  const createExp = useCreateExperience()
  const updateExp = useUpdateExperience()
  const deleteExp = useDeleteExperience()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const { register, handleSubmit, reset } = useForm()

  const openModal = (exp = null) => {
    if (exp) {
      setEditingId(exp._id)
      reset({ 
        title: exp.title, 
        organization: exp.organization || exp.company || '', 
        type: exp.type || 'Experience',
        startDate: exp.startDate ? exp.startDate.split('T')[0] : '', 
        endDate: exp.endDate ? exp.endDate.split('T')[0] : '', 
        current: exp.current || false,
        description: exp.description 
      })
    } else {
      setEditingId(null)
      reset({ title: '', organization: '', type: 'Experience', startDate: '', endDate: '', current: false, description: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const onSubmit = (data) => {
    if (editingId) updateExp.mutate({ id: editingId, ...data }, { onSuccess: closeModal })
    else createExp.mutate(data, { onSuccess: closeModal })
  }

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FB6C00]" /></div>

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">Experiences</h1>
          <p className="text-sm text-stone-400">Manage work history and professional experience timeline.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Experience
        </button>
      </div>

      <div className="glass rounded-2xl border border-[#241d18] p-4 sm:p-6 space-y-4 shadow-xl">
        {experiences?.map(exp => (
          <div key={exp._id} className="border border-[#241d18] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start gap-4 bg-[#1a1511]/60 hover:border-[#FB6C00]/30 transition-all">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#1a1511] text-[#FFDD9C] font-semibold text-xs border border-[#3b322a]">
                  {exp.type || 'Experience'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {exp.title} <span className="text-[#FFDD9C] font-semibold">at {exp.organization || exp.company}</span>
                </h3>
              </div>
              <p className="text-xs font-semibold text-[#F9B637] mt-1 tracking-wide">
                {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} — {exp.current ? <span className="px-2 py-0.5 rounded-full bg-[#FB6C00]/15 text-[#FFDD9C] border border-[#FB6C00]/30 text-xs ml-1">Present</span> : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A')}
              </p>
              <p className="text-stone-300 text-sm mt-2.5 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            </div>
            <div className="flex gap-2 self-end sm:self-start shrink-0">
              <button onClick={() => openModal(exp)} className="p-2 text-stone-400 hover:text-[#FB6C00] bg-[#14100d] hover:bg-[#241d18] rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => { if(window.confirm('Delete?')) deleteExp.mutate(exp._id) }} className="p-2 text-stone-400 hover:text-[#E73F1E] bg-[#14100d] hover:bg-[#241d18] rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {experiences?.length === 0 && (
          <p className="text-center py-8 text-stone-500">No experiences listed yet.</p>
        )}
      </div>

      {isModalOpen && createPortal(
        <div className={`fixed inset-0 ${isCollapsed ? 'md:left-20' : 'md:left-64'} z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto transition-all`}>
          <div className="glass w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#241d18] p-5 sm:p-6 my-auto shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">{editingId ? 'Edit Experience' : 'Add Experience'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="exp-type" className="block text-xs font-semibold text-stone-300 ml-1">Type</label>
                  <select id="exp-type" {...register('type')} name="type" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white focus:ring-2 focus:ring-[#FB6C00]/40 text-sm">
                    <option value="Experience">Experience</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="exp-title" className="block text-xs font-semibold text-stone-300 ml-1">Job Title / Degree</label>
                  <input id="exp-title" {...register('title')} name="title" autoComplete="organization-title" placeholder="e.g. Senior Frontend Engineer" required className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="exp-org" className="block text-xs font-semibold text-stone-300 ml-1">Company / Organization / Institution</label>
                <input id="exp-org" {...register('organization')} name="organization" autoComplete="organization" placeholder="e.g. Google, Apple, Cairo University" required className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="exp-start-date" className="block text-xs font-semibold text-stone-300 ml-1">Start Date</label>
                  <input id="exp-start-date" {...register('startDate')} name="startDate" type="date" required className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white focus:ring-2 focus:ring-[#FB6C00]/40 text-sm" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="exp-end-date" className="block text-xs font-semibold text-stone-300 ml-1">End Date</label>
                  <input id="exp-end-date" {...register('endDate')} name="endDate" type="date" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white focus:ring-2 focus:ring-[#FB6C00]/40 text-sm" />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <input id="exp-current" type="checkbox" {...register('current')} name="current" className="rounded border-[#241d18] accent-[#FB6C00] w-4 h-4 cursor-pointer" />
                <label htmlFor="exp-current" className="text-stone-300 text-sm cursor-pointer select-none">Current Role / Ongoing</label>
              </div>
              <div className="space-y-1">
                <label htmlFor="exp-description" className="block text-xs font-semibold text-stone-300 ml-1">Responsibilities / Achievements</label>
                <textarea id="exp-description" {...register('description')} name="description" autoComplete="off" placeholder="Responsibilities, key impact, achievements..." rows={4} className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 resize-none text-sm" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-[#241d18]">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-stone-400 hover:text-white rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={createExp.isPending || updateExp.isPending} className="px-6 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.3)] text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
