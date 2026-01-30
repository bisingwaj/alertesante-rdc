import React from 'react';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { Sidebar } from '../components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
    return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden">
            <DashboardHeader />
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
