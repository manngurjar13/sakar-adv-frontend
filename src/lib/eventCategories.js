export const EVENT_CATEGORY_OPTIONS = [
  { value: 'corporate', label: 'Corporate Events' },
  { value: 'social', label: 'Social Events' },
  { value: 'birthday', label: 'Birthday Decor' },
  { value: 'wedding', label: 'Wedding Decor' },
  { value: 'office', label: 'Office Decor' },
  { value: 'atl', label: 'ATL Activities' },
  { value: 'btl', label: 'BTL Activities' },
  { value: 'lunch', label: 'Lunch Event' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'festival', label: 'Festival' },
  { value: 'cultural', label: 'Cultural Event' },
  { value: 'normal', label: 'Normal Event' },
]

const CATEGORY_LABEL_LOOKUP = EVENT_CATEGORY_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

export const normalizeEventCategory = (value) => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const aliasMap = {
    'corporate-event': 'corporate',
    'corporate-events': 'corporate',
    'social-event': 'social',
    'social-events': 'social',
    'birthday-event': 'birthday',
    'birthday-events': 'birthday',
    'birthday-decor': 'birthday',
    'wedding-event': 'wedding',
    'wedding-events': 'wedding',
    'wedding-decor': 'wedding',
    'office-event': 'office',
    'office-events': 'office',
    'office-decor': 'office',
    'atl-activity': 'atl',
    'atl-activities': 'atl',
    'btl-activity': 'btl',
    'btl-activities': 'btl',
    'lunch-events': 'lunch',
    'lunch-event': 'lunch',
    'normal-event': 'normal',
  }

  return aliasMap[normalized] || normalized || 'normal'
}

export const getEventCategoryLabel = (value) => {
  const normalized = normalizeEventCategory(value)
  return CATEGORY_LABEL_LOOKUP[normalized] || 'Other Events'
}

export const getEventColorClass = (value) => {
  const normalized = normalizeEventCategory(value)
  const colorMap = {
    corporate: 'from-blue-500 to-blue-600',
    social: 'from-orange-500 to-orange-600',
    birthday: 'from-purple-500 to-purple-600',
    wedding: 'from-pink-500 to-pink-600',
    office: 'from-indigo-500 to-indigo-600',
    atl: 'from-green-500 to-green-600',
    btl: 'from-red-500 to-red-600',
    lunch: 'from-yellow-500 to-yellow-600',
    conference: 'from-cyan-500 to-cyan-600',
    workshop: 'from-emerald-500 to-emerald-600',
    seminar: 'from-sky-500 to-sky-600',
    festival: 'from-fuchsia-500 to-fuchsia-600',
    cultural: 'from-violet-500 to-violet-600',
    normal: 'from-slate-500 to-slate-600',
  }

  return colorMap[normalized] || 'from-blue-500 to-blue-600'
}

export const slugifyEventTitle = (value) =>
  String(value || 'event')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
