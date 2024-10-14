import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Usamos NavLink para destacar a rota ativa
import { useAuth } from '../../hooks/useAuth'; // Para obter o nome do usuário
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth(); // Obtendo informações do usuário autenticado
    const navigate = useNavigate();
    const location = useLocation(); // Usado para verificar a rota atual

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Cabeçalho com menu de navegação */}
            <header className="bg-blue-600 text-white shadow-lg p-4">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Título do Dashboard */}
                    <h1 className="text-2xl font-bold">Tarefas</h1>

                    {/* Menu de navegação */}
                    <nav className="flex space-x-6">
                        <NavLink
                            to="/dashboard"
                            className={`text-gray-200 hover:text-white ${location.pathname === '/dashboard' ? 'border-b-4 border-white' : ''
                                }`}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/todos"
                            className={`text-gray-200 hover:text-white ${location.pathname === '/todos' ? 'border-b-4 border-white' : ''
                                }`}
                        >
                            Tarefas
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={`text-gray-200 hover:text-white ${location.pathname === '/profile' ? 'border-b-4 border-white' : ''
                                }`}
                        >
                            Perfil
                        </NavLink>
                    </nav>

                    {/* Nome do usuário e botão de logout */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <FaUserCircle className="text-2xl mr-2" />
                            <span className="font-semibold">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition text-sm"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Área de conteúdo */}
            <main className="flex-1 p-6">
                <div className="container mx-auto">{children}</div>
            </main>

            {/* Rodapé opcional */}
            <footer className="bg-blue-600 text-white text-center p-4">
                <p className="text-sm">© 2024 Aplicação de Tarefas. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default DashboardLayout;
