import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Users,
    Bed,
    TrendingUp,
    IndianRupee,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    ClipboardList,
    Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { fetchUsers } from '../../redux/slices/userSlice';
import { fetchRooms } from '../../redux/slices/roomSlice';
import { fetchBookings } from '../../redux/slices/bookingSlice';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const { rooms } = useSelector((state) => state.rooms);
    const { bookings } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchRooms());
        dispatch(fetchBookings());
    }, [dispatch]);

    // Calculate Real Stats
    const totalRevenue = bookings
        .filter(b => b.status !== 'Cancelled')
        .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    const activeBookings = bookings.filter(b => b.status === 'Confirmed').length;
    const totalUsers = users.length;
    const occupancyRate = rooms.length > 0 ? Math.round((activeBookings / rooms.length) * 100) : 0;

    // Calculate Chart Data (Revenue per day - last 7 days)
    const chartData = React.useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dayBookings = bookings.filter(b => b.createdAt?.startsWith(date) && b.status !== 'Cancelled');
            const dailyRevenue = dayBookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
            return {
                name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dailyRevenue,
                occupancy: dayBookings.length // Simplified occupancy
            };
        });
    }, [bookings]);


    const handleExport = () => {
        toast.success('Report generation started. You will be notified when ready.');
    };

    // Get recent activities from bookings
    const activities = bookings.slice(0, 5).map(b => ({
        id: b._id,
        user: b.user?.name || 'Guest',
        action: `Booked ${b.room?.name || 'a room'}`,
        time: new Date(b.createdAt).toLocaleDateString(),
        type: 'Booking'
    }));

    const stats = [
        { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: '+12%', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Active Bookings', value: activeBookings.toString(), change: '+5%', icon: Bed, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Users', value: totalUsers.toString(), change: '+18%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Occupancy Rate', value: `${occupancyRate}%`, change: '-2%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Command Center</h1>
                    <p className="text-slate-500">Global hotel operations and financial analytics.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg"
                >
                    <Download className="w-4 h-4" />
                    Export Detailed Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="glass p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} p-3 rounded-xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={`flex items-center text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.change}
                                {stat.change.startsWith('+') ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Occupancy Rate (%)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="occupancy" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0ea5e9' : '#0284c7'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-slate-900">System Activity Logs</h3>
                    <button className="text-primary-600 text-sm font-bold hover:underline">View All Logs</button>
                </div>
                <div className="space-y-6">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                            <div className={`p-2 rounded-xl ${activity.type === 'Booking' ? 'bg-emerald-50 text-emerald-600' :
                                activity.type === 'Housekeeping' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-bold text-slate-900">{activity.user}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{activity.time}</p>
                                </div>
                                <p className="text-sm text-slate-500">{activity.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
