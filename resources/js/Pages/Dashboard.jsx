import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, totalPendingTasks, myPendingTasks, totalCompletedTasks, myCompletedTasks, totalInProgressTasks, myInProgressTasks }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8 grid grid-cols-3 gap-5">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className='text-amber-500 text-xl font-semibold'>Pending Tasks</h3>
                            <p className='text-xl mt-4'>
                                <span className='mr-2'>{myPendingTasks}</span>/
                                <span className='ml-2'>{totalPendingTasks}</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className='text-blue-500 text-xl font-semibold'>In Progrss Tasks</h3>
                            <p className='text-xl mt-4'>
                                <span className='mr-2'>{myInProgressTasks}</span>/
                                <span className='ml-2'>{totalInProgressTasks}</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className='text-green-600 font-semibold'>Completed Tasks</h3>
                            <p className='text-xl mt-4'>
                                <span className='mr-2'>{myCompletedTasks}</span>/
                                <span className='ml-2'>{totalCompletedTasks}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
