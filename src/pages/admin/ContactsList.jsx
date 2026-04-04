import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { fetchContacts } from '../../store/slices/contactsSlice'

const ContactsList = () => {
  const dispatch = useDispatch()
  const { contacts, loading } = useSelector((state) => state.contacts)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    dispatch(fetchContacts())
  }, [dispatch])

  const handleViewContact = (contact) => {
    setSelectedContact(contact)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedContact(null)
  }


  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Contact Inquiries
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage customer inquiries and messages
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Messages ({filteredContacts.length})
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredContacts.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">
              No contact messages found.
            </li>
          ) : (
            filteredContacts.map((contact) => (
              <li key={contact.id}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100">
                        <span className="text-sm font-medium text-gray-600">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {contact.email}
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {contact.subject}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(contact.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleViewContact(contact)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Contact Details Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Contact Inquiry Details
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedContact.name}</p>
                        <p className="text-xs text-gray-500">Full Name</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedContact.email}</p>
                        <p className="text-xs text-gray-500">Email Address</p>
                      </div>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedContact.phone}</p>
                          <p className="text-xs text-gray-500">Phone Number</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedContact.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">Submitted Date</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Subject</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">
                    {selectedContact.subject}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
                  <div className="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>

                {/* Additional Fields */}
                {selectedContact.company && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Company</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">
                      {selectedContact.company}
                    </p>
                  </div>
                )}

                {selectedContact.budget && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Budget Range</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">
                      {selectedContact.budget}
                    </p>
                  </div>
                )}

                {selectedContact.services && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Services Interested In</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">
                      {selectedContact.services}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactsList
