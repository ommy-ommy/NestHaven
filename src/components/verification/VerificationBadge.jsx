import { ShieldCheck, UserCheck, Landmark, Building2, Crown, FileCheck, CheckCircle2 } from 'lucide-react'
import { VERIFICATION_BADGES } from '../../context/VerificationContext'
import './VerificationBadge.css'

const iconMap = {
  ShieldCheck: ShieldCheck,
  UserCheck: UserCheck,
  Landmark: Landmark,
  Building2: Building2,
  Crown: Crown,
  FileCheck: FileCheck,
}

export default function VerificationBadge({ badge, size = 'md', showLabel = true }) {
  if (!badge) return null

  const IconComp = iconMap[badge.icon] || ShieldCheck

  return (
    <span
      className={`verification-badge-pill badge-size-${size}`}
      style={{
        backgroundColor: badge.bg,
        color: badge.color,
        borderColor: badge.border,
      }}
      title={`${badge.label} - Identity & Deed Verified by NestHaven`}
    >
      <IconComp size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
      {showLabel && <span>{badge.label}</span>}
    </span>
  )
}

export function PropertyVerificationBar({ badges, size = 'sm' }) {
  if (!badges || badges.length === 0) return null

  return (
    <div className="property-verification-bar">
      {badges.map(b => (
        <VerificationBadge key={b.id} badge={b} size={size} />
      ))}
    </div>
  )
}

export function PrimaryBlueVerificationBadge({ text = 'Verified' }) {
  return (
    <span className="blue-verified-tag">
      <CheckCircle2 size={13} fill="#2563EB" color="#FFFFFF" />
      <span>{text}</span>
    </span>
  )
}
