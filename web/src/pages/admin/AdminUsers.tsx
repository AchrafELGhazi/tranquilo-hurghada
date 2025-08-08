import userApi from '@/api/userApi';
import { useEffect, useState } from 'react';
import type { User } from '@/utils/types';

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setLoading(true);
                const response = await userApi.getAllUsers();
                setUsers(Array.isArray(response) ? response : [response]);
                setError(null);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, []);

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

    if (loading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='text-lg'>Loading users...</div>
            </div>
        );
    }

    if (error) {
        return <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-red-700'>{error}</div>;
    }

    return (
        <div className=''>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>Admin Users</h1>
                <p className='text-gray-600 mt-1'>Manage all registered users</p>
            </div>

            <div className='bg-white shadow-sm rounded-lg border border-gray-200'>
                <div className='px-6 py-4 border-b border-gray-200'>
                    <h2 className='text-lg font-medium text-gray-900'>All Users ({users.length})</h2>
                </div>

                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    User
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Contact
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Date of Birth
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Joined
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Last Updated
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {users.map(user => (
                                <tr key={user.id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center'>
                                            <div className='flex-shrink-0 h-10 w-10'>
                                                <div className='h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center'>
                                                    <span className='text-sm font-medium text-white'>
                                                        {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm font-medium text-gray-900'>
                                                    {user.fullName || 'N/A'}
                                                </div>
                                                <div className='text-sm text-gray-500'>
                                                    ID: {user.id.substring(0, 8)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-900'>{user.email}</div>
                                        <div className='text-sm text-gray-500'>{user.phone || 'No phone'}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                        {formatDate(user.dateOfBirth)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                        {formatDateTime(user.createdAt)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                        {formatDateTime(user.updatedAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className='text-center py-12'>
                        <div className='text-gray-500'>No users found</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
