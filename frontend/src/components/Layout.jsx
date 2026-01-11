import React from 'react';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
