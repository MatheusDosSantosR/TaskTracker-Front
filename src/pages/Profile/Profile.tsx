// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import Profile from '../../components/Profile/Profile';

const Dashboard: React.FC = () => {
    useEffect(() => {
        document.title = 'Edição perfil';
      }, []);
    return (
        <DashboardLayout>
            <Profile />
        </DashboardLayout>
    );
};

export default Dashboard;
