// src/pages/Login/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface LoginFormInputs {
	email: string;
	password: string;
	rememberMe: boolean;
}

const schema = yup.object().shape({
	email: yup.string().email('Email inválido').required('O email é obrigatório'),
	password: yup.string().min(3, 'A senha deve ter pelo menos 3 caracteres').required('A senha é obrigatória'),
	rememberMe: yup.boolean().default(false),
});

const Login: React.FC = () => {
	useEffect(() => {
		document.title = 'Login';
	}, []);
	const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
		resolver: yupResolver(schema),
	});
	const [loading, setLoading] = useState<boolean>(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const onSubmit = async (data: LoginFormInputs) => {
		setLoading(true);
		try {
			await login(data);
			if (data.rememberMe) {
				// Armazene o token ou informações conforme sua necessidade
			}
			navigate('/dashboard'); // Redireciona após login
		} catch (err) {
			console.error('Erro ao realizar login', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>

				<form onSubmit={handleSubmit(onSubmit)}>
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

					<div className="mb-6 flex items-center justify-between">
						<label className="inline-flex items-center">
							<input
								type="checkbox"
								{...register('rememberMe')}
								className="form-checkbox text-blue-600"
							/>
							<span className="ml-2 text-gray-700">Lembrar-me</span>
						</label>
						<a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
							Esqueci minha senha
						</a>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
						disabled={loading}
					>
						{loading ? 'Entrando...' : 'Entrar'}
					</button>
					<p className="text-sm text-gray-600 mt-4 text-center">
						Ainda não tem um conta ? <a href="/register" className="text-blue-500 hover:underline">Cadastre-se</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Login;
