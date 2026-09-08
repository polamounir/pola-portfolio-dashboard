import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ExternalLink, Download, FileText } from 'lucide-react'
import { useSidebar } from '../context/SidebarContext'

export default function PdfPreviewModal({ isOpen, onClose, pdfUrl, title = 'Document Preview' }) {
  const { isCollapsed } = useSidebar()

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !pdfUrl) return null

  return createPortal(
    <div className={`fixed inset-0 ${isCollapsed ? 'md:left-20' : 'md:left-64'} z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 transition-all`}>
      <div className="glass w-full max-w-5xl h-[88vh] rounded-2xl border border-[#241d18] flex flex-col shadow-2xl overflow-hidden bg-[#090807]/95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#241d18] bg-[#14100d]/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#FB6C00]/10 text-[#FB6C00]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
              <p className="text-xs text-stone-400">PDF Document Viewer</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[#1a1511] text-stone-300 hover:text-white hover:bg-[#241d18] transition-colors border border-[#3b322a] text-xs flex items-center gap-1.5"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>
            <a
              href={pdfUrl}
              download={title.endsWith('.pdf') ? title : `${title}.pdf`}
              className="p-2 rounded-xl bg-[#1a1511] text-stone-300 hover:text-white hover:bg-[#241d18] transition-colors border border-[#3b322a] text-xs flex items-center gap-1.5"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white bg-[#1a1511] hover:bg-[#241d18] rounded-xl transition-colors border border-[#3b322a]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Embed */}
        <div className="flex-1 w-full h-full bg-[#14100d] relative overflow-hidden">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full border-0"
          >
            <iframe
              src={`${pdfUrl}#toolbar=1`}
              title={title}
              className="w-full h-full border-0"
            >
              <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                <FileText className="w-12 h-12 text-[#FB6C00]" />
                <p className="text-stone-300 text-sm">Unable to display PDF directly in this browser frame.</p>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#FB6C00] text-white font-bold text-xs hover:brightness-110"
                >
                  Click here to open and view PDF
                </a>
              </div>
            </iframe>
          </object>
        </div>
      </div>
    </div>,
    document.body
  )
}
