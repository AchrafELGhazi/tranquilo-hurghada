import React, { useEffect, useState } from 'react';
import {
    Users,
    Mail,
    Phone,
    Calendar,
    Shield,
    CheckCircle,
    XCircle,
    Eye,
    RefreshCw,
    Filter,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Search,
    AlertCircle,
} from 'lucide-react';
import userApi from '@/api/userApi';
import type { User } from '@/utils/types';

interface UserFilters {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    isActive?: boolean;
    role?: string;
    search?: string;
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userApi.getAllUsers();
            
            // Since we don't have pagination from API, we'll handle it client-side
            const allUsers = Array.isArray(response) ? response : [response];
            
            // Apply search filter
            let filteredUsers = allUsers;
            if (filters.search) {
                filteredUsers = allUsers.filter(user => 
                    user.fullName?.toLowerCase().includes(filters.search!.toLowerCase()) ||
                    user.email?.toLowerCase().includes(filters.search!.toLowerCase()) ||
                    user.phone?.toLowerCase().includes(filters.search!.toLowerCase())
                );
            }
            
            // Apply status filter
            if (filters.isActive !== undefined) {
                filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
            }
            
            // Apply role filter
            if (filters.role) {
                filteredUsers = filteredUsers.filter(user => user.role === filters.role);
            }
            
            // Sort users
            filteredUsers.sort((a, b) => {
                let aValue, bValue;
                switch (filters.sortBy) {
                    case 'fullName':
                        aValue = a.fullName || '';
                        bValue = b.fullName || '';
                        break;
                    case 'email':
                        aValue = a.email || '';
                        bValue = b.email || '';
                        break;
                    case 'createdAt':
                    default:
                        aValue = new Date(a.createdAt).getTime();
                        bValue = new Date(b.createdAt).getTime();
                        break;
                }
                
                if (filters.sortOrder === 'asc') {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            });
            
            // Calculate pagination
            const totalUsers = filteredUsers.length;
            setTotalPages(Math.ceil(totalUsers / filters.limit));
            
            // Get paginated users
            const startIndex = (filters.page - 1) * filters.limit;
            const paginatedUsers = filteredUsers.slice(startIndex, startIndex + filters.limit);
            
            setUsers(paginatedUsers);
            setCurrentPage(filters.page);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return 'N/A';
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (isActive: boolean) => {
        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    isActive
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                }`}
            >
                {isActive ? (
                    <CheckCircle className='w-3 h-3 mr-1' />
                ) : (
                    <XCircle className='w-3 h-3 mr-1' />
                )}
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    const getRoleBadge = (role: string) => {
        const roleConfig = {
            ADMIN: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Shield },
            USER: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Users },
            MODERATOR: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Shield },
        };

        const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                <Icon className='w-3 h-3 mr-1' />
                {role}
            </span>
        );
    };

    const handleFilterChange = (newFilters: Partial<UserFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleSearch = () => {
        handleFilterChange({ search: searchTerm });
    };

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div>
                            <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Admin Users</h1>
                            <p className='text-[#C75D2C]/70 mt-1'>Manage all registered users ({users.length} shown)</p>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <button
                                onClick={fetchUsers}
                                disabled={loading}
                                className='flex items-center space-x-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-4 py-2 rounded-xl font-medium hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 disabled:opacity-50'
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-4'>
                    <div className='flex flex-col space-y-4'>
                        {/* Search Bar */}
                        <div className='flex items-center space-x-2'>
                            <div className='relative flex-1 max-w-md'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Search className='h-4 w-4 text-[#D96F32]/60' />
                                </div>
                                <input
                                    type='text'
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                                    placeholder='Search users by name, email, or phone...'
                                    className='w-full pl-10 pr-3 py-2 border-2 border-[#F8B259]/50 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300 text-sm'
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className='px-4 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300'
                            >
                                Search
                            </button>
                        </div>

                        {/* Filter Buttons */}
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <div className='flex items-center space-x-2'>
                                <Filter className='w-4 h-4 text-[#D96F32]' />
                                <span className='text-sm font-medium text-[#C75D2C]'>Filter by status:</span>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {[
                                    { label: 'All', value: undefined },
                                    { label: 'Active', value: true },
                                    { label: 'Inactive', value: false },
                                ].map(status => (
                                    <button
                                        key={status.label}
                                        onClick={() => handleFilterChange({ isActive: status.value })}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                            filters.isActive === status.value
                                                ? 'bg-[#D96F32] text-white'
                                                : 'bg-white/50 text-[#C75D2C] hover:bg-white/70'
                                        }`}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <div className='flex items-center space-x-2'>
                                <span className='text-sm font-medium text-[#C75D2C]'>Filter by role:</span>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {[
                                    { label: 'All', value: undefined },
                                    { label: 'Admin', value: 'ADMIN' },
                                    { label: 'User', value: 'USER' },
                                    { label: 'Moderator', value: 'MODERATOR' },
                                ].map(role => (
                                    <button
                                        key={role.label}
                                        onClick={() => handleFilterChange({ role: role.value })}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                            filters.role === role.value
                                                ? 'bg-[#DEB887] text-[#8B4513]'
                                                : 'bg-white/50 text-[#C75D2C] hover:bg-white/70'
                                        }`}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </div>
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

                {/* Users Table */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl overflow-hidden'>
                    {loading ? (
                        <div className='p-8 text-center'>
                            <div className='w-8 h-8 border-2 border-[#D96F32]/30 border-t-[#D96F32] rounded-full animate-spin mx-auto mb-4'></div>
                            <p className='text-[#C75D2C]/70'>Loading users...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className='p-8 text-center'>
                            <Users className='w-12 h-12 text-[#D96F32]/50 mx-auto mb-4' />
                            <h3 className='text-lg font-semibold text-[#C75D2C] mb-2'>No users found</h3>
                            <p className='text-[#C75D2C]/70'>Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className='hidden lg:block overflow-x-auto'>
                                <table className='w-full'>
                                    <thead className='bg-gradient-to-r from-[#F8B259]/20 to-[#DEB887]/20 border-b-2 border-[#F8B259]/50'>
                                        <tr>
                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                User
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                Contact
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                Date of Birth
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                Status
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                Role
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                Joined
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-[#F8B259]/30'>
                                        {users.map(user => (
                                            <tr
                                                key={user.id}
                                                className='hover:bg-white/20 transition-colors duration-200'
                                            >
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center space-x-3'>
                                                        <div className='w-12 h-12 bg-gradient-to-br from-[#F8B259]/30 to-[#DEB887]/30 rounded-lg flex items-center justify-center'>
                                                            <span className='text-sm font-medium text-[#8B4513]'>
                                                                {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className='font-semibold text-[#C75D2C]'>
                                                                {user.fullName || 'N/A'}
                                                            </p>
                                                            <p className='text-xs text-[#C75D2C]/60'>
                                                                ID: {user.id.substring(0, 8)}...
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='text-sm space-y-1'>
                                                        <div className='flex items-center space-x-1'>
                                                            <Mail className='w-3 h-3 text-[#D96F32]' />
                                                            <span className='text-[#C75D2C]'>{user.email}</span>
                                                        </div>
                                                        <div className='flex items-center space-x-1'>
                                                            <Phone className='w-3 h-3 text-[#D96F32]' />
                                                            <span className='text-[#C75D2C]/60'>
                                                                {user.phone || 'No phone'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-[#C75D2C]'>
                                                    <div className='flex items-center space-x-1'>
                                                        <Calendar className='w-3 h-3 text-[#D96F32]' />
                                                        <span>{formatDate(user.dateOfBirth)}</span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    {getStatusBadge(user.isActive)}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    {getRoleBadge(user.role)}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-[#C75D2C]'>
                                                    {formatDateTime(user.createdAt)}
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center space-x-2'>
                                                        <button
                                                            onClick={() => setSelectedUser(user)}
                                                            className='p-2 bg-[#D96F32]/20 text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors duration-200'
                                                            title='View Details'
                                                        >
                                                            <Eye className='w-4 h-4' />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className='lg:hidden space-y-4 p-4'>
                                {users.map(user => (
                                    <div
                                        key={user.id}
                                        className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4 space-y-4'
                                    >
                                        <div className='flex justify-between items-start'>
                                            <div className='flex items-center space-x-3'>
                                                <div className='w-12 h-12 bg-gradient-to-br from-[#F8B259]/30 to-[#DEB887]/30 rounded-lg flex items-center justify-center'>
                                                    <span className='text-sm font-medium text-[#8B4513]'>
                                                        {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className='font-semibold text-[#C75D2C]'>
                                                        {user.fullName || 'N/A'}
                                                    </h3>
                                                    <p className='text-xs text-[#C75D2C]/60'>#{user.id.slice(-8)}</p>
                                                </div>
                                            </div>
                                            <div className='flex flex-col items-end space-y-2'>
                                                {getStatusBadge(user.isActive)}
                                                {getRoleBadge(user.role)}
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-1 gap-3 text-sm'>
                                            <div className='flex items-center space-x-2'>
                                                <Mail className='w-4 h-4 text-[#D96F32]' />
                                                <span className='text-[#C75D2C]'>{user.email}</span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <Phone className='w-4 h-4 text-[#D96F32]' />
                                                <span className='text-[#C75D2C]'>{user.phone || 'No phone'}</span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <Calendar className='w-4 h-4 text-[#D96F32]' />
                                                <span className='text-[#C75D2C]'>{formatDate(user.dateOfBirth)}</span>
                                            </div>
                                        </div>

                                        <div className='flex justify-between items-center pt-2 border-t border-[#F8B259]/30'>
                                            <div className='text-xs text-[#C75D2C]/60'>
                                                Joined: {formatDate(user.createdAt)}
                                            </div>
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className='p-2 bg-[#D96F32]/20 text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors duration-200'
                                            >
                                                <Eye className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className='px-6 py-4 border-t-2 border-[#F8B259]/50 bg-gradient-to-r from-[#F8B259]/10 to-[#DEB887]/10'>
                                    <div className='flex items-center justify-between'>
                                        <div className='text-sm text-[#C75D2C]/70'>
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                <ChevronLeft className='w-4 h-4' />
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                <ChevronRight className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>User Details</h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors'
                            >
                                <XCircle className='w-5 h-5 text-[#C75D2C]' />
                            </button>
                        </div>

                        <div className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#C75D2C] mb-3'>Account Timeline</h4>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Joined</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {formatDateTime(selectedUser.createdAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Last Updated</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {formatDateTime(selectedUser.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='bg-gradient-to-r from-[#DEB887]/20 to-[#F8B259]/20 border border-[#DEB887]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#8B4513] mb-3'>Admin Actions</h4>
                                    <div className='flex flex-wrap gap-2'>
                                        <button className='px-4 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-lg hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 text-sm'>
                                            Edit User
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                                                selectedUser.isActive
                                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            }`}
                                        >
                                            {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                                        </button>
                                        <button className='px-4 py-2 bg-gradient-to-r from-[#F8B259] to-[#DEB887] text-[#8B4513] rounded-lg hover:from-[#DEB887] hover:to-[#F8B259] transition-all duration-300 text-sm'>
                                            Reset Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;