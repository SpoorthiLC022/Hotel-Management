import React, { useState } from 'react';
import {
    Sparkles,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    ArrowRight,
    Play,
    Timer
} from 'lucide-react';
import toast from 'react-hot-toast';

const Housekeeping = () => {
    const [tasks, setTasks] = useState([
        { id: 1, room: '101', type: 'Full Clean', status: 'Pending', guest: 'Checking Out', priority: 'High' },
        { id: 2, room: '204', type: 'Towel Refresh', status: 'In Progress', guest: 'Stayover', priority: 'Medium' },
        { id: 3, room: '302', type: 'Turndown Service', status: 'Pending', guest: 'Stayover', priority: 'Low' },
        { id: 4, room: '105', type: 'Deep Clean', status: 'Pending', guest: 'Vacant', priority: 'High' },
    ]);

    const updateStatus = (id, newStatus) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                toast.success(`Task for Room ${t.room} ${newStatus}`);
                return { ...t, status: newStatus };
            }
            return t;
        }));
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Housekeeping Dashboard</h1>
                    <p className="text-slate-500">Real-time task management and cleaning protocols.</p>
                </div>
                <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl border border-slate-100">
                    <Timer className="w-5 h-5 text-primary-600" />
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                        <p className="text-sm font-bold text-slate-900">22m avg / room</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl border border-slate-100 bg-amber-50/50">
                    <p className="text-xs font-bold text-amber-600 uppercase mb-1">To Do</p>
                    <p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status === 'Pending').length}</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-slate-100 bg-blue-50/50">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status === 'In Progress').length}</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-slate-100 bg-emerald-50/50">
                    <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Completed</p>
                    <p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status === 'Completed').length}</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Floor Target</p>
                    <p className="text-2xl font-bold text-slate-900">85%</p>
                </div>
            </div>

            <div className="glass rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Daily Task Board</h3>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                            <Filter className="w-5 h-5" />
                        </button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter by room..."
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none w-48"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 p-6 gap-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="glass p-5 rounded-2xl border border-slate-100 hover:border-primary-100 transition-all flex flex-col md:flex-row md:items-center gap-6">
                            <div className="w-full md:w-32 py-3 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100 shrink-0">
                                <p className="text-xs font-bold text-slate-400 uppercase">Room</p>
                                <p className="text-xl font-bold text-slate-900">{task.room}</p>
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-900">{task.type}</h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${task.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                                            task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {task.priority} Priority
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">Guest Status: {task.guest}</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`text-xs font-bold ${task.status === 'Pending' ? 'text-amber-600' :
                                            task.status === 'In Progress' ? 'text-blue-600' : 'text-emerald-600'
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {task.status === 'Pending' ? (
                                        <button
                                            onClick={() => updateStatus(task.id, 'In Progress')}
                                            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all"
                                        >
                                            <Play className="w-3 h-3 fill-current" />
                                            Start Task
                                        </button>
                                    ) : task.status === 'In Progress' ? (
                                        <button
                                            onClick={() => updateStatus(task.id, 'Completed')}
                                            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-all"
                                        >
                                            <CheckCircle2 className="w-3 h-3" />
                                            Mark Complete
                                        </button>
                                    ) : (
                                        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Finished
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Housekeeping;
