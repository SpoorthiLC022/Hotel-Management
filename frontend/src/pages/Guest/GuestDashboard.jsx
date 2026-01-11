import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookings } from '../../redux/slices/bookingSlice';
import { Calendar, CreditCard, Star, Clock, ArrowRight, Bed } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuestDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { bookings } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    const stats = [
        { title: 'Upcoming Stays', value: bookings.filter(b => b.status === 'Confirmed').length.toString(), icon: Calendar, color: 'text-primary-600', bg: 'bg-primary-50' },
        { title: 'Loyalty Points', value: '4,250', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Member Status', value: 'Gold', icon: Bed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const recentBookings = bookings.slice(0, 5);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
                    <p className="text-slate-500">Ready for your next stay at StaySync?</p>
                </div>
                <Link
                    to="/rooms"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/20"
                >
                    Book a New Room
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="glass p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className={`${stat.bg} p-3 rounded-xl`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings */}
                <div className="lg:col-span-2 glass p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">My Recent Bookings</h3>
                        <Link to="/bookings" className="text-sm font-semibold text-primary-600 hover:underline">View All</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">ID</th>
                                    <th className="pb-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Room</th>
                                    <th className="pb-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Check-in</th>
                                    <th className="pb-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                                    <th className="pb-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentBookings.map((booking) => (
                                    <tr key={booking._id} className="group">
                                        <td className="py-4 text-xs font-bold text-slate-400">{booking._id?.slice(-6) || 'N/A'}</td>
                                        <td className="py-4 text-sm font-bold text-slate-900">{booking.room?.name || 'Room'}</td>
                                        <td className="py-4 text-sm text-slate-600">{new Date(booking.checkIn).toLocaleDateString('en-IN')}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${booking.status === 'Confirmed' ? 'bg-blue-50 text-blue-600' :
                                                booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm font-bold text-slate-900">₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recentBookings.length === 0 && (
                            <div className="py-10 text-center">
                                <p className="text-slate-400 text-sm">No recent bookings found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Rewards Card */}
                    <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100 bg-slate-900 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-1">StaySync Rewards</h3>
                            <p className="text-slate-400 text-xs mb-6">Earn 500 more points for Platinum.</p>

                            <div className="space-y-4">
                                <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="absolute top-0 left-0 h-full bg-primary-500 rounded-full w-[85%]" />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    <span className="text-primary-400">Gold Tier</span>
                                    <span>Platinum</span>
                                </div>
                            </div>
                        </div>
                        <Star className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
                    </div>

                    {/* Quick Promotion */}
                    <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Member Benefit</h3>
                        <p className="text-sm text-slate-500 mb-4">Enjoy free airport pickup on your next Deluxe Suite booking.</p>
                        <Link to="/rooms" className="text-sm font-bold text-primary-600 flex items-center gap-1 hover:gap-2 transition-all">
                            Browse Suites <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestDashboard;
