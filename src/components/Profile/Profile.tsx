import React, { useState, useEffect } from 'react';
import { updateUser, getUser } from '../../api/profile';

const EditUserProfile: React.FC = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Carregar os dados do usuário quando a página for montada
    useEffect(() => {
        //requisição à API para buscar os dados do usuário
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const user = await getUser();
                setUserData((prevData) => ({
                    ...prevData,
                    name: user.name,
                    email: user.email,
                }));
            } catch (error) {
                setErrorMessage('Erro ao carregar dados do usuário.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Manipuladores de eventos para os campos de entrada
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        // Validações básicas
        if (userData.password !== userData.confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        // Atualiza os dados do usuario
        try {
            const response = await updateUser(userData);
            setSuccessMessage(response.msg);

            // Atualiza nome no localStorage
            localStorage.setItem('user', JSON.stringify(response.data));

        } catch (error) {
            setErrorMessage('Erro ao atualizar os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Editar Perfil</h1>

            {errorMessage && (
                <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMessage}</div>
            )}
            {successMessage && (
                <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMessage}</div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Campo Nome */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Nome
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        data-cy="name-input"
                    />
                </div>

                {/* Campo Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        data-cy="email-input"
                    />
                </div>

                {/* Campo Senha */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Nova Senha
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Deixe em branco para manter a senha atual"
                        data-cy="password-input"
                    />
                </div>

                {/* Campo Confirmar Senha */}
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                        Confirmar Nova Senha
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-cy="confirm-password-input"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={loading}
                    data-cy="button-submit"
                >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    );
};

export default EditUserProfile;
