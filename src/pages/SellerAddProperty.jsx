import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Image, MapPin, Home, DollarSign, Info, Check, CheckCircle2 } from 'lucide-react'
import { amenityLabels } from '../data/cities'
import { useProperties } from '../context/PropertyContext'
import { useAuth } from '../context/AuthContext'
import { uploadPropertyMedia } from '../lib/supabase'
import './Dashboard.css'

export default function SellerAddProperty() {
  const navigate = useNavigate()
  const { addProperty } = useProperties()
  const { user } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')

  const [form, setForm] = useState({
    title: '',
    type: 'Apartment',
    listingType: 'buy',
    bhk: '3',
    baths: '2',
    sqft: '1400',
    description: '',
    price: '',
    city: 'Mumbai',
    locality: '',
    address: '',
    imageUrl: '',
    selectedAmenities: [],
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const publicUrl = await uploadPropertyMedia(file)
      setUploadedUrl(publicUrl)
      setForm(prev => ({ ...prev, imageUrl: publicUrl }))
    } catch (err) {
      console.error('File upload error:', err)
      alert('Failed to upload image to Supabase storage. ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAmenityToggle = (key) => {
    setForm(prev => {
      const exists = prev.selectedAmenities.includes(key)
      return {
        ...prev,
        selectedAmenities: exists
          ? prev.selectedAmenities.filter(a => a !== key)
          : [...prev.selectedAmenities, key]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const coverImage = form.imageUrl || uploadedUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'

    const newProperty = {
      title: form.title || 'Modern Apartment',
      price: Number(form.price) || 12500000,
      listingType: form.listingType === 'Rent' ? 'rent' : 'buy',
      type: form.type,
      bhk: Number(form.bhk),
      baths: Number(form.baths),
      sqft: Number(form.sqft),
      location: form.address || `${form.locality}, ${form.city}`,
      city: form.city,
      description: form.description,
      image: coverImage,
      amenities: form.selectedAmenities.length > 0 ? form.selectedAmenities : ['Parking', 'Security'],
      seller: {
        id: user?.id || 's1',
        name: user?.name || 'Owner',
        email: user?.email || '',
        phone: user?.phone || '',
      }
    }

    await addProperty(newProperty)
    setLoading(false)
    setSubmitted(true)
    setTimeout(() => navigate('/seller/dashboard'), 2000)
  }

  if (submitted) {
    return (
      <motion.div className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="container" style={{ textAlign: 'center', paddingTop: '10vh' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary-lighter)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-xl)' }}>
              <Check size={40} />
            </div>
          </motion.div>
          <h2>Property Listed Successfully!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-md)' }}>Your deal and files have been saved to your Supabase storage bucket (`property-deals`).</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="container">
        <div className="dash-header">
          <div>
            <h1>Add New Property Deal</h1>
            <p>Upload photos & details directly to your Supabase Storage Bucket</p>
          </div>
        </div>

        <form className="add-property-form" onSubmit={handleSubmit}>
          {/* Supabase Storage Upload Zone */}
          <div className="form-section">
            <h3><Image size={20} /> Property Photos (Saved in `property-deals` Storage Bucket)</h3>
            
            <div className="upload-zone" style={{ position: 'relative', cursor: 'pointer' }}>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <Upload size={36} color="var(--color-primary)" />
              <p style={{ fontWeight: 600, marginTop: 8, marginBottom: 4 }}>
                {uploading ? 'Uploading file to Supabase Storage Bucket...' : 'Click or Drag & Drop photo to upload to `property-deals` bucket'}
              </p>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>Supports JPG, PNG, WEBP, PDF (Max 50MB)</p>
            </div>

            {uploadedUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(138, 182, 65, 0.15)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={20} color="var(--color-primary)" />
                <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                  File stored in `property-deals` bucket: {uploadedUrl}
                </span>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Or paste Image URL directly</label>
              <input
                className="form-input"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9..."
              />
            </div>
          </div>

          {/* Basic Details */}
          <div className="form-section">
            <h3><Info size={20} /> Basic Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Property Title</label>
                <input
                  className="form-input"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Luxury 3BHK Apartment in Bandra"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select className="form-input" name="type" value={form.type} onChange={handleChange}>
                  <option>Apartment</option><option>Villa</option><option>House</option><option>Plot</option><option>Commercial</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Listing Type</label>
                <select className="form-input" name="listingType" value={form.listingType} onChange={handleChange}>
                  <option value="buy">Sell</option><option value="rent">Rent</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">BHK</label>
                <select className="form-input" name="bhk" value={form.bhk} onChange={handleChange}>
                  <option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option><option value="4">4 BHK</option><option value="5">5+ BHK</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <select className="form-input" name="baths" value={form.baths} onChange={handleChange}>
                  <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Area (sqft)</label>
                <input className="form-input" type="number" name="sqft" value={form.sqft} onChange={handleChange} placeholder="1500" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={4} name="description" value={form.description} onChange={handleChange} placeholder="Describe your property in detail..." />
            </div>
          </div>

          {/* Pricing */}
          <div className="form-section">
            <h3><DollarSign size={20} /> Pricing</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input className="form-input" type="number" name="price" value={form.price} onChange={handleChange} placeholder="15000000" required />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h3><MapPin size={20} /> Location</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">City</label>
                <select className="form-input" name="city" value={form.city} onChange={handleChange}>
                  <option>Mumbai</option><option>Bangalore</option><option>Delhi</option><option>Gurgaon</option><option>Pune</option><option>Hyderabad</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Locality</label>
                <input className="form-input" name="locality" value={form.locality} onChange={handleChange} placeholder="e.g., Koramangala" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
              <label className="form-label">Full Address</label>
              <input className="form-input" name="address" value={form.address} onChange={handleChange} placeholder="Enter full address" />
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h3><Home size={20} /> Amenities</h3>
            <div className="amenities-checkbox-grid">
              {Object.entries(amenityLabels).map(([key, val]) => (
                <label key={key} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={form.selectedAmenities.includes(key)}
                    onChange={() => handleAmenityToggle(key)}
                  />
                  {val.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading || uploading}>
              {loading ? 'Saving Deal to Supabase...' : 'Save Deal & Publish'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
