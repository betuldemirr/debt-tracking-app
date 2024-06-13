'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../services/api';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onLoginFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Invalid email format.');
            return;
        }

        try {
            const response = await login({ email, password });

            if (response.status === 'success') {
                router.push('/dashboard');
            } else {
                setError(response.data || 'Login failed');
            }
        } catch (error: any) {
            console.error(error);
            setError(error.message || 'An error occurred during login.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="mb-4 text-center">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={onLoginFormSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <div className="mt-3 text-center">
                        <a href="/register" className="text-decoration-none">Don't have an account? <span className='text-decoration-underline'>Register</span></a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;