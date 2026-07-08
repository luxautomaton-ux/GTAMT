import { subscriptionConfig } from '../data/subscriptionConfig.js'

const MEMBER_KEY = 'gmt_workshop_member_active'
const PROFILE_KEY = 'gmt_workshop_member_profile'

export function loadMemberProfile() {
  try {
    const saved = window.localStorage.getItem(PROFILE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (_) {}
  return { active: false, tier: 'Preview', source: 'none' }
}

export function isWorkshopMember() {
  try {
    return window.localStorage.getItem(MEMBER_KEY) === 'true'
  } catch (_) {
    return false
  }
}

export function activateWorkshopMember(codeOrSource = '') {
  const raw = String(codeOrSource || '').trim()
  const isCheckoutReturn = raw === 'checkout-return'
  const isDemo = raw === subscriptionConfig.demoUnlockCode
  if (!isCheckoutReturn && !isDemo) return null
  const profile = {
    active: true,
    tier: 'Workshop',
    price: subscriptionConfig.priceLabel,
    source: isCheckoutReturn ? 'checkout-return-demo' : 'demo-code',
    activatedAt: new Date().toISOString(),
  }
  window.localStorage.setItem(MEMBER_KEY, 'true')
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  return profile
}

export function clearWorkshopAccess() {
  window.localStorage.removeItem(MEMBER_KEY)
  window.localStorage.removeItem(PROFILE_KEY)
}

export function buildDownloadUrl(file) {
  return `/downloads/${file}`
}

export function exportDownloadManifest(downloads) {
  const headers = ['title', 'category', 'file', 'promise']
  const rows = downloads.map((item) => headers.map((key) => `"${String(item[key] || '').replaceAll('"', '""')}"`).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'gta-money-team-workshop-download-manifest.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
