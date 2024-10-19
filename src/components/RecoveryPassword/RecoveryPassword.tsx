import React, { useState } from 'react';
import { recoveryPassword } from '../../api/profile';
import { IDefaultResponse } from '../../types/profile';

const PasswordRecovery: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<IDefaultResponse>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dataRecovery = await recoveryPassword(email);
            setSuccess(dataRecovery);
        } catch (error: any) {
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Recuperação de Senha</h2>
                {success?.status === "success" ? (
                    <p className="text-green-600 text-center">
                        {success.message}
                    </p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                Insira seu e-mail:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                data-cy="email-input"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                            disabled={loading}
                            data-cy="submit-button"
                        >
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PasswordRecovery;
