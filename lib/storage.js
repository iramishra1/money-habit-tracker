const KEY = 'rm_purchases_v2'

export function loadPurchases() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function savePurchases(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    console.warn('localStorage unavailable')
  }
}

export function clearPurchases() {
  localStorage.removeItem(KEY)
}
