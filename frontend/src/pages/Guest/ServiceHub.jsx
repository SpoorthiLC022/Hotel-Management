import React, { useState } from 'react';
import {
    Coffee,
    Zap,
    Wind,
    Trash2,
    Utensils,
    Bell,
    Check,
    Clock,
    Sparkles,
    Smartphone,
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const ServiceHub = () => {
    const [activeRequests, setActiveRequests] = useState([
        { id: 'SR-101', service: 'Fresh Towels', time: '10 mins ago', status: 'Pending' }
    ]);

    const services = [
        { name: 'Housekeeping', desc: 'Room cleaning & bed making', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50' },
        { name: 'Fresh Towels', desc: 'Extra set of clean towels', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50' },
        { name: 'Room Service', desc: 'Gourmet meals to your door', icon: Utensils, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { name: 'Concierge', desc: 'Travel & local assistance', icon: Bell, color: 'text-purple-500', bg: 'bg-purple-50' },
        { name: 'Laundry', desc: 'Professional cleaning service', icon: Wind, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { name: 'Maintenance', desc: 'Technical support & repair', icon: Zap, color: 'text-rose-500', bg: 'bg-rose-50' },
    ];

    const handleRequest = (serviceName) => {
        const newRequest = {
            id: `SR-${Math.floor(Math.random() * 900) + 100}`,
            service: serviceName,
            time: 'Just now',
            status: 'Pending'
        };
        setActiveRequests([newRequest, ...activeRequests]);
        toast.success(`${serviceName} requested! Staff notified.`);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Guest Service Hub</h1>
                <p className="text-slate-500">Request any service or assistance during your stay.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service) => (
                            <button
                                key={service.name}
                                onClick={() => handleRequest(service.name)}
                                className="glass p-6 rounded-3xl border border-slate-100 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/5 transition-all text-left flex items-start gap-4 group"
                            >
                                <div className={`${service.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                    <service.icon className={`w-6 h-6 ${service.color}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 mb-1">{service.name}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="glass p-8 rounded-3xl border border-slate-100 bg-slate-900 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Instant Smart Assistance</h3>
                            <p className="text-slate-400 text-sm mb-6 max-w-md">Our digital concierge is powered by the latest tech to ensure your needs are met within minutes.</p>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700" />)}
                                </div>
                                <p className="text-xs font-bold text-primary-400 tracking-wider uppercase">Staff Online Now</p>
                            </div>
                        </div>
                        <Smartphone className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900">My Live Requests</h3>
                            <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 rounded-lg font-bold uppercase tracking-widest">{activeRequests.length} Active</span>
                        </div>

                        {activeRequests.length > 0 ? (
                            <div className="space-y-4">
                                {activeRequests.map((req) => (
                                    <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 truncate">{req.service}</h4>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{req.time}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase">
                                            {req.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm text-slate-400">No active requests</p>
                            </div>
                        )}
                    </div>

                    <div className="glass p-6 rounded-3xl border border-slate-100 bg-emerald-50/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <Check className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-slate-900">Safety Check</h3>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">Your room #{Math.floor(Math.random() * 100) + 100} was sanitized and inspected at 08:30 AM today.</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-slate-900">Explore Nearby</h3>
                        </div>
                        <div className="aspect-video bg-slate-100 rounded-2xl mb-4 relative overflow-hidden group">
                            <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 border border-slate-200">View Live Map</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Discover top-rated restaurants and attractions around StaySync.</p>
                        <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                            Open Local Guide
                            <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceHub;
