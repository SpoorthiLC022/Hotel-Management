import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Bed,
    Settings,
    Calendar,
    ClipboardList,
    Users,
    MessageSquare,
    History,
    Bell
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);

    const getLinks = () => {
        if (user?.role === 'admin') {
            return [
                { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
                { name: 'Room Management', path: '/admin/rooms', icon: Bed },
                { name: 'User Management', path: '/admin/users', icon: Users },
                { name: 'Reports', path: '/admin/reports', icon: ClipboardList },
            ];
        }
        if (user?.role === 'staff') {
            return [
                { name: 'Overview', path: '/staff/dashboard', icon: LayoutDashboard },
                { name: 'Housekeeping', path: '/staff/housekeeping', icon: ClipboardList },
                { name: 'Service Hub', path: '/services', icon: Bell },
                { name: 'Bookings', path: '/bookings', icon: Calendar },
            ];
        }
        return [
            { name: 'Dashboard', path: '/guest/dashboard', icon: LayoutDashboard },
            { name: 'Room Explorer', path: '/rooms', icon: Bed },
            { name: 'Service Hub', path: '/services', icon: Bell },
            { name: 'My Bookings', path: '/bookings', icon: History },
            { name: 'Feedback', path: '/feedback', icon: MessageSquare },
        ];
    };

    return (
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
                <ul className="space-y-2">
                    {getLinks().map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group
                  ${isActive
                                        ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'}
                `}
                            >
                                <link.icon className="w-5 h-5" />
                                <span>{link.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-auto p-6 border-t border-slate-100">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group
                        ${isActive
                            ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'}
                    `}
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
