// src/pages/Register/Register.tsx
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { createUser } from "../../api/profile"
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const schema = yup.object().shape({
    name: yup.string().required('O nome é obrigatório'),
    email: yup.string().email('Email inválido').required('O email é obrigatório'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('A senha é obrigatória'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas não correspondem').required('Confirme a senha'),
});

const Register: React.FC = () => {
    useEffect(() => {
        document.title = 'Cadastro';
    }, []);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
        resolver: yupResolver(schema),
    });
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
    
    const onSubmit = async (data: RegisterFormInputs) => {
        setLoading(true);
        try {
            const response = await createUser(data);
            setSuccessMessage(response.msg)
            // Sleep e redirecionar para a página de login ou dashboard após o cadastro
            await sleep(3000);
            navigate('/dashboard');
        } catch (error: any) {
            setErrorMessage(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Cadastro</h2>
                {errorMessage && (
                <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMessage} Redirecionando...</div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Nome */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register('email')}
                            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Senha */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            {...register('password')}
                            className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirmar senha */}
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                            Confirmar Senha
                        </label>
                        <input
                            type="password"
                            {...register('confirmPassword')}
                            className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Botão de enviar */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Já tem uma conta? <a href="/login" className="text-blue-500 hover:underline">Faça login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
