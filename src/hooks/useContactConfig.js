import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchContactConfig } from '../store/slices/contactConfigSlice'

export const useContactConfig = () => {
  const dispatch = useDispatch()
  const { config, loading, error } = useSelector(state => state.contactConfig)

  useEffect(() => {
    if (!config || !config.id) {
      dispatch(fetchContactConfig())
    }
  }, [dispatch, config])

  return {
    config,
    loading,
    error,
    // Helper functions to get specific data
    getActiveEmails: () => config?.emails?.filter(email => email.isActive) || [],
    getActivePhoneNumbers: () => config?.phoneNumbers?.filter(phone => phone.isActive) || [],
    getDirectCallNumbers: () => config?.phoneNumbers?.filter(phone => phone.isActive && phone.isDirectCall) || [],
    getActiveWhatsAppNumbers: () => config?.whatsappNumbers?.filter(whatsapp => whatsapp.isActive) || [],
    getActiveSocialMedia: () => config?.socialMedia?.filter(social => social.isActive) || [],
    getFullAddress: () => {
      if (!config?.address) return ''
      const { street, area, city, state, pincode } = config.address
      return `${street}, ${area}, ${city}, ${state} ${pincode}`
    },
    getPrimaryEmail: () => config?.emails?.find(email => email.type === 'Primary' && email.isActive)?.email || '',
    getPrimaryPhone: () => config?.phoneNumbers?.find(phone => phone.type === 'Primary' && phone.isActive)?.number || '',
    getBusinessWhatsApp: () => config?.whatsappNumbers?.find(whatsapp => whatsapp.type === 'Business' && whatsapp.isActive)?.number || ''
  }
}
