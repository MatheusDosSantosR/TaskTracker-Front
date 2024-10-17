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
	password: yup.string().min(3, 'A senha deve ter pelo menos 6 caracteres').required('A senha é obrigatória'),
	rememberMe: yup.boolean().default(false),
});

const Login: React.FC = () => {
	useEffect(() => {
		const getRemember = localStorage.getItem("remember")

		if (getRemember) {
			const objRemember = JSON.parse(getRemember)
			setEmail(objRemember.email)
			setRemember(objRemember.rememberMe)
		}
		document.title = 'Login';
	}, []);

	const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
		resolver: yupResolver(schema),
	});
	const [email, setEmail] = useState<string>('');
	const [remember, setRemember] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState<boolean>(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const onSubmit = async (data: LoginFormInputs) => {
		setLoading(true);
		try {
			await login(data);
			if (data.rememberMe) {
				data.password = ""
				localStorage.setItem("remember", JSON.stringify(data))
			}
			else {
				localStorage.removeItem("remember");
			}
			// Redireciona após login
			navigate('/dashboard');
		} catch (err: any) {
			setErrorMessage(err.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
				{errorMessage && (
					<div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMessage}</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 font-medium mb-2">
							Email
						</label>
						<input
							type="email"
							{...register('email')}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
							data-cy="email-input"
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
							data-cy="password-input"
						/>
						{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
					</div>

					<div className="mb-6 flex items-center justify-between">
						<label className="inline-flex items-center">
							<input
								type="checkbox"
								{...register('rememberMe')}
								checked={remember}
								onChange={(e) => setRemember(e.target.checked)}
								className="form-checkbox text-blue-600"
								data-cy="remember-checkbox"
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
						data-cy="submit-button"
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
