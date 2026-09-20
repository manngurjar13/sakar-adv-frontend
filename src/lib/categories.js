import { getEventCategoryLabel, getEventColorClass, normalizeEventCategory } from './eventCategories'

export const CATEGORY_ENTITY_TYPES = [
  { value: 'product', label: 'Product' },
  { value: 'service', label: 'Service' },
  { value: 'advertising', label: 'Advertising' },
  { value: 'event', label: 'Event' },
]

export const CATEGORY_TABLE_BY_TYPE = {
  product: 'products',
  service: 'services',
  advertising: 'advertising',
  event: 'events',
}

export const EVENT_COLOR_OPTIONS = [
  { value: 'from-blue-500 to-blue-600', label: 'Blue' },
  { value: 'from-orange-500 to-orange-600', label: 'Orange' },
  { value: 'from-purple-500 to-purple-600', label: 'Purple' },
  { value: 'from-pink-500 to-pink-600', label: 'Pink' },
  { value: 'from-indigo-500 to-indigo-600', label: 'Indigo' },
  { value: 'from-green-500 to-green-600', label: 'Green' },
  { value: 'from-red-500 to-red-600', label: 'Red' },
  { value: 'from-yellow-500 to-yellow-600', label: 'Yellow' },
  { value: 'from-cyan-500 to-cyan-600', label: 'Cyan' },
  { value: 'from-emerald-500 to-emerald-600', label: 'Emerald' },
  { value: 'from-sky-500 to-sky-600', label: 'Sky' },
  { value: 'from-fuchsia-500 to-fuchsia-600', label: 'Fuchsia' },
  { value: 'from-violet-500 to-violet-600', label: 'Violet' },
  { value: 'from-slate-500 to-slate-600', label: 'Slate' },
]

export const DEFAULT_EVENT_COLOR = 'from-blue-500 to-blue-600'

export const slugifyCategory = (value, entityType = 'product') => {
  const raw = String(value || '').trim()
  if (!raw) return ''

  if (entityType === 'event') {
    const normalized = String(raw)
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return normalized
  }

  return raw
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export const getEntityTypeLabel = (entityType) =>
  CATEGORY_ENTITY_TYPES.find((item) => item.value === entityType)?.label || entityType

export const selectByType = (categories = [], entityType) =>
  (categories || [])
    .filter((category) => category.entity_type === entityType)
    .slice()
    .sort((a, b) => {
      const orderDiff = (a.sort_order || 0) - (b.sort_order || 0)
      if (orderDiff !== 0) return orderDiff
      return String(a.name || '').localeCompare(String(b.name || ''))
    })

const matchesSlug = (category, entityType, slug) => {
  if (!category || category.entity_type !== entityType) return false
  if (entityType === 'event') {
    return normalizeEventCategory(category.slug) === normalizeEventCategory(slug)
  }
  return String(category.slug || '') === String(slug || '')
}

export const findCategory = (categories = [], entityType, slug) =>
  (categories || []).find((category) => matchesSlug(category, entityType, slug))

export const getCategoryLabel = (categories = [], entityType, slug, fallback = '') => {
  if (!slug) return fallback
  const match = findCategory(categories, entityType, slug)
  if (match?.name) return match.name
  if (entityType === 'event') return getEventCategoryLabel(slug)
  return fallback || slug
}

export const getCategoryColor = (categories = [], entityType, slug) => {
  const match = findCategory(categories, entityType, slug)
  if (match?.color_class) return match.color_class
  if (entityType === 'event') return getEventColorClass(slug)
  return DEFAULT_EVENT_COLOR
}

export const getCategorySelectOptions = (categories = [], entityType, currentSlug = '') => {
  const options = selectByType(categories, entityType).filter((category) => category.is_active !== false)
  if (currentSlug && !options.some((category) => matchesSlug(category, entityType, currentSlug))) {
    const existing = findCategory(categories, entityType, currentSlug)
    options.unshift(
      existing || {
        id: `legacy-${currentSlug}`,
        entity_type: entityType,
        slug: currentSlug,
        name: getCategoryLabel(categories, entityType, currentSlug, currentSlug),
        is_active: false,
      }
    )
  }
  return options
}
