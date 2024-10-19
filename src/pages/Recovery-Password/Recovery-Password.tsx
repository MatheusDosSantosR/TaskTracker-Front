// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import RecoveryPassword from '../../components/RecoveryPassword/RecoveryPassword';

const Dashboard: React.FC = () => {
    useEffect(() => {
        document.title = 'Recuperação de conta';
      }, []);
    return (
        <RecoveryPassword />
    );
};

export default Dashboard;
