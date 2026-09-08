import React, { useState, useEffect } from 'react'
import { useAlert, useUpdateAlert } from '../hooks/useOtherEntities'
import {
  AlertTriangle,
  Bell,
  Sparkles,
  Terminal,
  Info,
  CheckCircle,
  Zap,
  Loader2,
  Save,
  Check,
  RotateCcw,
  Eye,
  Sliders,
  Palette,
  Type,
  X,
} from 'lucide-react'

const ICON_MAP = {
  AlertTriangle,
  Bell,
  Sparkles,
  Terminal,
  Info,
  CheckCircle,
  Zap,
}

const PRESETS = [
  {
    name: 'Amber Warning',
    badge: 'BETA',
    primaryColor: '#eab308',
    backgroundColor: '#030712',
    borderColor: '#854d0e',
    titleColor: '#facc15',
    textColor: '#9ca3af',
    badgeBgColor: '#422006',
    badgeTextColor: '#fde047',
    glowColor: '#facc15',
    icon: 'AlertTriangle',
  },
  {
    name: 'Emerald Cyber',
    badge: 'ONLINE',
    primaryColor: '#22c55e',
    backgroundColor: '#022c22',
    borderColor: '#15803d',
    titleColor: '#4ade80',
    textColor: '#a7f3d0',
    badgeBgColor: '#064e3b',
    badgeTextColor: '#86efac',
    glowColor: '#22c55e',
    icon: 'Terminal',
  },
  {
    name: 'Electric Blue',
    badge: 'INFO',
    primaryColor: '#38bdf8',
    backgroundColor: '#030712',
    borderColor: '#0284c7',
    titleColor: '#38bdf8',
    textColor: '#94a3b8',
    badgeBgColor: '#082f49',
    badgeTextColor: '#7dd3fc',
    glowColor: '#0ea5e9',
    icon: 'Info',
  },
  {
    name: 'Crimson Alert',
    badge: 'MAINTENANCE',
    primaryColor: '#ef4444',
    backgroundColor: '#0f0404',
    borderColor: '#991b1b',
    titleColor: '#f87171',
    textColor: '#fca5a5',
    badgeBgColor: '#450a0a',
    badgeTextColor: '#fecaca',
    glowColor: '#ef4444',
    icon: 'AlertTriangle',
  },
  {
    name: 'Purple Cyberpunk',
    badge: 'FEATURE',
    primaryColor: '#c084fc',
    backgroundColor: '#090514',
    borderColor: '#7e22ce',
    titleColor: '#d8b4fe',
    textColor: '#d1d5db',
    badgeBgColor: '#3b0764',
    badgeTextColor: '#f3e8ff',
    glowColor: '#a855f7',
    icon: 'Sparkles',
  },
]

export default function AlertSettings() {
  const { data: alertData, isLoading } = useAlert()
  const updateAlert = useUpdateAlert()

  const [form, setForm] = useState({
    isActive: false,
    message: 'SYSTEM UPDATE IN PROGRESS',
    badgeText: 'BETA',
    subtext: 'Some portfolio modules are currently being synchronized with live database.',
    footerText: 'v2.1 • node@online',
    icon: 'AlertTriangle',
    position: 'bottom-center',
    showCloseButton: true,
    primaryColor: '#eab308',
    backgroundColor: '#030712',
    borderColor: '#854d0e',
    titleColor: '#facc15',
    textColor: '#9ca3af',
    badgeBgColor: '#422006',
    badgeTextColor: '#fde047',
    glowColor: '#facc15',
    fontFamily: 'font-mono',
    titleFontSize: 'text-xs',
    bodyFontSize: 'text-xs',
    pulseGlow: true,
    backdropBlur: true,
  })

  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (alertData) {
      setForm((prev) => ({
        ...prev,
        ...alertData,
      }))
    }
  }, [alertData])

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSavedSuccess(false)
  }

  const applyPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      ...preset,
    }))
    setSavedSuccess(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateAlert.mutate(form, {
      onSuccess: () => {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3500)
      },
    })
  }

  const SelectedIcon = ICON_MAP[form.icon] || AlertTriangle

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
            <Bell className="w-7 h-7 text-[#FB6C00]" />
            App Alert Banner Settings
          </h1>
          <p className="text-sm text-stone-400">
            Customize the global notice banner displayed across your portfolio website in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={updateAlert.isPending}
          className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm disabled:opacity-50"
        >
          {updateAlert.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2 text-white" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Alert configuration saved and synchronized with live portfolio!
        </div>
      )}

      {/* Interactive Live Preview Box */}
      <div className="p-6 rounded-2xl bg-[#110e0c] border border-[#241d18] shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            <Eye className="w-4 h-4 text-[#FB6C00]" />
            Interactive Live Preview
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              form.isActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {form.isActive ? '● Visible on Site' : '○ Hidden on Site'}
          </span>
        </div>

        {/* Portfolio Simulated Background Preview */}
        <div className="w-full bg-[#030712] border border-gray-800 rounded-xl p-8 flex items-center justify-center min-h-[220px] relative overflow-hidden">
          {/* Subtle grid lines background to mimic portfolio */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#22c55e 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {form.isActive ? (
            <div
              className={`w-full max-w-lg rounded-xl p-4 shadow-2xl relative transition-all duration-300 ${
                form.fontFamily
              } ${form.backdropBlur ? 'backdrop-blur-md' : ''}`}
              style={{
                backgroundColor: form.backgroundColor,
                borderColor: form.borderColor,
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: `0 10px 30px -5px ${form.glowColor}25`,
              }}
            >
              {/* Glowing Top Line */}
              {form.pulseGlow && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] animate-pulse"
                  style={{
                    background: `linear-gradient(to right, transparent, ${form.glowColor}, transparent)`,
                  }}
                />
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 p-2 rounded-lg shrink-0"
                    style={{
                      backgroundColor: `${form.primaryColor}1a`,
                      borderColor: `${form.primaryColor}4d`,
                      borderWidth: '1px',
                      color: form.primaryColor,
                    }}
                  >
                    <SelectedIcon className="w-5 h-5 animate-pulse" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`${form.titleFontSize} font-bold tracking-wider`}
                        style={{ color: form.titleColor }}
                      >
                        {form.message || 'SYSTEM UPDATE'}
                      </span>
                      {form.badgeText && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border"
                          style={{
                            backgroundColor: form.badgeBgColor,
                            color: form.badgeTextColor,
                            borderColor: `${form.primaryColor}50`,
                          }}
                        >
                          {form.badgeText}
                        </span>
                      )}
                    </div>

                    {form.subtext && (
                      <p
                        className={`mt-1 ${form.bodyFontSize} leading-relaxed`}
                        style={{ color: form.textColor }}
                      >
                        {form.subtext}
                      </p>
                    )}

                    {form.footerText && (
                      <div className="mt-2 flex items-center gap-2 text-[11px] opacity-80" style={{ color: form.textColor }}>
                        <Terminal className="w-3 h-3 text-green-400" />
                        <span>{form.footerText}</span>
                      </div>
                    )}
                  </div>
                </div>

                {form.showCloseButton && (
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-stone-500 font-mono text-sm">
              Banner is currently disabled. Toggle &quot;Enable Alert Banner&quot; below to display.
            </div>
          )}
        </div>
      </div>

      {/* Quick Theme Presets */}
      <div className="p-6 rounded-2xl bg-[#110e0c] border border-[#241d18] space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Palette className="w-4 h-4 text-[#FB6C00]" />
          Quick Theme Presets
        </div>
        <p className="text-xs text-stone-400">Apply a curated color and icon palette with one click:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="flex flex-col items-start p-3 rounded-xl border border-[#241d18] bg-[#1a1410] hover:border-[#FB6C00] transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-2 w-full">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primaryColor }} />
                <span className="text-xs font-semibold text-stone-200 group-hover:text-white truncate">
                  {p.name}
                </span>
              </div>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded border"
                style={{
                  backgroundColor: p.badgeBgColor,
                  color: p.badgeTextColor,
                  borderColor: p.primaryColor,
                }}
              >
                {p.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Settings Grid */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Content & Behavior */}
        <div className="p-6 rounded-2xl bg-[#110e0c] border border-[#241d18] space-y-6">
          <div className="flex items-center gap-2 text-base font-bold text-white border-b border-[#241d18] pb-3">
            <Sliders className="w-5 h-5 text-[#FB6C00]" />
            Content & Visibility
          </div>

          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1410] border border-[#241d18]">
            <div>
              <label className="text-sm font-bold text-white block">Enable Alert Banner</label>
              <p className="text-xs text-stone-400">Toggle whether this notice appears on your portfolio</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FB6C00]"></div>
            </label>
          </div>

          {/* Headline Message */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">Headline / Title</label>
            <input
              type="text"
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="e.g. SYSTEM UPDATE IN PROGRESS"
              className="w-full bg-[#1a1410] border border-[#241d18] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FB6C00] transition-colors"
            />
          </div>

          {/* Badge Text */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">Badge Text</label>
            <input
              type="text"
              value={form.badgeText}
              onChange={(e) => handleChange('badgeText', e.target.value)}
              placeholder="e.g. BETA, LIVE, NOTICE"
              className="w-full bg-[#1a1410] border border-[#241d18] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FB6C00] transition-colors"
            />
          </div>

          {/* Subtext Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">Detailed Description</label>
            <textarea
              rows={3}
              value={form.subtext}
              onChange={(e) => handleChange('subtext', e.target.value)}
              placeholder="Describe the update, notice, or event..."
              className="w-full bg-[#1a1410] border border-[#241d18] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FB6C00] transition-colors resize-none"
            />
          </div>

          {/* Footer Text */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">Footer / Status Tagline</label>
            <input
              type="text"
              value={form.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              placeholder="e.g. v2.1 • node@online"
              className="w-full bg-[#1a1410] border border-[#241d18] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FB6C00] transition-colors"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">Banner Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {Object.keys(ICON_MAP).map((iconKey) => {
                const IconComp = ICON_MAP[iconKey]
                const isSelected = form.icon === iconKey
                return (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => handleChange('icon', iconKey)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#FB6C00]/20 border-[#FB6C00] text-[#FB6C00]'
                        : 'bg-[#1a1410] border-[#241d18] text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    <IconComp className="w-5 h-5 mb-1" />
                    <span className="text-[10px] truncate max-w-full">{iconKey}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Position & Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">Screen Position</label>
              <select
                value={form.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full bg-[#1a1410] border border-[#241d18] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FB6C00]"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="top-center">Top Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={form.showCloseButton}
                  onChange={(e) => handleChange('showCloseButton', e.target.checked)}
                  className="rounded bg-[#1a1410] border-[#241d18] text-[#FB6C00] focus:ring-0"
                />
                Show Close &apos;✕&apos; Button
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={form.pulseGlow}
                  onChange={(e) => handleChange('pulseGlow', e.target.checked)}
                  className="rounded bg-[#1a1410] border-[#241d18] text-[#FB6C00] focus:ring-0"
                />
                Animated Top Glow Bar
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={form.backdropBlur}
                  onChange={(e) => handleChange('backdropBlur', e.target.checked)}
                  className="rounded bg-[#1a1410] border-[#241d18] text-[#FB6C00] focus:ring-0"
                />
                Backdrop Glassmorphism Blur
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Colors & Typography */}
        <div className="p-6 rounded-2xl bg-[#110e0c] border border-[#241d18] space-y-6">
          <div className="flex items-center gap-2 text-base font-bold text-white border-b border-[#241d18] pb-3">
            <Palette className="w-5 h-5 text-[#FB6C00]" />
            Colors & Typography
          </div>

          {/* Typography Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
              <Type className="w-4 h-4 text-[#FB6C00]" /> Font Family
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Monospace', val: 'font-mono', desc: 'Code & Terminal' },
                { label: 'Sans-Serif', val: 'font-sans', desc: 'Modern & Clean' },
                { label: 'Serif', val: 'font-serif', desc: 'Classic Editorial' },
              ].map((f) => (
                <button
                  key={f.val}
                  type="button"
                  onClick={() => handleChange('fontFamily', f.val)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.fontFamily === f.val
                      ? 'bg-[#FB6C00]/20 border-[#FB6C00] text-white'
                      : 'bg-[#1a1410] border-[#241d18] text-stone-400 hover:border-stone-600'
                  }`}
                >
                  <div className={`text-sm font-bold ${f.val}`}>{f.label}</div>
                  <div className="text-[10px] text-stone-500 mt-1">{f.desc}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">Title Font Size</label>
                <select
                  value={form.titleFontSize}
                  onChange={(e) => handleChange('titleFontSize', e.target.value)}
                  className="w-full bg-[#1a1410] border border-[#241d18] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FB6C00]"
                >
                  <option value="text-xs">Extra Small (text-xs)</option>
                  <option value="text-sm">Small (text-sm)</option>
                  <option value="text-base">Medium (text-base)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">Body Font Size</label>
                <select
                  value={form.bodyFontSize}
                  onChange={(e) => handleChange('bodyFontSize', e.target.value)}
                  className="w-full bg-[#1a1410] border border-[#241d18] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FB6C00]"
                >
                  <option value="text-[11px]">Compact (11px)</option>
                  <option value="text-xs">Standard (text-xs)</option>
                  <option value="text-sm">Readable (text-sm)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Color Palettes */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-stone-300">Custom Color Palette</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'primaryColor', label: 'Primary Accent' },
                { key: 'titleColor', label: 'Title Color' },
                { key: 'textColor', label: 'Body Text Color' },
                { key: 'glowColor', label: 'Top Glow Bar' },
                { key: 'backgroundColor', label: 'Card Background' },
                { key: 'borderColor', label: 'Border Color' },
                { key: 'badgeBgColor', label: 'Badge Background' },
                { key: 'badgeTextColor', label: 'Badge Text' },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-2 p-2 rounded-xl bg-[#1a1410] border border-[#241d18]">
                  <input
                    type="color"
                    value={form[item.key]?.startsWith('#') ? form[item.key] : '#eab308'}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none p-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] text-stone-400 block truncate">{item.label}</span>
                    <input
                      type="text"
                      value={form[item.key] || ''}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full bg-transparent text-xs text-stone-200 font-mono focus:outline-none border-b border-transparent focus:border-[#FB6C00]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-[#241d18]">
            <button
              type="button"
              onClick={() => applyPreset(PRESETS[0])}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Default
            </button>

            <button
              type="submit"
              disabled={updateAlert.isPending}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] hover:brightness-110 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(231,63,30,0.35)] transition-all text-sm disabled:opacity-50"
            >
              {updateAlert.isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
