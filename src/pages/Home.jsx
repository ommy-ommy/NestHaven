import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Search, MapPin, Home, Building2, TreePine, Landmark, ArrowRight, Star, ChevronLeft, ChevronRight, Play, Shield, Handshake, TrendingUp, Quote } from 'lucide-react'
import { properties, formatPrice } from '../data/properties'
import { cities, testimonials } from '../data/cities'
import { useFavorites } from '../context/FavoriteContext'
import PropertyCard from '../components/property/PropertyCard'
import './Home.css'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } }
}

function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('buy')
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const navigate = useNavigate()
  const featuredProperties = properties.filter(p => p.featured).slice(0, 6)
  const carouselRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/properties?q=${searchQuery}&type=${activeTab}`)
  }

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 380, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const propertyTypes = [
    { icon: <Building2 size={28} />, label: 'Apartments', count: '2,340+' },
    { icon: <Home size={28} />, label: 'Villas', count: '890+' },
    { icon: <TreePine size={28} />, label: 'Plots', count: '1,560+' },
    { icon: <Landmark size={28} />, label: 'Commercial', count: '720+' },
  ]

  const steps = [
    { icon: <Search size={32} />, title: 'Search & Discover', desc: 'Browse thousands of verified properties with smart filters and AI-powered recommendations.' },
    { icon: <Handshake size={32} />, title: 'Connect & Visit', desc: 'Schedule meetings directly with property owners and take virtual tours from your couch.' },
    { icon: <Shield size={32} />, title: 'Close with Confidence', desc: 'Complete your purchase or rental with our secure, transparent documentation process.' },
  ]

  const stats = [
    { value: 15000, suffix: '+', label: 'Properties Listed' },
    { value: 8500, suffix: '+', label: 'Happy Customers' },
    { value: 25, suffix: '+', label: 'Cities Covered' },
    { value: 98, suffix: '%', label: 'Satisfaction Rate' },
  ]

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="hero-shape shape-1" />
          <div className="hero-shape shape-2" />
          <div className="hero-shape shape-3" />
        </div>
        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="section-label">
              <Home size={14} />
              India's #1 Real Estate Platform
            </span>
            <h1>
              Find Your <span className="text-gradient">Perfect</span> Home,{' '}
              <br />Your Way
            </h1>
            <p className="hero-subtitle">
              Discover thousands of verified properties across 25+ cities. 
              Buy, sell, or rent — all in one seamless experience.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="hero-search"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="search-tabs">
              {['buy', 'rent', 'sell'].map(tab => (
                <button
                  key={tab}
                  className={`search-tab ${activeTab === tab ? 'search-tab-active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <form className="search-bar" onSubmit={handleSearch}>
              <div className="search-input-group">
                <MapPin size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by city, locality, or project..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg search-btn">
                <Search size={20} />
                Search
              </button>
            </form>
            <div className="search-suggestions">
              <span className="suggestions-label">Popular:</span>
              {['Mumbai', 'Bangalore', 'Gurgaon', 'Pune'].map(city => (
                <Link key={city} to={`/properties?city=${city}`} className="suggestion-chip">
                  {city}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="hero-quick-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="quick-stat">
                <span className="quick-stat-value">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="quick-stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PROPERTY TYPES ===== */}
      <section className="section property-types-section">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <span className="section-label">Categories</span>
            <h2>Explore by Property Type</h2>
            <p>From cozy apartments to sprawling villas — find exactly what you're looking for.</p>
          </motion.div>
          <motion.div
            className="property-types-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {propertyTypes.map((type, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link to="/properties" className="property-type-card">
                  <div className="type-icon">{type.icon}</div>
                  <h4>{type.label}</h4>
                  <p>{type.count} properties</p>
                  <ArrowRight size={18} className="type-arrow" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED PROPERTIES ===== */}
      <section className="section featured-section">
        <div className="container-wide">
          <motion.div
            className="section-header-row"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div>
              <span className="section-label">Featured</span>
              <h2>Handpicked Properties</h2>
              <p>Curated selection of the finest properties on our platform.</p>
            </div>
            <div className="carousel-controls">
              <button className="carousel-btn" onClick={() => scrollCarousel(-1)} aria-label="Previous">
                <ChevronLeft size={20} />
              </button>
              <button className="carousel-btn" onClick={() => scrollCarousel(1)} aria-label="Next">
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          <div className="featured-carousel" ref={carouselRef}>
            {featuredProperties.map((property, i) => (
              <motion.div
                key={property.id}
                className="carousel-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>

          <div className="featured-cta">
            <Link to="/properties" className="btn btn-secondary btn-lg">
              View All Properties
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section how-it-works-section">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <span className="section-label">How It Works</span>
            <h2>Your Journey Starts Here</h2>
            <p>Three simple steps to find, visit, and secure your dream property.</p>
          </motion.div>
          <motion.div
            className="steps-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {steps.map((step, i) => (
              <motion.div key={i} className="step-card" variants={fadeUp}>
                <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== POPULAR CITIES ===== */}
      <section className="section cities-section">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <span className="section-label">
              <MapPin size={14} />
              Popular Cities
            </span>
            <h2>Explore Properties by City</h2>
            <p>Browse properties in India's most sought-after cities.</p>
          </motion.div>
          <motion.div
            className="cities-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {cities.map((city, i) => (
              <motion.div key={city.id} variants={fadeUp}>
                <Link to={`/properties?city=${city.name}`} className="city-card">
                  <div className="city-image">
                    <img src={city.image} alt={city.name} loading="lazy" />
                    <div className="city-overlay" />
                  </div>
                  <div className="city-info">
                    <h4>{city.name}</h4>
                    <p className="city-tagline">{city.tagline}</p>
                    <span className="city-count">{city.properties} properties</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-banner">
            <div className="stats-banner-content">
              <h2>Trusted by Thousands of <span className="text-gradient">Happy Homeowners</span></h2>
              <p>Join the growing community of buyers, sellers, and renters who chose NestHaven.</p>
            </div>
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-value">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section testimonials-section">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <span className="section-label">
              <Star size={14} />
              Testimonials
            </span>
            <h2>What Our Users Say</h2>
            <p>Real stories from real people who found their perfect home.</p>
          </motion.div>

          <div className="testimonials-carousel">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={`testimonial-card ${i === testimonialIdx ? 'testimonial-active' : ''}`}
              >
                <Quote size={32} className="quote-icon" />
                <p className="testimonial-text">{t.comment}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role} • {t.location}</p>
                  </div>
                  <div className="testimonial-stars">
                    {Array(t.rating).fill(0).map((_, j) => (
                      <Star key={j} size={14} fill="var(--color-accent)" color="var(--color-accent)" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testimonial-dot ${i === testimonialIdx ? 'dot-active' : ''}`}
                  onClick={() => setTestimonialIdx(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            className="cta-banner"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="cta-content">
              <h2>Ready to List Your Property?</h2>
              <p>Join thousands of sellers who trust NestHaven to find the right buyer. List your property in under 5 minutes.</p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link to="/properties" className="btn btn-secondary btn-lg">
                  Browse Properties
                </Link>
              </div>
            </div>
            <div className="cta-decoration">
              <div className="cta-circle cta-circle-1" />
              <div className="cta-circle cta-circle-2" />
              <div className="cta-circle cta-circle-3" />
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
