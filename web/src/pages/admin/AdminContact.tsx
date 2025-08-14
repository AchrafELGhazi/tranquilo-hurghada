import React, { useState, useEffect } from 'react';
import { Eye, Mail, X, Calendar, User, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';
import { THToast, THToaster } from '@/components/common/Toast';
import contactApi from '@/api/contactApi';
import type { Contact } from '@/utils/types';

const AdminContact: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchContacts = async (page: number = 1) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await contactApi.getAllContacts({
                page,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            });
            setContacts(response.data);
            setCurrentPage(response.pagination.page);
            setTotalPages(response.pagination.pages);
            setTotal(response.pagination.total);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch contacts');
            THToast.error('Error', 'Failed to fetch contacts');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await contactApi.getUnreadCount();
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const handleViewContact = async (contactId: string) => {
        try {
            const response = await contactApi.getContactById(contactId);
            setSelectedContact(response.data);
            setIsModalOpen(true);

            if (!response.data.isRead) {
                await contactApi.updateContact(contactId, { isRead: true });
                fetchContacts(currentPage);
                fetchUnreadCount();
            }
        } catch (error) {
            THToast.error('Error', 'Failed to fetch contact details');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedContact(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    useEffect(() => {
        fetchContacts();
        fetchUnreadCount();
    }, []);

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div>
                            <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Contact Messages</h1>
                            <p className='text-[#C75D2C]/70 mt-1'>Manage customer inquiries</p>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-[#D96F32]/20 text-[#D96F32] px-3 py-1 rounded-full text-sm font-medium border border-[#D96F32]/30'>
                                    Total: {total}
                                </div>
                                {unreadCount > 0 && (
                                    <div className='bg-red-100/80 text-red-800 px-3 py-1 rounded-full text-sm font-medium border border-red-200/60'>
                                        Unread: {unreadCount}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fetchContacts(currentPage)}
                                disabled={isLoading}
                                className='flex items-center space-x-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-4 py-2 rounded-xl font-medium hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200/60 rounded-xl p-4 flex items-start space-x-3'>
                        <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
                        <div>
                            <p className='text-red-800 font-semibold'>Error</p>
                            <p className='text-red-700 text-sm mt-1'>{error}</p>
                        </div>
                    </div>
                )}

                {/* Contact Cards */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    {isLoading ? (
                        <div className='text-center py-12'>
                            <div className='w-8 h-8 border-2 border-[#D96F32]/30 border-t-[#D96F32] rounded-full animate-spin mx-auto mb-4'></div>
                            <p className='text-[#C75D2C]/70'>Loading contacts...</p>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className='text-center py-12'>
                            <MessageSquare className='w-12 h-12 text-[#D96F32]/50 mx-auto mb-4' />
                            <h3 className='text-lg font-semibold text-[#C75D2C] mb-2'>No contact messages</h3>
                            <p className='text-[#C75D2C]/70'>No messages have been received yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {contacts.map(contact => (
                                    <div
                                        key={contact.id}
                                        className={`bg-white/60 backdrop-blur-sm border-2 rounded-2xl overflow-hidden hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl ${
                                            !contact.isRead
                                                ? 'border-red-300/70 bg-red-50/40 hover:border-red-400/70'
                                                : 'border-[#F8B259]/50 hover:border-[#D96F32]/70'
                                        }`}
                                    >
                                        {/* Header */}
                                        <div className='p-4 pb-0'>
                                            <div className='flex items-center justify-between mb-3'>
                                                <div className='flex items-center'>
                                                    <User className='w-4 h-4 text-[#D96F32] mr-2' />
                                                    <span className='font-semibold text-[#C75D2C] truncate'>
                                                        {contact.name}
                                                    </span>
                                                </div>
                                                <div className='flex items-center'>
                                                    {!contact.isRead ? (
                                                        <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                                                    ) : (
                                                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='flex items-center text-[#C75D2C]/70 text-sm mb-3'>
                                                <Mail className='w-4 h-4 mr-1 text-[#D96F32]' />
                                                <span className='truncate'>{contact.email}</span>
                                            </div>

                                            <div className='flex items-center text-[#C75D2C]/70 text-sm mb-3'>
                                                <Calendar className='w-4 h-4 mr-1 text-[#D96F32]' />
                                                <span>{formatDate(contact.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Message Preview */}
                                        <div className='px-4 pb-4'>
                                            <div className='bg-white/40 rounded-lg p-3 mb-4'>
                                                <p className='text-[#C75D2C]/80 text-sm line-clamp-3'>
                                                    {contact.message}
                                                </p>
                                            </div>

                                            {/* Status Badge */}
                                            <div className='flex items-center justify-between mb-4'>
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                                                        contact.isRead
                                                            ? 'bg-green-100/80 text-green-800 border-green-200/60'
                                                            : 'bg-red-100/80 text-red-800 border-red-200/60'
                                                    }`}
                                                >
                                                    {contact.isRead ? 'Read' : 'Unread'}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => handleViewContact(contact.id)}
                                                className='w-full inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 text-sm font-medium cursor-pointer'
                                            >
                                                <Eye className='w-4 h-4 mr-1' />
                                                View Message
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className='mt-6 bg-white/60 backdrop-blur-sm border border-[#F8B259]/50 rounded-xl p-4'>
                                    <div className='flex items-center justify-between'>
                                        <div className='text-sm text-[#C75D2C]/70'>
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => fetchContacts(currentPage - 1)}
                                                disabled={currentPage === 1 || isLoading}
                                                className='px-4 py-2 text-sm border border-[#F8B259]/50 rounded-xl bg-white/60 text-[#C75D2C] hover:bg-white/80 transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => fetchContacts(currentPage + 1)}
                                                disabled={currentPage === totalPages || isLoading}
                                                className='px-4 py-2 text-sm border border-[#F8B259]/50 rounded-xl bg-white/60 text-[#C75D2C] hover:bg-white/80 transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedContact && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
                    <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 pb-4 border-b border-[#F8B259]/30'>
                            <h2 className='text-xl font-bold text-[#C75D2C] font-butler'>Contact Message</h2>
                            <button
                                onClick={closeModal}
                                className='text-[#C75D2C]/60 hover:text-[#C75D2C] transition-colors duration-200 cursor-pointer'
                            >
                                <X className='w-6 h-6' />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className='flex-1 overflow-y-auto p-6 pt-4'>
                            <div className='space-y-4'>
                                <div className='bg-white/60 backdrop-blur-sm border border-[#F8B259]/50 rounded-xl p-4'>
                                    <label className='block text-sm font-medium text-[#C75D2C]/70 mb-1'>Name</label>
                                    <p className='text-[#C75D2C] font-medium'>{selectedContact.name}</p>
                                </div>

                                <div className='bg-white/60 backdrop-blur-sm border border-[#F8B259]/50 rounded-xl p-4'>
                                    <label className='block text-sm font-medium text-[#C75D2C]/70 mb-1'>Email</label>
                                    <p className='text-[#C75D2C] font-medium'>{selectedContact.email}</p>
                                </div>

                                <div className='bg-white/60 backdrop-blur-sm border border-[#F8B259]/50 rounded-xl p-4'>
                                    <label className='block text-sm font-medium text-[#C75D2C]/70 mb-1'>Date</label>
                                    <p className='text-[#C75D2C]/80'>{formatDate(selectedContact.createdAt)}</p>
                                </div>

                                <div className='bg-white/60 backdrop-blur-sm border border-[#F8B259]/50 rounded-xl p-4'>
                                    <label className='block text-sm font-medium text-[#C75D2C]/70 mb-2'>Message</label>
                                    <div className='bg-white/40 rounded-lg '>
                                        <p className='text-[#C75D2C] whitespace-pre-wrap leading-relaxed'>
                                            {selectedContact.message}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center justify-between bg-white/60 backdrop-blur-sm border border-[#F8B259]/50 rounded-xl p-4'>
                                    <span className='text-sm font-medium text-[#C75D2C]/70'>Status:</span>
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full border ${
                                            selectedContact.isRead
                                                ? 'bg-green-100/80 text-green-800 border-green-200/60'
                                                : 'bg-red-100/80 text-red-800 border-red-200/60'
                                        }`}
                                    >
                                        {selectedContact.isRead ? 'Read' : 'Unread'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='p-6 pt-4 border-t border-[#F8B259]/30'>
                            <div className='flex justify-end'>
                                <button
                                    onClick={closeModal}
                                    className='px-6 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 font-medium cursor-pointer'
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <THToaster position='bottom-right' />
        </div>
    );
};

export default AdminContact;
