import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useProfile, useUpdateProfile } from '../hooks/useProfile'
import { Loader2, Save, Upload, CheckCircle2, FileText, Crop, Eye } from 'lucide-react'
import PdfPreviewModal from '../components/PdfPreviewModal'
import ImageEditorModal from '../components/ImageEditorModal'

export default function Profile() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumePreviewUrl, setResumePreviewUrl] = useState(null)

  // Modals state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false)
  const [editorImageSrc, setEditorImageSrc] = useState(null)

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        title: profile.title || '',
        headline: profile.headline || '',
        yearsOfExperience: profile.yearsOfExperience || '1+',
        linesOfCode: profile.linesOfCode || '40K+',
        bio: profile.shortBio || profile.detailedBio || profile.bio || '',
        email: profile.contact?.email || profile.email || '',
        location: profile.contact?.location || profile.location || '',
        githubUrl: profile.socialLinks?.github || profile.githubUrl || '',
        linkedinUrl: profile.socialLinks?.linkedin || profile.linkedinUrl || '',
      })
    }
  }, [profile, reset])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setAvatarFile(file)
      setAvatarPreview(preview)
      setEditorImageSrc(preview)
    }
  }

  const openExistingImageEditor = () => {
    const src = avatarPreview || profile?.avatarUrl
    if (src) {
      setEditorImageSrc(src)
      setIsImageEditorOpen(true)
    }
  }

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setResumePreviewUrl(URL.createObjectURL(file))
    }
  }

  const openPdfPreview = () => {
    const activeUrl = resumePreviewUrl || profile?.resumeUrl
    if (activeUrl) {
      setIsPdfModalOpen(true)
    }
  }

  const onSubmit = (data) => {
    const formData = new FormData()
    
    // Append text fields
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })

    // Append files if selected
    if (avatarFile) {
      formData.append('avatarUrl', avatarFile)
    }
    if (resumeFile) {
      formData.append('resumeUrl', resumeFile)
    }

    updateProfile.mutate(formData, {
      onSuccess: () => {
        setAvatarFile(null)
        setAvatarPreview(null)
        setResumeFile(null)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#FB6C00]" />
      </div>
    )
  }

  const activePdfUrl = resumePreviewUrl || profile?.resumeUrl

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">Profile Settings</h1>
        <p className="text-sm text-stone-400">Update your portfolio's main details, avatar, and resume.</p>
      </div>

      <div className="glass p-4 sm:p-8 rounded-2xl border border-[#241d18] shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          
          {/* Avatar & Resume Uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Avatar Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-300">Avatar Image</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                <div className={`h-24 w-24 rounded-2xl bg-[#1a1511] overflow-hidden border ${avatarPreview ? 'border-[#FB6C00] shadow-[0_0_15px_rgba(251,108,0,0.4)]' : 'border-[#241d18]'} shrink-0 shadow-md relative group`}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
                  ) : profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-stone-500 text-xs">No Image</div>
                  )}

                  {(avatarPreview || profile?.avatarUrl) && (
                    <button
                      type="button"
                      onClick={openExistingImageEditor}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-bold transition-opacity gap-1"
                      title="Edit & Crop Avatar"
                    >
                      <Crop className="w-4 h-4 text-[#FB6C00]" />
                      <span>Edit/Crop</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <label htmlFor="profile-avatar-input" className="cursor-pointer group inline-flex items-center justify-center px-4 py-2 border border-[#3b322a] border-dashed rounded-xl hover:border-[#FB6C00]/60 hover:bg-[#FB6C00]/5 transition-all">
                      <Upload className="w-4 h-4 mr-2 text-stone-400 group-hover:text-[#F9B637] transition-colors" />
                      <span className="text-sm font-medium text-stone-300 group-hover:text-[#FFDD9C] transition-colors">
                        {avatarFile ? 'Change' : 'Choose New'}
                      </span>
                      <input id="profile-avatar-input" name="avatar" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} onClick={(e) => { e.target.value = null }} />
                    </label>

                    {(avatarPreview || profile?.avatarUrl) && (
                      <button
                        type="button"
                        onClick={openExistingImageEditor}
                        className="inline-flex items-center justify-center px-3.5 py-2 border border-[#3b322a] bg-[#1a1511] hover:bg-[#241d18] rounded-xl text-stone-300 hover:text-white transition-all text-xs font-semibold gap-1.5"
                      >
                        <Crop className="w-3.5 h-3.5 text-[#FB6C00]" />
                        <span>Edit / Crop</span>
                      </button>
                    )}
                  </div>

                  {avatarFile && (
                    <p className="text-xs text-[#F9B637] font-medium flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#FB6C00]" />
                      Ready: {avatarFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Section with Preview Modal */}
            <div className="space-y-2">
              <label htmlFor="profile-resume-input" className="block text-sm font-medium text-stone-300">Resume Document (PDF)</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1 space-y-2">
                  {resumeFile ? (
                    <div className="p-2.5 rounded-xl bg-[#1a1511] border border-[#FB6C00]/40 flex items-center text-xs text-[#FFDD9C] font-medium">
                      <FileText className="w-4 h-4 mr-2 text-[#FB6C00] shrink-0" />
                      <span className="truncate">{resumeFile.name}</span>
                      <span className="ml-1 text-stone-400">({Math.round(resumeFile.size / 1024)} KB)</span>
                    </div>
                  ) : profile?.resumeUrl ? (
                    <div className="text-stone-300 text-xs font-medium flex items-center">
                      <FileText className="w-4 h-4 mr-1.5 text-stone-400" /> Current resume available
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500">No resume uploaded</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {activePdfUrl && (
                      <button
                        type="button"
                        onClick={openPdfPreview}
                        className="inline-flex items-center justify-center px-3.5 py-2 bg-[#FB6C00]/15 hover:bg-[#FB6C00]/25 text-[#FFDD9C] rounded-xl border border-[#FB6C00]/30 transition-all text-xs font-semibold gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FB6C00]" />
                        <span>Preview PDF</span>
                      </button>
                    )}

                    <label htmlFor="profile-resume-input" className="cursor-pointer group inline-flex items-center justify-center px-3.5 py-2 border border-[#3b322a] border-dashed rounded-xl hover:border-[#FB6C00]/60 hover:bg-[#FB6C00]/5 transition-all">
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-stone-400 group-hover:text-[#F9B637] transition-colors" />
                      <span className="text-xs font-medium text-stone-300 group-hover:text-[#FFDD9C] transition-colors">
                        {resumeFile ? 'Change PDF' : 'Upload PDF'}
                      </span>
                      <input id="profile-resume-input" name="resume" type="file" className="hidden" accept=".pdf" onChange={handleResumeChange} onClick={(e) => { e.target.value = null }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-[#241d18]" />

          {/* Text Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="profile-name" className="block text-sm font-medium text-stone-300">Name</label>
              <input id="profile-name" {...register('name')} name="name" autoComplete="name" className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all" />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="profile-title" className="block text-sm font-medium text-stone-300">Title / Role</label>
              <input id="profile-title" {...register('title')} name="title" autoComplete="organization-title" className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-email" className="block text-sm font-medium text-stone-300">Contact Email</label>
              <input id="profile-email" {...register('email')} name="email" type="email" autoComplete="email" className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-location" className="block text-sm font-medium text-stone-300">Location</label>
              <input id="profile-location" {...register('location')} name="location" autoComplete="address-level2" className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-exp" className="block text-sm font-medium text-stone-300">Years of Experience (Metric)</label>
              <input id="profile-exp" {...register('yearsOfExperience')} name="yearsOfExperience" placeholder="e.g. 1+" className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-codelines" className="block text-sm font-medium text-stone-300">Lines of Code (Metric)</label>
              <input id="profile-codelines" {...register('linesOfCode')} name="linesOfCode" placeholder="e.g. 40K+" className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="profile-headline" className="block text-sm font-medium text-stone-300">
                Hero Introduction Headline / Paragraph <span className="text-[#F9B637] text-xs font-normal">(Shown in the terminal intro card on Home page)</span>
              </label>
              <textarea id="profile-headline" {...register('headline')} name="headline" rows={3} placeholder="Pola Mounir is a React Frontend Developer based in Giza, Egypt, specializing in responsive web applications..." className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all resize-none text-sm" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="profile-bio" className="block text-sm font-medium text-stone-300">
                About Me Bio Paragraphs <span className="text-[#F9B637] text-xs font-normal">(Shown on About page &amp; About card on Home)</span>
              </label>
              <textarea id="profile-bio" {...register('bio')} name="bio" autoComplete="off" rows={5} className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all resize-none text-sm" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-github" className="block text-sm font-medium text-stone-300">GitHub URL</label>
              <input id="profile-github" {...register('githubUrl')} name="githubUrl" type="url" autoComplete="url" className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-linkedin" className="block text-sm font-medium text-stone-300">LinkedIn URL</label>
              <input id="profile-linkedin" {...register('linkedinUrl')} name="linkedinUrl" type="url" autoComplete="url" className="block w-full px-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#241d18]">
            <div>
              {updateProfile.isPending && (
                <p className="text-xs text-[#F9B637] font-medium flex items-center">
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-[#FB6C00]" />
                  Optimizing & uploading to Cloudinary...
                </p>
              )}
              {updateProfile.isSuccess && (
                <p className="text-[#FFDD9C] font-semibold text-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> Profile saved successfully!
                </p>
              )}
              {updateProfile.isError && (
                <p className="text-[#E73F1E] text-sm font-medium">
                  {updateProfile.error?.response?.data?.message || 'Failed to update profile. Please try again.'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="w-full sm:w-auto group flex items-center justify-center py-3 px-8 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090807] focus:ring-[#FB6C00] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(231,63,30,0.3)] hover:shadow-[0_0_25px_rgba(251,108,0,0.45)]"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Uploading & Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* PDF Viewer Modal */}
      <PdfPreviewModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfUrl={activePdfUrl}
        title={resumeFile?.name || 'Resume Document'}
      />

      {/* Image Cropper & Adjuster Modal */}
      <ImageEditorModal
        isOpen={isImageEditorOpen}
        onClose={() => setIsImageEditorOpen(false)}
        imageSrc={editorImageSrc}
        filename={avatarFile?.name || 'avatar.webp'}
        aspectRatioPreset="1:1"
        onSave={(editedFile, previewUrl) => {
          setAvatarFile(editedFile)
          setAvatarPreview(previewUrl)
        }}
      />
    </div>
  )
}
