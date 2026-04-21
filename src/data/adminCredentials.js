// Default admin credentials
// In a real application, these would be stored securely in a database
// and passwords would be hashed using bcrypt or similar

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@sakaradv.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'administrator'
}

// Mock admin data for development
export const MOCK_ADMIN_DATA = {
  id: 1,
  name: 'Admin User',
  email: 'admin@sakaradv.com',
  role: 'administrator',
  avatar: null,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
}
