import React, { useState } from 'react';
import {
    ClipboardList,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    Bed,
    Sparkles,
    Wrench,
    MapPin,
    Calendar,
    ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
    const [rooms, setRooms] = useState([
        { id: '101', type: 'Single', guest: 'John Doe', status: 'Dirty', lastCleaned: '24h ago' },
        { id: '102', type: 'Double', guest: 'Vacant', status: 'Clean', lastCleaned: '2h ago' },
        { id: '103', type: 'Suite', guest: 'Alice Smith', status: 'Maintenance', lastCleaned: '3 days ago' },
        { id: '104', type: 'Double', guest: 'Bob Wilson', status: 'Occupied', lastCleaned: '5h ago' },
        { id: '201', type: 'Villa', guest: 'Charlie Brown', status: 'Dirty', lastCleaned: '12h ago' },
        { id: '202', type: 'Suite', guest: 'Diana Prince', status: 'Dirty', lastCleaned: '1h ago' },
    ]);

    const [tickets, setTickets] = useState([
        { id: 'T-101', room: '103', issue: 'AC Leaking', priority: 'High', status: 'Open', time: '10:30 AM' },
        { id: 'T-102', room: '201', issue: 'Bulb Replacement', priority: 'Low', status: 'Resolved', time: 'Yesterday' },
        { id: 'T-103', room: '101', issue: 'TV Remote Not Working', priority: 'Medium', status: 'Open', time: '11:15 AM' },
    ]);

    const updateStatus = (id, newStatus) => {
        setRooms(rooms.map(r => r.id === id ? { ...r, status: newStatus } : r));
        toast.success(`Room ${id} marked as ${newStatus}`);
    };

    const stats = [
        { title: 'Dirty Rooms', value: rooms.filter(r => r.status === 'Dirty').length.toString(), icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Active Tickets', value: tickets.filter(t => t.status === 'Open').length.toString(), icon: Wrench, color: 'text-rose-600', bg: 'bg-rose-50' },
        { title: 'Checked Out', value: '4', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Operations Command Center</h1>
                    <p className="text-slate-500">Live floor status and maintenance tracking.</p>
                </div>
                <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl border border-primary-100 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-slate-700">Floor 1-2 • Morning Shift</span>
                </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Room Status Matrix</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filter floor..."
                                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none w-48"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Room</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Update Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${room.status === 'Clean' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        <Bed className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Room {room.id}</p>
                                                        <p className="text-xs text-slate-500">{room.type} • {room.guest}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${room.status === 'Clean' ? 'bg-emerald-50 text-emerald-600' :
                                                        room.status === 'Dirty' ? 'bg-amber-50 text-amber-600' :
                                                            room.status === 'Maintenance' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {room.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <select
                                                    className="text-xs border border-slate-200 rounded-lg p-1.5 outline-none bg-white font-bold text-slate-700 shadow-sm"
                                                    value={room.status}
                                                    onChange={(e) => updateStatus(room.id, e.target.value)}
                                                >
                                                    <option value="Clean">Mark Clean</option>
                                                    <option value="Dirty">Mark Dirty</option>
                                                    <option value="Maintenance">Maintenance Required</option>
                                                    <option value="Occupied">Occupied</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Maintenance Tickets */}
                    <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100 bg-slate-900 text-white">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Wrench className="w-5 h-5 text-primary-400" />
                                <h3 className="font-bold">Active Tickets</h3>
                            </div>
                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-bold uppercase tracking-widest text-primary-300">Live</span>
                        </div>
                        <div className="space-y-4">
                            {tickets.filter(t => t.status === 'Open').map(ticket => (
                                <div key={ticket.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-primary-400">Room {ticket.room}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${ticket.priority === 'High' ? 'bg-rose-500/30 text-rose-400' : 'bg-amber-500/30 text-amber-400'}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium mb-1 line-clamp-1">{ticket.issue}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-[10px] text-white/40">{ticket.time}</p>
                                        <button className="text-[10px] font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Resolve <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="w-5 h-5 text-primary-600" />
                            <h3 className="font-bold text-slate-900">My Today's Schedule</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Shift Timing</p>
                                    <p className="text-sm font-bold text-slate-700">08:00 AM - 04:00 PM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assigned Floor</p>
                                    <p className="text-sm font-bold text-slate-700">Floor 1 & 2 (12 Rooms)</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors uppercase tracking-widest">
                            View Monthly Roster
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
