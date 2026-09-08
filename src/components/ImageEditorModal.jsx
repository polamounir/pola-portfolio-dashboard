import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Sliders, Check, RefreshCw, Crop, Move } from 'lucide-react'
import { useSidebar } from '../context/SidebarContext'

const CONTAINER_W = 480
const CONTAINER_H = 380

// Pure function outside component to prevent re-render loops
function getInitialCrop(ratioStr, imgWidth, imgHeight) {
  const pad = 24
  const maxW = CONTAINER_W - pad * 2
  const maxH = CONTAINER_H - pad * 2

  let ratio = 1
  if (ratioStr === '1:1') ratio = 1
  else if (ratioStr === '16:9') ratio = 16 / 9
  else if (ratioStr === '4:3') ratio = 4 / 3
  else if (ratioStr === 'free') {
    ratio = (imgWidth && imgHeight) ? (imgWidth / imgHeight) : (maxW / maxH)
  }

  let w = maxW
  let h = w / ratio
  if (h > maxH) {
    h = maxH
    w = h * ratio
  }

  return {
    x: Math.round((CONTAINER_W - w) / 2),
    y: Math.round((CONTAINER_H - h) / 2),
    width: Math.round(w),
    height: Math.round(h)
  }
}

export default function ImageEditorModal({
  isOpen,
  onClose,
  imageSrc,
  filename = 'edited-image.webp',
  aspectRatioPreset = '1:1',
  onSave
}) {
  const { isCollapsed } = useSidebar()
  const canvasRef = useRef(null)
  const [imageObj, setImageObj] = useState(null)

  // Transform states
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Filter adjustments
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [aspectRatio, setAspectRatio] = useState(aspectRatioPreset)
  const [activeTab, setActiveTab] = useState('crop')

  // Smooth DOM Crop Box State (pixels in container coordinates)
  const [crop, setCrop] = useState({ x: 40, y: 30, width: 320, height: 320 })

  // Interaction tracking refs
  const dragRef = useRef(null)

  // Prevent background scrolling
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

  // Load image once per open / imageSrc change
  useEffect(() => {
    if (!isOpen || !imageSrc) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImageObj(img)
      setZoom(1)
      setRotation(0)
      setPan({ x: 0, y: 0 })
      setBrightness(100)
      setContrast(100)
      setSaturation(100)
      setAspectRatio(aspectRatioPreset)
      setCrop(getInitialCrop(aspectRatioPreset, img.width, img.height))
    }
    img.onerror = () => {
      // Fallback without crossOrigin if CORS issues occur
      const fallbackImg = new Image()
      fallbackImg.onload = () => {
        setImageObj(fallbackImg)
        setZoom(1)
        setRotation(0)
        setPan({ x: 0, y: 0 })
        setBrightness(100)
        setContrast(100)
        setSaturation(100)
        setAspectRatio(aspectRatioPreset)
        setCrop(getInitialCrop(aspectRatioPreset, fallbackImg.width, fallbackImg.height))
      }
      fallbackImg.src = imageSrc
    }
    img.src = imageSrc
  }, [isOpen, imageSrc, aspectRatioPreset])

  // Redraw canvas ONLY when image, transforms, or filters change (separated from crop dragging!)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageObj) return
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, CONTAINER_W, CONTAINER_H)

    ctx.save()
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`

    const centerX = CONTAINER_W / 2 + pan.x
    const centerY = CONTAINER_H / 2 + pan.y
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation * Math.PI) / 180)

    const baseScale = Math.min(CONTAINER_W / imageObj.width, CONTAINER_H / imageObj.height) * 0.9
    const totalScale = baseScale * zoom
    ctx.scale(totalScale, totalScale)

    ctx.drawImage(
      imageObj,
      -imageObj.width / 2,
      -imageObj.height / 2,
      imageObj.width,
      imageObj.height
    )
    ctx.restore()
  }, [imageObj, zoom, rotation, pan, brightness, contrast, saturation])

  // Global window pointermove and pointerup listeners for zero-glitch dragging
  useEffect(() => {
    const onPointerMove = (e) => {
      if (!dragRef.current) return
      const { type, startX, startY, startCrop, startPan } = dragRef.current

      const dx = e.clientX - startX
      const dy = e.clientY - startY

      if (type === 'pan_img') {
        setPan({
          x: Math.round(startPan.x + dx),
          y: Math.round(startPan.y + dy)
        })
        return
      }

      if (type === 'move_crop') {
        const newX = Math.max(0, Math.min(CONTAINER_W - startCrop.width, startCrop.x + dx))
        const newY = Math.max(0, Math.min(CONTAINER_H - startCrop.height, startCrop.y + dy))
        setCrop((prev) => ({ ...prev, x: Math.round(newX), y: Math.round(newY) }))
        return
      }

      // Handle corner resizing
      let ratio = null
      if (aspectRatio === '1:1') ratio = 1
      else if (aspectRatio === '16:9') ratio = 16 / 9
      else if (aspectRatio === '4:3') ratio = 4 / 3

      const minSize = 40
      let { x, y, width: w, height: h } = startCrop

      if (type === 'se') {
        w = Math.max(minSize, Math.min(CONTAINER_W - x, startCrop.width + dx))
        if (ratio) {
          h = w / ratio
          if (y + h > CONTAINER_H) {
            h = CONTAINER_H - y
            w = h * ratio
          }
        } else {
          h = Math.max(minSize, Math.min(CONTAINER_H - y, startCrop.height + dy))
        }
      } else if (type === 'sw') {
        w = Math.max(minSize, Math.min(startCrop.x + startCrop.width, startCrop.width - dx))
        if (ratio) {
          h = w / ratio
          if (y + h > CONTAINER_H) {
            h = CONTAINER_H - y
            w = h * ratio
          }
        } else {
          h = Math.max(minSize, Math.min(CONTAINER_H - y, startCrop.height + dy))
        }
        x = startCrop.x + startCrop.width - w
      } else if (type === 'ne') {
        w = Math.max(minSize, Math.min(CONTAINER_W - x, startCrop.width + dx))
        if (ratio) {
          h = w / ratio
          if (startCrop.y + startCrop.height - h < 0) {
            h = startCrop.y + startCrop.height
            w = h * ratio
          }
        } else {
          h = Math.max(minSize, Math.min(startCrop.y + startCrop.height, startCrop.height - dy))
        }
        y = startCrop.y + startCrop.height - h
      } else if (type === 'nw') {
        w = Math.max(minSize, Math.min(startCrop.x + startCrop.width, startCrop.width - dx))
        if (ratio) {
          h = w / ratio
          if (startCrop.y + startCrop.height - h < 0) {
            h = startCrop.y + startCrop.height
            w = h * ratio
          }
        } else {
          h = Math.max(minSize, Math.min(startCrop.y + startCrop.height, startCrop.height - dy))
        }
        x = startCrop.x + startCrop.width - w
        y = startCrop.y + startCrop.height - h
      } else if (type === 'e') {
        w = Math.max(minSize, Math.min(CONTAINER_W - x, startCrop.width + dx))
      } else if (type === 'w') {
        w = Math.max(minSize, Math.min(startCrop.x + startCrop.width, startCrop.width - dx))
        x = startCrop.x + startCrop.width - w
      } else if (type === 's') {
        h = Math.max(minSize, Math.min(CONTAINER_H - y, startCrop.height + dy))
      } else if (type === 'n') {
        h = Math.max(minSize, Math.min(startCrop.y + startCrop.height, startCrop.height - dy))
        y = startCrop.y + startCrop.height - h
      }

      setCrop({
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(w),
        height: Math.round(h)
      })
    }

    const onPointerUp = () => {
      dragRef.current = null
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [aspectRatio])

  const startDrag = (e, type) => {
    e.stopPropagation()
    e.preventDefault()
    dragRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
      startPan: { ...pan }
    }
  }

  const handleSelectRatio = (ratio) => {
    setAspectRatio(ratio)
    setCrop(getInitialCrop(ratio, imageObj?.width, imageObj?.height))
  }

  const handleRotate = (deg) => {
    setRotation((prev) => (prev + deg + 360) % 360)
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setPan({ x: 0, y: 0 })
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setCrop(getInitialCrop(aspectRatio, imageObj?.width, imageObj?.height))
  }

  // Export cropped area to WebP Blob
  const handleSave = () => {
    if (!imageObj) return

    const exportCanvas = document.createElement('canvas')
    const maxOutputDim = 1280

    const outScale = Math.min(maxOutputDim / crop.width, maxOutputDim / crop.height, 3)
    const outW = Math.round(crop.width * outScale)
    const outH = Math.round(crop.height * outScale)

    exportCanvas.width = outW
    exportCanvas.height = outH
    const ctx = exportCanvas.getContext('2d')

    ctx.save()
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`

    ctx.scale(outScale, outScale)
    ctx.translate(-crop.x, -crop.y)

    const centerX = CONTAINER_W / 2 + pan.x
    const centerY = CONTAINER_H / 2 + pan.y
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation * Math.PI) / 180)

    const baseScale = Math.min(CONTAINER_W / imageObj.width, CONTAINER_H / imageObj.height) * 0.9
    const totalScale = baseScale * zoom
    ctx.scale(totalScale, totalScale)

    ctx.drawImage(
      imageObj,
      -imageObj.width / 2,
      -imageObj.height / 2,
      imageObj.width,
      imageObj.height
    )
    ctx.restore()

    try {
      exportCanvas.toBlob(
        (blob) => {
          if (!blob) return
          const cleanName = filename.replace(/\.[^/.]+$/, '') + '.webp'
          const editedFile = new File([blob], cleanName, { type: 'image/webp' })
          const previewUrl = URL.createObjectURL(blob)
          onSave(editedFile, previewUrl)
          onClose()
        },
        'image/webp',
        0.92
      )
    } catch (err) {
      console.error('Failed to export canvas as blob:', err)
      onClose()
    }
  }

  if (!isOpen || !imageSrc) return null

  return createPortal(
    <div className={`fixed inset-0 ${isCollapsed ? 'md:left-20' : 'md:left-64'} z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 transition-all`}>
      <div className="glass w-full max-w-4xl max-h-[94vh] rounded-2xl border border-[#241d18] flex flex-col shadow-2xl overflow-hidden bg-[#090807]/95 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#241d18] bg-[#14100d]/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#FB6C00]/10 text-[#FB6C00]">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Edit & Optimize Image</h2>
              <p className="text-xs text-stone-400">Drag handles to crop, scale, rotate, and adjust before upload</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white bg-[#1a1511] hover:bg-[#241d18] rounded-xl transition-colors border border-[#3b322a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Canvas & Overlay Viewport */}
          <div className="md:col-span-2 p-6 flex flex-col items-center justify-center bg-[#090807] border-b md:border-b-0 md:border-r border-[#241d18] select-none">
            {/* Viewport container with exact dimensions */}
            <div
              style={{ width: CONTAINER_W, height: CONTAINER_H }}
              onPointerDown={(e) => startDrag(e, 'pan_img')}
              className="relative rounded-xl overflow-hidden border border-[#241d18] shadow-inner bg-[#14100d] cursor-grab active:cursor-grabbing max-w-full"
            >
              {/* Underlying Image Canvas (Static during crop drag = 0 lag) */}
              <canvas
                ref={canvasRef}
                width={CONTAINER_W}
                height={CONTAINER_H}
                className="w-full h-full block pointer-events-none"
              />

              {/* Hardware-Accelerated Crop Frame Overlay */}
              <div
                style={{
                  left: `${crop.x}px`,
                  top: `${crop.y}px`,
                  width: `${crop.width}px`,
                  height: `${crop.height}px`,
                  boxShadow: '0 0 0 9999px rgba(9, 8, 7, 0.75)',
                  touchAction: 'none'
                }}
                onPointerDown={(e) => startDrag(e, 'move_crop')}
                className="absolute border-2 border-[#FB6C00] cursor-move select-none will-change-transform"
              >
                {/* Rule-of-Thirds Grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  <div className="border-r border-b border-[#FFDD9C]/25" />
                  <div className="border-r border-b border-[#FFDD9C]/25" />
                  <div className="border-b border-[#FFDD9C]/25" />
                  <div className="border-r border-b border-[#FFDD9C]/25" />
                  <div className="border-r border-b border-[#FFDD9C]/25" />
                  <div className="border-b border-[#FFDD9C]/25" />
                  <div className="border-r border-b border-[#FFDD9C]/25" />
                  <div className="border-r border-b border-[#FFDD9C]/25" />
                  <div />
                </div>

                {/* 4 Corner Handles */}
                <div
                  onPointerDown={(e) => startDrag(e, 'nw')}
                  className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-[#FB6C00] rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                />
                <div
                  onPointerDown={(e) => startDrag(e, 'ne')}
                  className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-[#FB6C00] rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                />
                <div
                  onPointerDown={(e) => startDrag(e, 'sw')}
                  className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-[#FB6C00] rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                />
                <div
                  onPointerDown={(e) => startDrag(e, 'se')}
                  className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-[#FB6C00] rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                />

                {/* Edge Handles for Freeform mode */}
                {aspectRatio === 'free' && (
                  <>
                    <div
                      onPointerDown={(e) => startDrag(e, 'n')}
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border border-[#FB6C00] rounded cursor-ns-resize shadow-sm"
                    />
                    <div
                      onPointerDown={(e) => startDrag(e, 's')}
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border border-[#FB6C00] rounded cursor-ns-resize shadow-sm"
                    />
                    <div
                      onPointerDown={(e) => startDrag(e, 'w')}
                      className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-8 bg-white border border-[#FB6C00] rounded cursor-ew-resize shadow-sm"
                    />
                    <div
                      onPointerDown={(e) => startDrag(e, 'e')}
                      className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-8 bg-white border border-[#FB6C00] rounded cursor-ew-resize shadow-sm"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB6C00] inline-block" /> Drag corners or edges to crop
              </span>
              <span className="flex items-center gap-1.5">
                <Move className="w-3 h-3 text-[#F9B637]" /> Drag inside to move frame
              </span>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="p-6 flex flex-col justify-between bg-[#14100d]/60 space-y-6">
            <div className="space-y-5">
              {/* Tabs */}
              <div className="flex rounded-xl bg-[#1a1511] p-1 border border-[#241d18]">
                <button
                  type="button"
                  onClick={() => setActiveTab('crop')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'crop' ? 'bg-[#FB6C00] text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
                >
                  <Crop className="w-3.5 h-3.5" /> Crop & Rotate
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('adjust')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'adjust' ? 'bg-[#FB6C00] text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
                >
                  <Sliders className="w-3.5 h-3.5" /> Adjustments
                </button>
              </div>

              {activeTab === 'crop' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Aspect Ratio Presets */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-stone-300">Aspect Ratio</label>
                      {aspectRatio === 'free' && (
                        <span className="text-[10px] text-[#F9B637] font-semibold bg-[#FB6C00]/10 px-2 py-0.5 rounded-md">
                          Freeform Active
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {['1:1', '16:9', '4:3', 'free'].map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => handleSelectRatio(ratio)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold uppercase border transition-all ${aspectRatio === ratio ? 'bg-[#FB6C00]/20 border-[#FB6C00] text-[#FFDD9C] shadow-[0_0_10px_rgba(251,108,0,0.3)]' : 'bg-[#1a1511] border-[#241d18] text-stone-400 hover:border-stone-600'}`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="image-zoom" className="text-xs font-medium text-stone-300 flex items-center gap-1.5 cursor-pointer">
                        <ZoomIn className="w-3.5 h-3.5 text-[#FB6C00]" /> Zoom / Scale
                      </label>
                      <span className="text-xs font-mono text-[#F9B637]">{Math.round(zoom * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ZoomOut className="w-4 h-4 text-stone-500" />
                      <input
                        id="image-zoom"
                        name="zoom"
                        aria-label="Zoom scale"
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-[#FB6C00] bg-[#1a1511] h-1.5 rounded-lg cursor-pointer"
                      />
                      <ZoomIn className="w-4 h-4 text-stone-500" />
                    </div>
                  </div>

                  {/* Rotation Controls */}
                  <div>
                    <span className="block text-xs font-semibold text-stone-300 mb-2">Rotate Image</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleRotate(-90)}
                        className="py-2 px-3 rounded-xl bg-[#1a1511] hover:bg-[#241d18] text-stone-300 hover:text-white border border-[#3b322a] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 text-[#FB6C00]" /> -90°
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRotate(90)}
                        className="py-2 px-3 rounded-xl bg-[#1a1511] hover:bg-[#241d18] text-stone-300 hover:text-white border border-[#3b322a] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <RotateCw className="w-4 h-4 text-[#FB6C00]" /> +90°
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'adjust' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Brightness */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="image-brightness" className="text-xs font-medium text-stone-300 cursor-pointer">Brightness</label>
                      <span className="text-xs font-mono text-[#F9B637]">{brightness}%</span>
                    </div>
                    <input
                      id="image-brightness"
                      name="brightness"
                      aria-label="Image brightness"
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full accent-[#FB6C00] bg-[#1a1511] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="image-contrast" className="text-xs font-medium text-stone-300 cursor-pointer">Contrast</label>
                      <span className="text-xs font-mono text-[#F9B637]">{contrast}%</span>
                    </div>
                    <input
                      id="image-contrast"
                      name="contrast"
                      aria-label="Image contrast"
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full accent-[#FB6C00] bg-[#1a1511] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="image-saturation" className="text-xs font-medium text-stone-300 cursor-pointer">Saturation</label>
                      <span className="text-xs font-mono text-[#F9B637]">{saturation}%</span>
                    </div>
                    <input
                      id="image-saturation"
                      name="saturation"
                      aria-label="Image saturation"
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="w-full accent-[#FB6C00] bg-[#1a1511] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-[#241d18]">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 px-3 rounded-xl bg-[#1a1511] hover:bg-[#241d18] text-stone-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#241d18] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Adjustments
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl text-stone-400 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] text-white text-xs font-bold shadow-[0_0_15px_rgba(231,63,30,0.35)] hover:brightness-110 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" /> Apply Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
