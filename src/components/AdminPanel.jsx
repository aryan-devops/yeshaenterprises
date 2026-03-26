import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import LucideIcon from './LucideIcon'

const ADMIN_PASSWORD = 'yesha@2024'
const CATEGORIES_LIST = ['Pond Liners', 'Blowers', 'Tanks', 'Generators', 'Shade Nets', 'Other']

// ---------------------- Password Gate ----------------------
function LoginGate({ onLogin }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError('Invalid Access Key')
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.1), transparent 70%)', zIndex: 0 }} />

      <div
        className={`premium-card ${shake ? 'animate-shake' : ''}`}
        style={{
          padding: '60px 48px', width: '100%', maxWidth: 420, textAlign: 'left',
          background: 'var(--surface)', border: '1px solid var(--border)', zIndex: 1,
          borderRadius: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{
          width: 80, height: 80, borderRadius: 24, background: 'rgba(var(--primary-rgb), 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 32px 0',
          color: 'var(--primary)', boxShadow: 'var(--shadow)'
        }}>
          <LucideIcon name="ShieldLock" size={40} strokeWidth={1.5} />
        </div>

        <h1 style={{ fontSize: '1.75rem', marginBottom: 8, letterSpacing: '-0.02em' }}>Admin Control</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 40 }}>Yesha Enterprises Management System</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <LucideIcon name="KeyRound" size={18} />
            </div>
            <input
              type="password"
              placeholder="Access Key"
              value={pw}
              onChange={e => setPw(e.target.value)}
              style={{
                width: '100%', padding: '16px 16px 16px 48px', borderRadius: 100,
                background: 'var(--surface-hover)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: '1rem', transition: 'all 0.3s'
              }}
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>{error}</p>}

          <button type="submit" className="hero-btn" style={{
            background: 'var(--primary)', color: 'white', justifyContent: 'center', width: '100%', margin: 0,
            boxShadow: '0 10px 20px rgba(var(--primary-rgb), 0.2)'
          }}>
            Unlock Dashboard
            <LucideIcon name="ChevronRight" size={20} />
          </button>
        </form>
      </div>

      <style>{`
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  )
}

// ---------------------- Helper: Form Components ----------------------
const InputGroup = ({ label, icon, ...props }) => (
  <div style={{ width: '100%' }}>
    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      {icon && (
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <LucideIcon name={icon} size={16} />
        </div>
      )}
      <input
        {...props}
        style={{
          width: '100%', padding: `12px 14px 12px ${icon ? '40px' : '14px'}`, borderRadius: 100,
          border: '1px solid var(--border)', background: 'var(--surface)',
          color: 'var(--text-primary)', fontSize: '0.9rem', transition: 'all 0.2s',
          ...props.style
        }}
      />
    </div>
  </div>
)

// ---------------------- Common Utils ----------------------
async function uploadImage(file) {
  if (!file) return null
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('images').getPublicUrl(filePath)
  return data.publicUrl
}

// ---------------------- Section Components ----------------------

function ProductManager({ products, refreshData }) {
  const [modal, setModal] = useState(null)
  const [formData, setFormData] = useState({})
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (modal && modal !== 'add') {
      setFormData(modal)
    } else {
      setFormData({ 
        name: '', category: 'Other', price_range: '', stock_status: 'In Stock', specs: '', 
        description: '', image_url: '', image_url_2: '', image_url_3: '',
        material_grade: 'Industrial-Grade', distribution: 'Pan India', support: '24/7 Technical'
      })
    }
  }, [modal])

  const handleFileChange = async (e, field = 'image_url') => {
    const file = e.target.files[0]
    if (!file) return
    try {
      setUploading(field)
      const url = await uploadImage(file)
      setFormData({ ...formData, [field]: url })
    } catch (err) {
      console.error('Upload error:', err)
      alert(`Upload failed: ${err.message || "Unknown error"}.`);
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (modal === 'add' || (payload.id && !uuidRegex.test(payload.id))) {
        delete payload.id
      }
      
      const { error } = await supabase.from('products').upsert(payload)
      if (error) throw error

      await refreshData()
      setModal(null)
    } catch (err) {
      alert('Error saving product: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      await refreshData()
    } catch (err) {
      alert('Error deleting product: ' + err.message)
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Catalog Inventory</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your product listings and availability.</p>
        </div>
        <button onClick={() => setModal('add')} className="hero-btn" style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', fontSize: '0.9rem', margin: 0 }}>
          <LucideIcon name="Plus" size={18} />
          New Product
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
        {products.map(p => (
          <div key={p.id} className="premium-card" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 24, background: 'var(--surface-hover)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
              border: '1px solid var(--border)'
            }}>
              {p.image_url ? <img src={p.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <LucideIcon name="Package" color="var(--primary)" />}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem', marginBottom: 4 }}>{p.name}</h4>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 4 }}>{p.category?.toUpperCase() || 'OTHER'}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.price_range}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setModal(p)}
                title="Edit Product"
                style={{ 
                  width: 44, height: 44, borderRadius: 100, background: 'var(--surface-hover)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)',
                  border: '1px solid var(--border)', transition: '0.2s', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <LucideIcon name="Edit3" size={18} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                title="Delete Product"
                style={{ 
                  width: 44, height: 44, borderRadius: 100, background: 'rgba(239, 68, 68, 0.05)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)', transition: '0.2s', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <LucideIcon name="Trash2" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: 500, padding: 40, maxHeight: '90vh', overflowY: 'auto', borderRadius: 40 }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 32 }}>{modal === 'add' ? 'Create Product' : 'Edit Product'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 10 }}>
                {[
                  { label: 'Main Image', field: 'image_url' },
                  { label: 'Image 2', field: 'image_url_2' },
                  { label: 'Image 3', field: 'image_url_3' }
                ].map((imgInfo) => (
                  <div key={imgInfo.field} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '100%', aspectRatio: '1/1', borderRadius: 16, background: 'var(--surface-hover)', marginBottom: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border)'
                    }}>
                      {formData[imgInfo.field] ? (
                        <img src={formData[imgInfo.field]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <LucideIcon name="Camera" size={24} color="var(--text-muted)" />
                      )}
                    </div>
                    <label style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.75rem', display: 'block' }}>
                      {uploading === imgInfo.field ? '...' : formData[imgInfo.field] ? 'Change' : 'Upload'}
                      <input type="file" hidden accept="image/*" onChange={e => handleFileChange(e, imgInfo.field)} disabled={!!uploading} />
                    </label>
                    {formData[imgInfo.field] && (
                      <button type="button" onClick={() => setFormData({ ...formData, [imgInfo.field]: '' })} style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: 4 }}>Remove</button>
                    )}
                  </div>
                ))}
              </div>

              <InputGroup label="Product Name" icon="Type" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ width: '100%' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: 100, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                  >
                    {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <InputGroup label="Price Range" icon="IndianRupee" value={formData.price_range} onChange={e => setFormData({ ...formData, price_range: e.target.value })} />
              </div>
              <InputGroup label="Standard Specs" icon="Grid" value={formData.specs} onChange={e => setFormData({ ...formData, specs: e.target.value })} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <InputGroup label="Material Grade" icon="Layers" value={formData.material_grade} onChange={e => setFormData({ ...formData, material_grade: e.target.value })} />
                <InputGroup label="Distribution" icon="Map" value={formData.distribution} onChange={e => setFormData({ ...formData, distribution: e.target.value })} />
              </div>
              
              <InputGroup label="Support Type" icon="Headset" value={formData.support} onChange={e => setFormData({ ...formData, support: e.target.value })} />

              <div style={{ width: '100%' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: '16px', borderRadius: 24, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                />
              </div>
              <button type="submit" className="hero-btn" style={{ background: 'var(--primary)', color: 'white', width: '100%', padding: 18, margin: 0, boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.2)' }} disabled={uploading}>
                <LucideIcon name="Save" size={18} />
                Save Product Details
              </button>
              <button type="button" onClick={() => setModal(null)} style={{ padding: 18, borderRadius: 100, border: '1px solid var(--border)', color: 'var(--text-secondary)', width: '100%', fontWeight: 600, transition: '0.2s' }}>
                Discard Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function SliderManager({ slides, refreshData }) {
  const [modal, setModal] = useState(null)
  const [formData, setFormData] = useState({})
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (modal && modal !== 'add') {
      setFormData(modal)
    } else {
      setFormData({ headline: '', subtitle: '', description: '', icon: 'Activity', gradient: 'linear-gradient(135deg, rgba(10, 37, 64, 0.95), rgba(14, 116, 144, 0.8))', image_url: '', cta_primary: 'View Catalog', cta_secondary: 'Direct Inquiry', is_visible: true, display_order: 0 })
    }
  }, [modal])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadImage(file)
      setFormData({ ...formData, image_url: url })
    } catch (err) {
      console.error('Upload error:', err)
      alert(`Upload failed: ${err.message || 'Unknown error'}. \n\nCheck if you have added an "INSERT" policy for the "images" bucket in Supabase Storage.`)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (modal === 'add' || (payload.id && !uuidRegex.test(payload.id))) {
        delete payload.id
      }
      
      const { error } = await supabase.from('hero_slides').upsert(payload)
      if (error) throw error
      await refreshData()
      setModal(null)
    } catch (err) {
      alert('Error saving slide: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slide?')) return
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id)
      if (error) throw error
      await refreshData()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.5rem' }}>Hero Slider Configuration</h2>
        <button onClick={() => setModal('add')} className="hero-btn" style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', margin: 0 }}>Add New Slide</button>
      </div>
      <div style={{ display: 'grid', gap: 20 }}>
        {slides.map(s => (
          <div key={s.id} className="premium-card" style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'center', borderRadius: 24 }}>
            <div style={{
              width: 140, height: 80, borderRadius: 12, background: s.gradient || 'black',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'
            }}>
              {s.image_url && <img src={s.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />}
              <span style={{ position: 'relative', color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>SLIDE {s.display_order}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{s.headline}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.subtitle}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setModal(s)}
                title="Edit Slide"
                style={{
                  width: 44, height: 44, borderRadius: 100, background: 'var(--surface-hover)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)',
                  border: '1px solid var(--border)', transition: '0.2s', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <LucideIcon name="Edit" size={18} />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                title="Delete Slide"
                style={{
                  width: 44, height: 44, borderRadius: 100, background: 'rgba(239, 68, 68, 0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)', transition: '0.2s', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <LucideIcon name="Trash2" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: 550, padding: 40, maxHeight: '90vh', overflowY: 'auto', borderRadius: 32 }}>
            <h3>{modal === 'add' ? 'Create Hero Slide' : 'Edit Hero Slide'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 32 }}>
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <div style={{
                  width: '100%', height: 160, borderRadius: 20, background: formData.gradient || 'var(--surface-hover)', margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative'
                }}>
                  {formData.image_url && <img src={formData.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)', position: 'absolute', inset: 0 }} />}
                  <span style={{ position: 'relative', color: 'white', fontWeight: 800 }}>LIVE PREVIEW</span>
                </div>
                <label style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}>
                  {uploading ? 'Uploading...' : 'Upload Background Image'}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} disabled={uploading} />
                </label>
                {formData.image_url && (
                  <button type="button" onClick={() => setFormData({ ...formData, image_url: '' })} style={{ display: 'block', margin: '8px auto', color: '#ef4444' }}>Clear Background Image</button>
                )}
              </div>

              <InputGroup label="Headline" value={formData.headline} onChange={e => setFormData({ ...formData, headline: e.target.value })} />
              <InputGroup label="Subtitle" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />

              <div style={{ width: '100%' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Description (Paragraph Text)</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: '16px', borderRadius: 24, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ width: '100%' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Visibility</label>
                  <select
                    value={formData.is_visible}
                    onChange={e => setFormData({ ...formData, is_visible: e.target.value === 'true' })}
                    style={{ width: '100%', padding: '12px', borderRadius: 100, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
                <InputGroup label="Display Order" type="number" value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })} />
              </div>

              <div style={{ width: '100%' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Overlay CSS Gradient</label>
                <textarea value={formData.gradient} onChange={e => setFormData({ ...formData, gradient: e.target.value })} rows={2} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
              </div>

              <button type="submit" className="hero-btn" style={{ background: 'var(--primary)', color: 'white', width: '100%', padding: 18, margin: 0, boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.2)' }} disabled={uploading}>
                <LucideIcon name="Save" size={18} />
                Save Slide Changes
              </button>
              <button type="button" onClick={() => setModal(null)} style={{ padding: 18, borderRadius: 100, border: '1px solid var(--border)', color: 'var(--text-secondary)', width: '100%', fontWeight: 600, transition: '0.2s' }}>
                Discard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function TestimonialManager({ testimonials, refreshData }) {
  const [modal, setModal] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (modal && modal !== 'add') {
      setFormData(modal)
    } else {
      setFormData({ name: '', role: '', content: '', avatar_icon: 'User' })
    }
  }, [modal])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (modal === 'add' || (payload.id && !uuidRegex.test(payload.id))) {
        delete payload.id
      }
      
      const { error } = await supabase.from('testimonials').upsert(payload)
      if (error) throw error
      await refreshData()
      setModal(null)
    } catch (err) {
      alert('Error saving testimonial: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)
      if (error) throw error
      await refreshData()
    } catch (err) {
      alert('Error deleting: ' + err.message)
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.5rem' }}>Client Testimonials</h2>
        <button onClick={() => setModal('add')} className="hero-btn" style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', margin: 0 }}>Add New</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {testimonials.map(t => (
          <div key={t.id} className="premium-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700 }}>{t.name}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setModal(t)}
                  style={{ color: 'var(--text-secondary)', width: 32, height: 32, borderRadius: 100, background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}
                >
                  <LucideIcon name="Edit2" size={16} />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  style={{ color: '#ef4444', width: 32, height: 32, borderRadius: 100, background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.1)' }}
                >
                  <LucideIcon name="Trash2" size={16} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{t.content}"</p>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: 450, padding: 32, borderRadius: 32 }}>
            <h3>{modal === 'add' ? 'Add Review' : 'Edit Review'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
              <InputGroup label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <InputGroup label="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
              <div style={{ width: '100%' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Content</label>
                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={3} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }} />
              </div>
              <button type="submit" className="hero-btn" style={{ background: 'var(--primary)', color: 'white', width: '100%', padding: 16, margin: 0 }}>
                <LucideIcon name="Check" size={18} />
                Save Review
              </button>
              <button type="button" onClick={() => setModal(null)} style={{ width: '100%', color: 'var(--text-secondary)', fontWeight: 600 }}>Dismiss</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatsManager({ stats, refreshData }) {
  const [newStat, setNewStat] = useState('')
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newStat) return
    try {
      const updated = [...stats, newStat]
      const { error } = await supabase.from('site_settings').upsert({ key: 'stats_marquee', value: updated }, { onConflict: 'key' })
      if (error) throw error
      setNewStat('')
      await refreshData()
    } catch (err) {
      alert('Error updating stats: ' + err.message)
    }
  }

  const handleDelete = async (index) => {
    try {
      const updated = stats.filter((_, i) => i !== index)
      const { error } = await supabase.from('site_settings').upsert({ key: 'stats_marquee', value: updated }, { onConflict: 'key' })
      if (error) throw error
      await refreshData()
    } catch (err) {
      alert('Error deleting: ' + err.message)
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: 32 }}>Marketing Ticker</h2>
      <div className="premium-card" style={{ padding: 32 }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <InputGroup label="Add New Highlight" icon="TrendingUp" value={newStat} onChange={e => setNewStat(e.target.value)} />
          <button type="submit" className="hero-btn" style={{ background: 'var(--primary)', color: 'white', height: 48, marginTop: 24, margin: 0, padding: '0 24px' }}>
            <LucideIcon name="Plus" size={18} />
            Add To Ticker
          </button>
        </form>
        <div style={{ display: 'grid', gap: 12 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--surface-hover)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>{s}</span>
              <button
                onClick={() => handleDelete(i)}
                style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)', background: 'rgba(239, 68, 68, 0.05)', width: 32, height: 32, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <LucideIcon name="X" size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContactManager({ contact, refreshData }) {
  const [form, setForm] = useState(contact)
  useEffect(() => setForm(contact), [contact])

  const save = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('site_settings').upsert({ key: 'contact_info', value: form }, { onConflict: 'key' })
      if (error) throw error
      await refreshData()
      alert('Business configuration updated in Supabase')
    } catch (err) {
      alert('Error saving settings: ' + err.message)
    }
  }
  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: 32 }}>Business Configuration</h2>
      <form onSubmit={save} className="premium-card" style={{ padding: 40, maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <InputGroup label="Phone Number" icon="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <InputGroup label="Official Email" icon="Mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <InputGroup label="Raipur Address" icon="MapPin" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <InputGroup label="Instagram Link" icon="Instagram" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
        <InputGroup label="WhatsApp Logic (ID)" icon="MessageCircle" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
        <button type="submit" className="hero-btn" style={{ background: 'var(--primary)', color: 'white', width: '100%', padding: 20, margin: 0, boxShadow: '0 10px 20px rgba(var(--primary-rgb), 0.2)' }}>
          <LucideIcon name="Database" size={20} />
          Sync Business Profile
        </button>
      </form>
    </div>
  )
}

// ---------------------- Main Dashboard ----------------------

export default function AdminPanel(props) {
  const [active, setActive] = useState('products')

  if (!props.loggedIn) return <LoginGate onLogin={props.onLogin} />

  const menu = [
    { id: 'products', label: 'Inventory', icon: 'Package' },
    { id: 'slides', label: 'Hero Slides', icon: 'Layout' },
    { id: 'testimonials', label: 'Reviews', icon: 'MessageSquare' },
    { id: 'stats', label: 'Ticker', icon: 'BarChart' },
    { id: 'contact', label: 'Business Profile', icon: 'Settings' }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 280, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 8, position: 'sticky', top: 0, height: '100vh', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', marginBottom: 40 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <LucideIcon name="Layers" size={18} />
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>YESHA ADMIN</span>
        </div>

        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderRadius: 100, background: active === item.id ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
              color: active === item.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: active === item.id ? 700 : 500, transition: 'all 0.2s', textAlign: 'left'
            }}
          >
            <LucideIcon name={item.icon} size={20} />
            {item.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={props.toggleDarkMode} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', color: 'var(--text-secondary)' }}>
            <LucideIcon name={props.darkMode ? 'Sun' : 'Moon'} size={18} />
            {props.darkMode ? 'Light Theme' : 'Dark Theme'}
          </button>
          <button onClick={props.onLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', color: '#ef4444', fontWeight: 600 }}>
            <LucideIcon name="LogOut" size={18} />
            Termination
          </button>
          <button onClick={props.onClose} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600 }}>
            <LucideIcon name="ArrowLeft" size={18} />
            Return to Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '60px 80px', overflowY: 'auto', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {active === 'products' && <ProductManager {...props} />}
          {active === 'slides' && <SliderManager {...props} />}
          {active === 'testimonials' && <TestimonialManager {...props} />}
          {active === 'stats' && <StatsManager {...props} />}
          {active === 'contact' && <ContactManager {...props} />}
        </div>
      </main>
    </div>
  )
}
