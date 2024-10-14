// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import TodoList from '../../components/TodoList/TodoList';

const Dashboard: React.FC = () => {
    useEffect(() => {
        document.title = 'Dashboard';
      }, []);
    return (
        <DashboardLayout>
            {/* <h2 className="text-2xl font-bold mb-4">Bem-vindo ao painel</h2> */}
            <TodoList />
        </DashboardLayout>
    );
};

export default Dashboard;
