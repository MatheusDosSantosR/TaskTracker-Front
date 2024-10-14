// src/components/DashboardLayout/DashboardLayout.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaHome, FaListAlt, FaUserCircle } from 'react-icons/fa'; // Ícones do FontAwesome
import { FiLogOut } from 'react-icons/fi'; // Ícone de logout

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col h-screen">
            {/* Cabeçalho */}
            <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span>Bem vindo(a) {user?.name}</span>
                    <button
                        onClick={logout}
                        className="flex items-center text-white hover:underline"
                    >
                        <FiLogOut className="mr-2" /> Sair
                    </button>
                </div>
            </header>

            {/* Layout principal */}
            <div className="flex flex-1">
                {/* Menu lateral */}
                <aside className="w-64 bg-gray-100 p-4">
                    <nav>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="/dashboard"
                                    className="flex items-center text-gray-700 hover:text-blue-500"
                                >
                                    <FaHome className="mr-2" /> Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/todos"
                                    className="flex items-center text-gray-700 hover:text-blue-500"
                                >
                                    <FaListAlt className="mr-2" /> To-dos
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/profile"
                                    className="flex items-center text-gray-700 hover:text-blue-500"
                                >
                                    <FaUserCircle className="mr-2" /> Perfil
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Área de conteúdo */}
                <main className="flex-1 bg-white p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
