import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../hooks/useOtherEntities'
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useSidebar } from '../context/SidebarContext'

export default function Skills() {
  const { isCollapsed } = useSidebar()
  const { data: skills, isLoading } = useSkills()
  const createSkill = useCreateSkill()
  const updateSkill = useUpdateSkill()
  const deleteSkill = useDeleteSkill()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const { register, handleSubmit, reset } = useForm()

  const openModal = (skill = null) => {
    if (skill) {
      setEditingId(skill._id)
      reset({ 
        name: skill.name || '', 
        category: skill.category || '', 
        level: skill.level || 80,
        icon: skill.icon || '', 
        order: skill.order || 0 
      })
    } else {
      setEditingId(null)
      reset({ name: '', category: '', level: 80, icon: '', order: 0 })
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
      level: Number(data.level) || 80,
      order: Number(data.order) || 0
    }
    if (editingId) updateSkill.mutate({ id: editingId, data: payload }, { onSuccess: closeModal })
    else createSkill.mutate(payload, { onSuccess: closeModal })
  }

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FB6C00]" /></div>

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">Skills</h1>
          <p className="text-sm text-stone-400">Manage technical skills and proficiency levels.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Skill
        </button>
      </div>

      <div className="glass rounded-2xl border border-[#241d18] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[540px]">
            <thead>
              <tr className="border-b border-[#241d18] bg-[#14100d]/90 text-sm font-semibold text-stone-400">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Level (%)</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {skills?.map(item => (
                <tr key={item._id} className="border-b border-[#241d18]/60 hover:bg-[#1a1511]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-stone-100">{item.name}</td>
                  <td className="py-4 px-6 text-stone-400">
                    <span className="px-2.5 py-1 rounded-md bg-[#1a1511] text-[#FFDD9C] font-medium text-xs border border-[#3b322a]">
                      {item.category || 'General'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-stone-300">
                    <div className="flex items-center space-x-3 max-w-xs">
                      <div className="flex-1 bg-[#1a1511] rounded-full h-2 overflow-hidden border border-[#3b322a]/50">
                        <div 
                          className="bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(item.level || 0, 100)}%` }} 
                        />
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#FFDD9C] w-9">{item.level}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(item)} className="p-2 text-stone-400 hover:text-[#FB6C00] bg-[#14100d] hover:bg-[#241d18] rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if(window.confirm('Delete?')) deleteSkill.mutate(item._id) }} className="p-2 text-stone-400 hover:text-[#E73F1E] bg-[#14100d] hover:bg-[#241d18] rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {skills?.length === 0 && (
                <tr><td colSpan="4" className="py-8 text-center text-stone-500">No skills configured yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className={`fixed inset-0 ${isCollapsed ? 'md:left-20' : 'md:left-64'} z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 transition-all`}>
          <div className="glass w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#241d18] shadow-2xl p-5 sm:p-6 my-auto">
            <h2 className="text-xl font-bold text-white mb-4">{editingId ? 'Edit Skill' : 'Add Skill'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="skill-name" className="block text-xs font-semibold text-stone-300 ml-1">Skill Name</label>
                <input id="skill-name" {...register('name')} name="name" autoComplete="off" placeholder="e.g. React.js" required className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
              </div>

              <div className="space-y-1">
                <label htmlFor="skill-category" className="block text-xs font-semibold text-stone-300 ml-1">Category</label>
                <input id="skill-category" {...register('category')} name="category" autoComplete="off" placeholder="e.g. Frontend, Backend, Database" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
              </div>

              <div className="space-y-1">
                <label htmlFor="skill-icon" className="block text-xs font-semibold text-stone-300 ml-1">Icon URL / SVG</label>
                <input id="skill-icon" {...register('icon')} name="icon" autoComplete="off" placeholder="Icon URL or identifier" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="skill-level" className="block text-xs font-semibold text-stone-300 ml-1">Proficiency Level (%)</label>
                  <input id="skill-level" {...register('level')} name="level" type="number" min="0" max="100" placeholder="85" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="skill-order" className="block text-xs font-semibold text-stone-300 ml-1">Display Order</label>
                  <input id="skill-order" {...register('order')} name="order" type="number" placeholder="1" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-[#241d18]">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-stone-400 hover:text-white rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={createSkill.isPending || updateSkill.isPending} className="px-6 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.3)] text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
