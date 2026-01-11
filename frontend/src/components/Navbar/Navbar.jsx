import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { markAsRead, markAllAsRead } from '../../redux/slices/notificationSlice';
import { Hotel, User, LogOut, Bell, Check, Trash2, Clock, Globe, ChevronDown, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <Hotel className="w-6 h-6 text-primary-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    StaySync
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2 rounded-full relative transition-all ${showNotifications ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5"
                            >
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={() => dispatch(markAllAsRead())}
                                            className="text-xs text-primary-600 font-semibold hover:underline"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                onClick={() => dispatch(markAsRead(n.id))}
                                                className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.read ? 'bg-primary-50/30' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-primary-600' : 'bg-transparent'
                                                        }`} />
                                                    <div className="space-y-1">
                                                        <p className={`text-sm font-semibold text-slate-900 ${!n.read ? 'pr-4' : ''}`}>
                                                            {n.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 leading-relaxed">
                                                            {n.message}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                                            <Clock className="w-3 h-3" />
                                                            {n.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center">
                                            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                            <p className="text-sm text-slate-500 font-medium">No notifications yet</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Language Switcher */}
                <div className="relative hidden md:block">
                    <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">EN</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </div>

                {/* Theme Toggle */}
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Moon className="w-4 h-4" />
                </button>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name || 'Guest User'}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role || 'Guest'}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold overflow-hidden">
                        {user?.name ? user.name[0] : <User className="w-5 h-5 text-primary-400" />}
                    </div>
                    <button
                        onClick={() => dispatch(logout())}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
