import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useProjects } from '../hooks/useDashboard'
import { useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useOtherEntities'
import { Loader2, Plus, Edit2, Trash2, ExternalLink, Code2, CheckCircle2, Crop } from 'lucide-react'
import { createPortal } from 'react-dom'
import ImageEditorModal from '../components/ImageEditorModal'
import { useSidebar } from '../context/SidebarContext'

export default function Projects() {
  const { isCollapsed } = useSidebar()
  const { data: projects, isLoading } = useProjects()
  const createProj = useCreateProject()
  const updateProj = useUpdateProject()
  const deleteProj = useDeleteProject()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  // Image editor modal
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false)
  const [editorImageSrc, setEditorImageSrc] = useState(null)

  const { register, handleSubmit, reset } = useForm()

  const getGithubLink = (proj) => {
    if (!proj?.links) return ''
    if (typeof proj.links === 'object' && !Array.isArray(proj.links)) {
      return proj.links.github || ''
    }
    if (Array.isArray(proj.links)) {
      return proj.links.find(l => l.type === 'github')?.url || ''
    }
    return ''
  }

  const getLiveLink = (proj) => {
    if (!proj?.links) return ''
    if (typeof proj.links === 'object' && !Array.isArray(proj.links)) {
      return proj.links.liveDemo || proj.links.live || ''
    }
    if (Array.isArray(proj.links)) {
      return proj.links.find(l => l.type === 'live')?.url || ''
    }
    return ''
  }

  const openModal = (proj = null) => {
    setThumbnailFile(null)
    if (proj) {
      setEditingId(proj._id)
      setThumbnailPreview(proj.images?.thumbnail || proj.thumbnailUrl || null)
      reset({ 
        title: proj.title || '', 
        slug: proj.slug || '',
        description: proj.description || '', 
        fullDescription: proj.fullDescription || proj.description || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || ''),
        github: getGithubLink(proj),
        liveDemo: getLiveLink(proj),
        status: proj.status || 'Production',
        lines: proj.lines || '',
        iconEmoji: proj.iconEmoji || '',
        datePublished: proj.datePublished || '',
        dateModified: proj.dateModified || '',
        thumbnailUrl: proj.images?.thumbnail || proj.thumbnailUrl || ''
      })
    } else {
      setEditingId(null)
      setThumbnailPreview(null)
      reset({ 
        title: '', 
        slug: '',
        description: '', 
        fullDescription: '',
        technologies: '', 
        github: '', 
        liveDemo: '', 
        status: 'Production', 
        lines: '', 
        iconEmoji: '',
        datePublished: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
        thumbnailUrl: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setThumbnailFile(null)
    setThumbnailPreview(null)
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setThumbnailFile(file)
      setThumbnailPreview(preview)
      setEditorImageSrc(preview)
    }
  }

  const openExistingThumbnailEditor = () => {
    if (thumbnailPreview) {
      setEditorImageSrc(thumbnailPreview)
      setIsImageEditorOpen(true)
    }
  }

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('slug', data.slug || '')
    formData.append('description', data.description)
    formData.append('fullDescription', data.fullDescription || data.description || '')
    
    // Convert comma-separated string to array
    const techArray = data.technologies.split(',').map(s => s.trim()).filter(Boolean)
    formData.append('technologies', JSON.stringify(techArray))
    
    formData.append('links', JSON.stringify({
      github: data.github || '',
      liveDemo: data.liveDemo || ''
    }))

    formData.append('github', data.github || '')
    formData.append('liveDemo', data.liveDemo || '')
    formData.append('status', data.status || 'Production')
    formData.append('lines', data.lines || '')
    formData.append('iconEmoji', data.iconEmoji || '')
    formData.append('datePublished', data.datePublished || '')
    formData.append('dateModified', data.dateModified || '')

    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile)
    } else if (data.thumbnailUrl) {
      formData.append('thumbnail', data.thumbnailUrl)
    }
    
    if (data.gallery && data.gallery.length > 0) {
      Array.from(data.gallery).forEach(file => {
        formData.append('gallery', file)
      })
    }

    if (editingId) updateProj.mutate({ id: editingId, formData }, { onSuccess: closeModal })
    else createProj.mutate(formData, { onSuccess: closeModal })
  }

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FB6C00]" /></div>

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">Projects</h1>
          <p className="text-sm text-stone-400">Manage showcase portfolio projects and technologies.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
        {projects?.map(proj => {
          const githubUrl = getGithubLink(proj)
          const liveUrl = getLiveLink(proj)
          const thumb = proj.images?.thumbnail || proj.thumbnailUrl

          return (
            <div key={proj._id} className="glass rounded-2xl border border-[#241d18] hover:border-[#FB6C00]/40 overflow-hidden flex flex-col transition-all duration-300 shadow-xl group">
              <div className="h-48 bg-[#14100d] overflow-hidden shrink-0 relative flex items-center justify-center border-b border-[#241d18]">
                {thumb ? (
                  <img src={thumb} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <span className="text-5xl mb-2 filter drop-shadow-[0_0_12px_rgba(251,108,0,0.3)]">{proj.iconEmoji || '💻'}</span>
                    <span className="text-xs font-mono text-stone-500">{proj.title}</span>
                  </div>
                )}
                {proj.status && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#090807]/80 backdrop-blur-md text-[#FFDD9C] border border-[#FB6C00]/40 text-xs font-bold shadow-md">
                    {proj.status}
                  </span>
                )}
                {proj.lines && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#090807]/80 backdrop-blur-md text-stone-300 border border-[#241d18] text-xs font-mono font-semibold">
                    {proj.lines}
                  </span>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFDD9C] transition-colors">{proj.title}</h3>
                <p className="text-sm text-stone-400 mb-4 line-clamp-3 leading-relaxed">{proj.description}</p>
                
                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.technologies?.slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#1a1511] text-stone-300 border border-[#241d18]">
                      {tech}
                    </span>
                  ))}
                  {proj.technologies?.length > 4 && (
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-[#1a1511] text-[#F9B637] border border-[#241d18]">
                      +{proj.technologies.length - 4}
                    </span>
                  )}
                </div>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#241d18]">
                  <div className="flex items-center gap-2">
                    {liveUrl && (
                      <a href={liveUrl} target="_blank" rel="noreferrer" title="Live Preview" className="p-2 text-[#FB6C00] hover:text-white bg-[#1a1511] hover:bg-[#FB6C00]/20 rounded-lg border border-[#3b322a] transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noreferrer" title="GitHub Repository" className="p-2 text-stone-300 hover:text-white bg-[#1a1511] hover:bg-[#241d18] rounded-lg border border-[#3b322a] transition-all">
                        <Code2 className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(proj)} className="p-2 text-stone-400 hover:text-[#FB6C00] bg-[#14100d] hover:bg-[#241d18] rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { if(window.confirm('Delete this project?')) deleteProj.mutate(proj._id) }} className="p-2 text-stone-400 hover:text-[#E73F1E] bg-[#14100d] hover:bg-[#241d18] rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {isModalOpen && createPortal(
        <div className={`fixed inset-0 ${isCollapsed ? 'md:left-20' : 'md:left-64'} z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto transition-all`}>
          <div className="glass w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[#241d18] p-4 sm:p-6 my-auto shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">{editingId ? 'Edit Project' : 'Add Project'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label htmlFor="project-title" className="block text-xs text-stone-400 mb-1">Project Title</label>
                  <input id="project-title" {...register('title')} name="title" autoComplete="off" placeholder="e.g., Fast-Box" required className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
                </div>
                <div>
                  <label htmlFor="project-icon" className="block text-xs text-stone-400 mb-1">Icon / Emoji</label>
                  <input id="project-icon" {...register('iconEmoji')} name="iconEmoji" autoComplete="off" placeholder="e.g., 🚚, 🛒, 🧠" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="project-slug" className="block text-xs text-stone-400 mb-1">
                  URL Slug <span className="text-[#F9B637] text-[11px]">(Auto-generated from title if blank — e.g. /projects/fast-box)</span>
                </label>
                <input id="project-slug" {...register('slug')} name="slug" autoComplete="off" placeholder="e.g., fast-box" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm font-mono" />
              </div>

              <div>
                <label htmlFor="project-description" className="block text-xs text-stone-400 mb-1">Short Description (Cards)</label>
                <textarea id="project-description" {...register('description')} name="description" autoComplete="off" placeholder="Brief card summary of the project" rows={2} required className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 resize-none text-sm" />
              </div>

              <div>
                <label htmlFor="project-full-description" className="block text-xs text-stone-400 mb-1">Full Description (Detail Page Overview & Architecture)</label>
                <textarea id="project-full-description" {...register('fullDescription')} name="fullDescription" autoComplete="off" placeholder="Complete architecture details and specifications for the dedicated project page..." rows={3} className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 resize-none text-sm" />
              </div>

              <div>
                <label htmlFor="project-tech" className="block text-xs text-stone-400 mb-1">Technologies (comma separated)</label>
                <input id="project-tech" {...register('technologies')} name="technologies" autoComplete="off" placeholder="React.js, Tailwind CSS, JavaScript" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="project-live" className="block text-xs text-stone-400 mb-1">Live Demo URL</label>
                  <input id="project-live" {...register('liveDemo')} name="liveDemo" type="url" autoComplete="url" placeholder="https://fast-box-shipment.vercel.app/" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
                </div>
                <div>
                  <label htmlFor="project-github" className="block text-xs text-stone-400 mb-1">GitHub Repository URL</label>
                  <input id="project-github" {...register('github')} name="github" type="url" autoComplete="url" placeholder="https://github.com/polamounir/Fast-box" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="project-status" className="block text-xs text-stone-400 mb-1">Status</label>
                  <select id="project-status" {...register('status')} name="status" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white focus:ring-2 focus:ring-[#FB6C00]/40 text-sm">
                    <option value="Production">Production</option>
                    <option value="Active Dev">Active Dev</option>
                    <option value="Beta">Beta</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="project-lines" className="block text-xs text-stone-400 mb-1">Lines of Code</label>
                  <input id="project-lines" {...register('lines')} name="lines" autoComplete="off" placeholder="e.g. 15,000+" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="project-date-published" className="block text-xs text-stone-400 mb-1">Date Published (YYYY-MM-DD)</label>
                  <input id="project-date-published" {...register('datePublished')} name="datePublished" placeholder="2024-05-15" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 text-sm" />
                </div>
                <div>
                  <label htmlFor="project-date-modified" className="block text-xs text-stone-400 mb-1">Date Modified (YYYY-MM-DD)</label>
                  <input id="project-date-modified" {...register('dateModified')} name="dateModified" placeholder="2026-06-15" className="block w-full px-4 py-2.5 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FB6C00]/40 text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="project-thumbnail-file" className="block text-xs text-stone-400 mb-1.5">Project Thumbnail (Optimized for Web via Cloudinary)</label>
                <div className="flex items-center gap-4 mb-3">
                  <div className={`h-20 w-28 rounded-xl bg-[#14100d] border ${thumbnailPreview ? 'border-[#FB6C00] shadow-[0_0_12px_rgba(251,108,0,0.3)]' : 'border-[#241d18]'} overflow-hidden flex items-center justify-center relative shrink-0 group`}>
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-stone-500 font-mono">No Image</span>
                    )}

                    {thumbnailPreview && (
                      <button
                        type="button"
                        onClick={openExistingThumbnailEditor}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity gap-1"
                        title="Edit & Crop Image"
                      >
                        <Crop className="w-3.5 h-3.5 text-[#FB6C00]" />
                        <span>Edit/Crop</span>
                      </button>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap gap-2">
                      <input 
                        id="project-thumbnail-file"
                        name="thumbnailFile"
                        type="file" 
                        accept="image/*" 
                        onChange={handleThumbnailChange}
                        onClick={(e) => { e.target.value = null }}
                        className="block w-full text-stone-400 text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FB6C00]/15 file:text-[#FFDD9C] hover:file:bg-[#FB6C00]/25 cursor-pointer" 
                      />
                      {thumbnailPreview && (
                        <button
                          type="button"
                          onClick={openExistingThumbnailEditor}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg border border-[#3b322a] bg-[#1a1511] hover:bg-[#241d18] text-stone-300 hover:text-white text-xs font-medium gap-1 transition-colors"
                        >
                          <Crop className="w-3 h-3 text-[#FB6C00]" /> Edit / Crop Image
                        </button>
                      )}
                    </div>
                    {thumbnailFile && (
                      <p className="text-[11px] text-[#F9B637] font-medium flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-[#FB6C00]" />
                        Selected: {thumbnailFile.name} ({Math.round(thumbnailFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                </div>
                <input id="project-thumbnail-url" {...register('thumbnailUrl')} name="thumbnailUrl" autoComplete="url" placeholder="Or paste direct image URL" className="block w-full px-4 py-2 border border-[#241d18] rounded-xl bg-[#14100d]/90 text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60" />
              </div>

              <div className="pt-6 flex justify-between items-center border-t border-[#241d18]">
                <div>
                  {(createProj.isPending || updateProj.isPending) && (
                    <p className="text-xs text-[#F9B637] font-medium flex items-center">
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-[#FB6C00]" />
                      Optimizing & uploading to Cloudinary...
                    </p>
                  )}
                  {(createProj.isError || updateProj.isError) && (
                    <p className="text-xs text-[#E73F1E] font-medium">
                      {(createProj.error || updateProj.error)?.response?.data?.message || 'Upload failed. Please check your image.'}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-stone-400 hover:text-white rounded-xl text-sm">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={createProj.isPending || updateProj.isPending} 
                    className="px-6 py-2.5 bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.3)] text-sm flex items-center"
                  >
                    {(createProj.isPending || updateProj.isPending) ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Uploading & Saving...
                      </>
                    ) : (
                      'Save Project'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Image Cropper & Adjuster Modal */}
      <ImageEditorModal
        isOpen={isImageEditorOpen}
        onClose={() => setIsImageEditorOpen(false)}
        imageSrc={editorImageSrc}
        filename={thumbnailFile?.name || 'project-thumbnail.webp'}
        aspectRatioPreset="16:9"
        onSave={(editedFile, previewUrl) => {
          setThumbnailFile(editedFile)
          setThumbnailPreview(previewUrl)
        }}
      />
    </div>
  )
}
