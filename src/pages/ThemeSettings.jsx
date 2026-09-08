import React, { useState, useEffect } from 'react'
import { useTheme, useUpdateTheme } from '../hooks/useOtherEntities'
import {
  Palette,
  Type,
  Eye,
  CheckCircle,
  Save,
  Loader2,
  Sparkles,
  RotateCcw,
  Check,
  Terminal,
  Code,
  Folder,
} from 'lucide-react'

const THEME_PRESETS = [
  {
    name: 'Matrix Hacker',
    primaryColor: '#4ade80',
    primaryDarkColor: '#22c55e',
    secondaryColor: '#22d3ee',
    secondaryDarkColor: '#06b6d4',
    backgroundColor: '#030712',
    cardBackgroundColor: '#111827',
    cardSubColor: '#1f2937',
    glowColor: '#22c55e',
    fontFamily: "'JetBrains Mono', monospace",
    fontType: 'mono',
  },
  {
    name: 'Cyberpunk Neon',
    primaryColor: '#c084fc',
    primaryDarkColor: '#a855f7',
    secondaryColor: '#38bdf8',
    secondaryDarkColor: '#0ea5e9',
    backgroundColor: '#090514',
    cardBackgroundColor: '#150d2a',
    cardSubColor: '#231647',
    glowColor: '#a855f7',
    fontFamily: "'JetBrains Mono', monospace",
    fontType: 'mono',
  },
  {
    name: 'Solar Sunset',
    primaryColor: '#fbbf24',
    primaryDarkColor: '#f59e0b',
    secondaryColor: '#f87171',
    secondaryDarkColor: '#ef4444',
    backgroundColor: '#0c0a09',
    cardBackgroundColor: '#1c1917',
    cardSubColor: '#292524',
    glowColor: '#f59e0b',
    fontFamily: "'Space Grotesk', sans-serif",
    fontType: 'sans',
  },
  {
    name: 'Oceanic Azure',
    primaryColor: '#38bdf8',
    primaryDarkColor: '#0284c7',
    secondaryColor: '#2dd4bf',
    secondaryDarkColor: '#0d9488',
    backgroundColor: '#020817',
    cardBackgroundColor: '#0f172a',
    cardSubColor: '#1e293b',
    glowColor: '#0284c7',
    fontFamily: "'Inter', sans-serif",
    fontType: 'sans',
  },
  {
    name: 'Crimson Cyber',
    primaryColor: '#f87171',
    primaryDarkColor: '#dc2626',
    secondaryColor: '#fb923c',
    secondaryDarkColor: '#ea580c',
    backgroundColor: '#090303',
    cardBackgroundColor: '#180707',
    cardSubColor: '#280c0c',
    glowColor: '#dc2626',
    fontFamily: "'Fira Code', monospace",
    fontType: 'mono',
  },
  {
    name: 'Luxury Champagne',
    primaryColor: '#facc15',
    primaryDarkColor: '#ca8a04',
    secondaryColor: '#fb923c',
    secondaryDarkColor: '#d97706',
    backgroundColor: '#080705',
    cardBackgroundColor: '#17140f',
    cardSubColor: '#27221a',
    glowColor: '#ca8a04',
    fontFamily: "'Playfair Display', serif",
    fontType: 'serif',
  },
  {
    name: 'Monochrome Pro',
    primaryColor: '#ffffff',
    primaryDarkColor: '#e5e7eb',
    secondaryColor: '#94a3b8',
    secondaryDarkColor: '#64748b',
    backgroundColor: '#09090b',
    cardBackgroundColor: '#18181b',
    cardSubColor: '#27272a',
    glowColor: '#e5e7eb',
    fontFamily: "'Inter', sans-serif",
    fontType: 'sans',
  },
]

const FONT_OPTIONS = [
  { name: 'JetBrains Mono', family: "'JetBrains Mono', monospace", type: 'mono', category: 'Monospace' },
  { name: 'Fira Code', family: "'Fira Code', monospace", type: 'mono', category: 'Monospace' },
  { name: 'Inter', family: "'Inter', sans-serif", type: 'sans', category: 'Sans-Serif' },
  { name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", type: 'sans', category: 'Modern Sans' },
  { name: 'Poppins', family: "'Poppins', sans-serif", type: 'sans', category: 'Sans-Serif' },
  { name: 'Outfit', family: "'Outfit', sans-serif", type: 'sans', category: 'Sans-Serif' },
  { name: 'Playfair Display', family: "'Playfair Display', serif", type: 'serif', category: 'Editorial Serif' },
]

export default function ThemeSettings() {
  const { data: themeData, isLoading } = useTheme()
  const updateTheme = useUpdateTheme()

  const [form, setForm] = useState({
    presetName: 'Matrix Hacker',
    primaryColor: '#4ade80',
    primaryDarkColor: '#22c55e',
    secondaryColor: '#22d3ee',
    secondaryDarkColor: '#06b6d4',
    backgroundColor: '#030712',
    cardBackgroundColor: '#111827',
    cardSubColor: '#1f2937',
    glowColor: '#22c55e',
    fontFamily: "'JetBrains Mono', monospace",
    fontType: 'mono',
  })

  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (themeData) {
      setForm((prev) => ({
        ...prev,
        ...themeData,
      }))
    }
  }, [themeData])

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSavedSuccess(false)
  }

  const applyPreset = (preset) => {
    setForm({
      ...preset,
      presetName: preset.name,
    })
    setSavedSuccess(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateTheme.mutate(form, {
      onSuccess: () => {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3500)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#FB6C00]" />
      </div>
    )
  }

  return (
    <div className="space-y-8 w-full max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 flex items-center gap-3">
            <Palette className="w-7 h-7 text-[#FB6C00]" />
            Portfolio Theme & Typography Studio
          </h1>
          <p className="text-sm text-stone-400">
            Customize the entire portfolio&apos;s colors, background, cards, and font type with live synchronization.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={updateTheme.isPending}
          className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm disabled:opacity-50"
        >
          {updateTheme.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2 text-white" /> Theme Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Theme
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Theme settings saved! The live portfolio has been synchronized.
        </div>
      )}

      {/* Live Simulation Mockup */}
      <div className="p-6 rounded-2xl bg-[#110e0c] border border-[#241d18] shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            <Eye className="w-4 h-4 text-[#FB6C00]" />
            Live Portfolio Preview ({form.presetName || 'Custom'})
          </div>
          <span className="text-xs text-stone-400 font-mono">
            Font: <span className="text-white font-bold">{form.fontFamily.split(',')[0]}</span>
          </span>
        </div>

        {/* Mockup Canvas */}
        <div
          className="w-full rounded-2xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: form.backgroundColor,
            borderColor: `${form.primaryColor}33`,
            fontFamily: form.fontFamily,
          }}
        >
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${form.primaryColor} 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />

          <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
            {/* Mockup Header Terminal */}
            <div
              className="rounded-xl border p-4 shadow-xl backdrop-blur-sm"
              style={{
                backgroundColor: form.cardBackgroundColor,
                borderColor: `${form.primaryColor}40`,
                boxShadow: `0 0 25px ${form.glowColor}15`,
              }}
            >
              <div className="flex items-center gap-2 pb-3 border-b mb-3" style={{ borderColor: `${form.primaryColor}25` }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="ml-3 text-[11px] opacity-60 text-gray-400">bash — 80x24</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs flex items-center gap-2" style={{ color: form.primaryColor }}>
                  <Terminal className="w-3.5 h-3.5" />
                  <span>guest@portfolio:~$ hello</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${form.primaryColor}, ${form.secondaryColor})`,
                  }}
                >
                  Pola Mounir
                </h2>
                <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                  Frontend Developer building responsive and user-friendly web applications using React.js and modern web technologies.
                </p>
              </div>
            </div>

            {/* Mockup Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Years Exp', val: '1+' },
                { label: 'Projects', val: '5+' },
                { label: 'Code Lines', val: '40K+' },
                { label: 'Location', val: 'Giza, EGY' },
              ].map((st, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border transition-transform hover:scale-105"
                  style={{
                    backgroundColor: form.cardBackgroundColor,
                    borderColor: `${form.primaryColor}30`,
                  }}
                >
                  <div className="text-xl font-extrabold" style={{ color: form.primaryColor }}>
                    {st.val}
                  </div>
                  <div className="text-[10px] text-gray-400">{st.label}</div>
                </div>
              ))}
            </div>

            {/* Mockup Project Card */}
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: form.cardBackgroundColor,
                borderColor: `${form.primaryColor}33`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" style={{ color: form.primaryColor }} />
                  <span className="text-sm font-bold" style={{ color: form.primaryColor }}>
                    Fast-Box Courier
                  </span>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${form.primaryColor}1a`,
                    color: form.primaryColor,
                    borderColor: `${form.primaryColor}50`,
                  }}
                >
                  Production
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Fastest and reliable courier service built with React.js &amp; Tailwind CSS.
              </p>
              <div className="flex gap-2">
                {['React.js', 'Tailwind CSS', 'TypeScript'].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: `${form.primaryColor}15`,
                      color: form.primaryColor,
                      borderColor: `${form.primaryColor}40`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Curated Presets */}
      <div className="p-6 rounded-2xl bg-[#110e0c] border border-[#241d18] space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Sparkles className="w-4 h-4 text-[#FB6C00]" />
          1-Click Curated Color Themes
        </div>
        <p className="text-xs text-stone-400">Click any preset to apply a complete aesthetic across your entire portfolio:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {THEME_PRESETS.map((p) => {
            const isSelected = form.presetName === p.name
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                  isSelected
                    ? 'border-[#FB6C00] bg-[#FB6C00]/10 shadow-[0_0_15px_rgba(251,108,0,0.2)]'
                    : 'border-[#241d18] bg-[#1a1410] hover:border-stone-600'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-2 w-full">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: p.primaryColor }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: p.secondaryColor }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-black/30 ml-auto" style={{ backgroundColor: p.backgroundColor }} />
                </div>
                <span className="text-xs font-bold text-white truncate w-full">{p.name}</span>
                <span className="text-[10px] text-stone-400 truncate w-full mt-0.5">{p.fontType}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Typography Selector */}
      <div className="p-6 rounded-2xl bg-[#110e0c] border border-[#241d18] space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-white border-b border-[#241d18] pb-3">
          <Type className="w-5 h-5 text-[#FB6C00]" />
          Typography &amp; Font Family
        </div>
        <p className="text-xs text-stone-400">
          Select the typography style applied throughout all headings, terminal prompts, descriptions, and buttons:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {FONT_OPTIONS.map((f) => {
            const isSelected = form.fontFamily.includes(f.name)
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => {
                  handleChange('fontFamily', f.family)
                  handleChange('fontType', f.type)
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#FB6C00] bg-[#FB6C00]/10 shadow-[0_0_15px_rgba(251,108,0,0.2)]'
                    : 'border-[#241d18] bg-[#1a1410] hover:border-stone-600'
                }`}
              >
                <div className="text-xs font-semibold text-[#FB6C00] uppercase tracking-wider mb-1">
                  {f.category}
                </div>
                <div className="text-base font-bold text-white mb-2" style={{ fontFamily: f.family }}>
                  {f.name}
                </div>
                <p className="text-xs text-stone-400 leading-tight" style={{ fontFamily: f.family }}>
                  The quick brown fox jumps over the lazy dog. 0123456789
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Granular Color Pickers */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#110e0c] border border-[#241d18] space-y-6">
        <div className="flex items-center gap-2 text-base font-bold text-white border-b border-[#241d18] pb-3">
          <Palette className="w-5 h-5 text-[#FB6C00]" />
          Granular Color Customizer
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'primaryColor', label: 'Primary Accent (Headings, Accents)', desc: 'Replaces green-400 across the site' },
            { key: 'primaryDarkColor', label: 'Primary Accent Dark (Buttons, Highlights)', desc: 'Replaces green-500 across the site' },
            { key: 'secondaryColor', label: 'Secondary Accent (Gradient Accents)', desc: 'Replaces cyan-400 across the site' },
            { key: 'secondaryDarkColor', label: 'Secondary Accent Dark (Gradient End)', desc: 'Replaces cyan-500 across the site' },
            { key: 'backgroundColor', label: 'Main Page Background', desc: 'Replaces gray-950 dark background' },
            { key: 'cardBackgroundColor', label: 'Card & Container Background', desc: 'Replaces gray-900 card panels' },
            { key: 'cardSubColor', label: 'Card Sub-sections & Modals', desc: 'Replaces gray-800 borders & blocks' },
            { key: 'glowColor', label: 'Glow & Ambient Shadow Color', desc: 'Used for interactive cursor & cards glow' },
          ].map((item) => (
            <div key={item.key} className="p-3.5 rounded-xl bg-[#1a1410] border border-[#241d18] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.label}</span>
                <input
                  type="color"
                  value={form[item.key] || '#000000'}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none p-0"
                />
              </div>
              <input
                type="text"
                value={form[item.key] || ''}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="w-full bg-[#110e0c] border border-[#241d18] rounded-lg px-3 py-1.5 text-xs text-stone-200 font-mono focus:outline-none focus:border-[#FB6C00]"
              />
              <p className="text-[10px] text-stone-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="pt-4 flex items-center justify-between border-t border-[#241d18]">
          <button
            type="button"
            onClick={() => applyPreset(THEME_PRESETS[0])}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Matrix Hacker
          </button>

          <button
            type="submit"
            disabled={updateTheme.isPending}
            className="flex items-center px-6 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm disabled:opacity-50"
          >
            {updateTheme.isPending ? 'Saving...' : 'Save Theme Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
