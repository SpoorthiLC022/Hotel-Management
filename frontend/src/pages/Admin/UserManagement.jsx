import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, updateUser, deleteUser } from '../../redux/slices/userSlice';
import {
    Users,
    UserPlus,
    Shield,
    Mail,
    MoreVertical,
    Trash2,
    Edit,
    Search,
    UserCheck,
    UserX
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.users);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleStatus = async (id) => {
        const user = users.find(u => u._id === id);
        if (!user) return;

        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';

        try {
            await dispatch(updateUser({
                id,
                userData: { status: newStatus }
            })).unwrap();
            toast.success(`User ${user.name} is now ${newStatus}`);
        } catch (error) {
            toast.error(error || 'Failed to update user status');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Permanent account deletion? This cannot be undone.')) {
            try {
                await dispatch(deleteUser(id)).unwrap();
                toast.success('User deleted successfully');
            } catch (error) {
                toast.error(error || 'Failed to delete user');
            }
        }
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">Manage application users, roles and permissions.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold font-display transition-all shadow-lg shadow-primary-500/20">
                    <UserPlus className="w-5 h-5" />
                    Invite Team Member
                </button>
            </div>

            <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-100 bg-slate-50/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select className="px-4 py-2.5 border border-slate-100 bg-slate-50/50 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-500">
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>Staff</option>
                        <option>Guest</option>
                    </select>
                </div>
            </div>

            <div className="glass rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium capitalize">
                                                <Shield className={`w-4 h-4 ${user.role === 'admin' ? 'text-rose-500' : user.role === 'staff' ? 'text-amber-500' : 'text-slate-400'}`} />
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${(user.status || 'Active') === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                {user.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => toggleStatus(user._id)}
                                                    className={`p-2 rounded-lg transition-colors ${(user.status || 'Active') === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                                    title={(user.status || 'Active') === 'Active' ? 'Suspend' : 'Activate'}
                                                >
                                                    {(user.status || 'Active') === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
