import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, X, ArrowRight, Trash2, AlertCircle } from 'lucide-react'
import { useCompare } from '../../context/CompareContext'
import { formatPrice } from '../../data/properties'
import './CompareFloatingBar.css'

export default function CompareFloatingBar() {
  const {
    comparedProperties,
    comparedCount,
    removeFromCompare,
    clearCompare,
    limitWarning,
  } = useCompare()
  const location = useLocation()

  // Hide floating bar if on compare page itself or 0 properties selected
  if (location.pathname === '/compare' || comparedCount === 0) {
    return (
      <AnimatePresence>
        {limitWarning && (
          <motion.div
            className="compare-limit-toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <AlertCircle size={20} />
            <span>Maximum 4 properties can be selected for comparison.</span>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <>
      {/* Toast Alert when trying to select 5th property */}
      <AnimatePresence>
        {limitWarning && (
          <motion.div
            className="compare-limit-toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <AlertCircle size={20} />
            <span>Maximum 4 properties can be selected for comparison.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Comparison Drawer */}
      <AnimatePresence>
        <motion.div
          className="compare-floating-bar"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="compare-bar-inner container">
            <div className="compare-bar-info">
              <div className="compare-bar-icon">
                <GitCompare size={20} />
              </div>
              <div>
                <h4 className="compare-bar-title">Property Comparison</h4>
                <p className="compare-bar-count">{comparedCount} of 4 properties selected</p>
              </div>
            </div>

            {/* Selected Property Thumbnails */}
            <div className="compare-thumbnails-list">
              {comparedProperties.map(property => (
                <div key={property.id} className="compare-thumb-item">
                  <img
                    src={property.image || property.images?.[0]}
                    alt={property.title}
                  />
                  <div className="thumb-info">
                    <span className="thumb-title">{property.title}</span>
                    <span className="thumb-price">{formatPrice(property.price, property.listingType)}</span>
                  </div>
                  <button
                    className="thumb-remove-btn"
                    onClick={() => removeFromCompare(property.id)}
                    title="Remove from comparison"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Empty placeholder slots up to 4 */}
              {Array(4 - comparedCount)
                .fill(0)
                .map((_, i) => (
                  <div key={`slot-${i}`} className="compare-thumb-placeholder">
                    <span>+ Add Property</span>
                  </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="compare-bar-actions">
              <button className="btn btn-ghost btn-sm clear-btn" onClick={clearCompare}>
                <Trash2 size={14} />
                Clear
              </button>
              <Link to="/compare" className="btn btn-primary btn-sm compare-now-btn">
                <span>Compare Now</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
