import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '../hooks/useOtherEntities'
import { Loader2, Plus, Edit2, Trash2, HelpCircle } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useSidebar } from '../context/SidebarContext'

export default function Faqs() {
  const { isCollapsed } = useSidebar()
  const { data: faqs, isLoading } = useFaqs()
  const createFaq = useCreateFaq()
  const updateFaq = useUpdateFaq()
  const deleteFaq = useDeleteFaq()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const { register, handleSubmit, reset } = useForm()

  const openModal = (faq = null) => {
    if (faq) {
      setEditingId(faq._id)
      reset({
        question: faq.question || '',
        answer: faq.answer || '',
        order: faq.order ?? 0,
      })
    } else {
      setEditingId(null)
      reset({
        question: '',
        answer: '',
        order: (faqs?.length || 0) + 1,
      })
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
      order: Number(data.order) || 0,
    }
    if (editingId) {
      updateFaq.mutate({ id: editingId, ...payload }, { onSuccess: closeModal })
    } else {
      createFaq.mutate(payload, { onSuccess: closeModal })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#FB6C00]" />
      </div>
    )
  }

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-[#FB6C00]" />
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-stone-400">
            Manage FAQs displayed on the About page and structured in the search engine FAQPage schema.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </button>
      </div>

      <div className="glass rounded-2xl border border-[#241d18] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[540px]">
            <thead>
              <tr className="border-b border-[#241d18] bg-[#14100d]/90 text-sm font-semibold text-stone-400">
                <th className="py-4 px-6">Question</th>
                <th className="py-4 px-6">Answer Preview</th>
                <th className="py-4 px-6 text-center">Order</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {faqs
                ?.slice()
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-[#241d18]/60 hover:bg-[#1a1511]/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-stone-100 max-w-[240px]">
                      {item.question}
                    </td>
                    <td className="py-4 px-6 text-stone-400 max-w-[320px]">
                      <p className="line-clamp-2 text-xs leading-relaxed text-stone-300">
                        {item.answer}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-[#1a1511] text-[#FFDD9C] font-mono text-xs border border-[#3b322a]">
                        {item.order}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(item)}
                          className="p-2 text-stone-400 hover:text-[#FB6C00] bg-[#14100d] hover:bg-[#241d18] rounded-lg transition-colors"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this FAQ?")) {
                              deleteFaq.mutate(item._id)
                            }
                          }}
                          className="p-2 text-stone-400 hover:text-[#E73F1E] bg-[#14100d] hover:bg-[#241d18] rounded-lg transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {faqs?.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-stone-500">
                    No FAQs configured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen &&
        createPortal(
          <div
            className={`fixed inset-0 ${
              isCollapsed ? 'md:left-20' : 'md:left-64'
            } z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 transition-all`}
          >
            <div className="glass w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#241d18] shadow-2xl p-5 sm:p-6 my-auto">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingId ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label
                    htmlFor="faq-question"
                    className="block text-xs font-semibold text-stone-300 ml-1"
                  >
                    Question
                  </label>
                  <input
                    id="faq-question"
                    {...register('question')}
                    placeholder="e.g. What does Pola Mounir specialize in?"
                    required
                    className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="faq-answer"
                    className="block text-xs font-semibold text-stone-300 ml-1"
                  >
                    Answer
                  </label>
                  <textarea
                    id="faq-answer"
                    {...register('answer')}
                    rows={4}
                    placeholder="Detailed explanation answering the question..."
                    required
                    className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="faq-order"
                    className="block text-xs font-semibold text-stone-300 ml-1"
                  >
                    Display Order
                  </label>
                  <input
                    id="faq-order"
                    {...register('order')}
                    type="number"
                    placeholder="1"
                    className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#241d18]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-stone-400 hover:text-white rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createFaq.isPending || updateFaq.isPending}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.3)] text-sm flex items-center"
                  >
                    {(createFaq.isPending || updateFaq.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Save
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
