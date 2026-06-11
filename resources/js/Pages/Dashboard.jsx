import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { Suspense } from 'react';

const AdminDashboard = React.lazy(() => import('./Dashboard/Partials/AdminDashboard'));
const TeacherDashboard = React.lazy(() => import('./Dashboard/Partials/TeacherDashboard'));
const StudentDashboard = React.lazy(() => import('./Dashboard/Partials/StudentDashboard'));

export default function Dashboard({ dashboardData }) {
    const { role, metrics } = dashboardData;

    const renderDashboard = () => {
        switch (role) {
            case 'admin':
                return <AdminDashboard metrics={metrics} />;
            case 'teacher':
                return <TeacherDashboard metrics={metrics} />;
            case 'student':
                return <StudentDashboard metrics={metrics} />;
            default:
                return <div>Pilih peran Anda untuk melihat dashboard.</div>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-6 md:py-12 relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Suspense fallback={
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    }>
                        {renderDashboard()}
                    </Suspense>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
