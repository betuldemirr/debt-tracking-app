'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../services/api';

const Register: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!validateEmail(email)) {
            setError('Invalid email format.');
            return;
        }
    
        const registerData = { name, email, password };
    
        try {
            const response = await register(registerData);
    
            if (response.status === 'success') {
                router.push('/login');
            } else {
                setError(response.data || 'Registration failed');
            }
        } catch (error: any) {
            console.error(error);
            setError(error.message || 'An error occurred during registration.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="mb-4 text-center">Register</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={onSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                    <div className="mt-3 text-center">
                        <a href="/login" className="text-decoration-none">Already have an account? <span className='text-decoration-underline'>Login</span></a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;