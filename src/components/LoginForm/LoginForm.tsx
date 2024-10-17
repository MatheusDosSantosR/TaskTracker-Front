// src/components/LoginForm/LoginForm.tsx
import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { LoginCredentials } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
    const [apiError, setApiError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate(); // Hook para navegar

    const [loading, setLoading] = useState<boolean>(false);
    const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
        setApiError(null);
        setLoading(true);
        try {
            await login(data);
            navigate('/dashboard');
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Erro ao realizar login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
            <h2>Login</h2>
            {apiError && <div className={styles.error}>{apiError}</div>}
            <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    {...register('email', {
                        required: 'Email é obrigatório',
                        pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' },
                    })}
                    data-cy="email-input"
                />

                {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="password">Senha:</label>
                <input
                    data-cy="password-input"
                    type="password"
                    id="password"
                    {...register('password', { required: 'Senha é obrigatória' })}
                />
                {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>
            <button
                data-cy="submit-button"
                type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
            </button>
        </form>
    );
};

export default LoginForm;
