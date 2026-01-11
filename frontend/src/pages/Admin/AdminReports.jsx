import React, { useState } from 'react';
import {
    ClipboardList,
    Download,
    Calendar,
    Filter,
    FileText,
    TrendingUp,
    Zap,
    Table as TableIcon,
    PieChart as PieIcon,
    BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReports = () => {
    const [selectedReport, setSelectedReport] = useState('Revenue');

    const reports = [
        { id: '1', title: 'Monthly Revenue Summary', date: 'March 2024', type: 'Financial', size: '2.4 MB' },
        { id: '2', title: 'Occupancy Analysis', date: 'Q1 2024', type: 'Operations', size: '1.8 MB' },
        { id: '3', title: 'Guest Satisfaction Report', date: 'Feb 2024', type: 'Feedback', size: '3.1 MB' },
        { id: '4', title: 'Staff Performance Log', date: 'Current Month', type: 'HR', size: '1.2 MB' },
    ];

    const generateReport = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Compiling data...',
                success: 'Report generated successfully!',
                error: 'Could not generate report.',
            }
        );
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Advanced Reports</h1>
                    <p className="text-slate-500">Generate and export comprehensive hotel analytics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all text-sm">
                        <Calendar className="w-4 h-4" />
                        Select Period
                    </button>
                    <button
                        onClick={generateReport}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20"
                    >
                        <Zap className="w-4 h-4" />
                        Generate New Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Report Types</h3>
                    <div className="space-y-2">
                        {['Revenue', 'Occupancy', 'Guest Feedback', 'Inventory', 'Staff Analytics'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedReport(type)}
                                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-between group ${selectedReport === type ? 'bg-primary-50 text-primary-700 border border-primary-100' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {type}
                                <ArrowRight className={`w-4 h-4 transition-all ${selectedReport === type ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="glass p-8 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedReport} Performance</h3>
                            <p className="text-sm text-slate-500 max-w-md">Detailed breakdown of {selectedReport.toLowerCase()} metrics for the current fiscal period.</p>
                            <div className="flex items-center gap-6 mt-6">
                                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+14.2%</span>
                                </div>
                                <div className="text-slate-400 text-xs font-medium italic">vs previous period</div>
                            </div>
                        </div>
                        <BarChart3 className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50" />
                    </div>

                    <div className="glass rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Recent Exports</h3>
                            <button className="text-primary-600 text-sm font-bold hover:underline">Download All</button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {reports.map((report) => (
                                <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-100 rounded-2xl text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{report.title}</h4>
                                            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-1">
                                                <span>{report.date}</span>
                                                <span>•</span>
                                                <span className="uppercase tracking-wider">{report.type}</span>
                                                <span>•</span>
                                                <span>{report.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toast.success('Download started...')}
                                        className="p-3 rounded-2xl border border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-white hover:shadow-md transition-all active:scale-95"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for ArrowRight icon which was not imported but used in the logic
const ArrowRight = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export default AdminReports;
