'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllDebts, createNewDebt } from '../../services/api';
import { Debt, PaymentPlanItem } from '../../app/models/Debt';
import { getAuthToken } from '../utils/Authutils';

const Dashboard: React.FC = () => {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [newDebtId, setNewDebtId] = useState<string>('');
    const [newDebtName, setNewDebtName] = useState<string>('');
    const [newLenderName, setNewLenderName] = useState<string>('');
    const [newDebtAmount, setNewDebtAmount] = useState<number>(0);
    const [newInterestRate, setNewInterestRate] = useState<number>(0);
    const [newPaymentStart, setNewPaymentStart] = useState<string>('');
    const [newInstallment, setNewInstallment] = useState<number>(0);
    const [newDescription, setNewDescription] = useState<string>('');
    const [newPaymentPlan, setNewPaymentPlan] = useState<PaymentPlanItem[]>([]);

    const [showPopup, setShowPopup] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const token = getAuthToken();
        console.log("Token:", token);

        if (!token) {
            console.log("go to login page");
            router.push('/login');
            return;
        }

        const fetchDebts = async () => {
            try {
                const response = await getAllDebts();
                if (response.status === 'success') {
                    setDebts(response.data);
                    console.log("all debt response:", response);
                } else {
                    setError(response.message || 'Failed to fetch debts');
                }
            } catch (error: any) {
                setError(error.message || 'An error occurred while fetching debts.');
            }
        };

        fetchDebts();
    }, []);

    const onCreateDebt = async () => {
        try {
            const paymentPlan: PaymentPlanItem[] = calculatePaymentPlan();
            setNewPaymentPlan(paymentPlan);

            const newDebt: Omit<Debt, 'debtId'> = {
                debtName: newDebtName,
                lenderName: newLenderName,
                debtAmount: newDebtAmount,
                interestRate: newInterestRate,
                amount: 0,
                paymentStart: newPaymentStart,
                installment: newInstallment,
                description: newDescription,
                paymentPlan: paymentPlan,
            };

            const createdDebt = await createNewDebt(newDebt, paymentPlan);

            setNewDebtId(createdDebt.debtId);

            setDebts(prevDebts => [...prevDebts, createdDebt]);

            closePopup();
            console.log("New debt created:", createdDebt);

        } catch (error: any) {
            console.error('Error creating debt:', error);
            setError('An error occurred while creating debt');
        }
    };

    const calculatePaymentPlan = () => {
        const monthlyInterestRate = newInterestRate / 100 / 12;
        const totalAmount = newDebtAmount * (1 + monthlyInterestRate) ** newInstallment;
        const monthlyPayment = totalAmount / newInstallment;

        const startDate = new Date(newPaymentStart);
        const paymentPlan: PaymentPlanItem[] = [];

        for (let i = 0; i < newInstallment; i++) {
            const paymentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i + 1, startDate.getDate());
            const paymentAmount = monthlyPayment;
            paymentPlan.push({ paymentDate: paymentDate.toISOString().split('T')[0], paymentAmount });
        }

        return paymentPlan;
    };

    const openPopup = () => setShowPopup(true);
    const closePopup = () => {
        setShowPopup(false);
        clearNewDebtFields();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'debtName':
                setNewDebtName(value);
                break;
            case 'lenderName':
                setNewLenderName(value);
                break;
            case 'debtAmount':
                setNewDebtAmount(parseFloat(value));
                break;
            case 'interestRate':
                setNewInterestRate(parseFloat(value));
                break;
            case 'paymentStart':
                setNewPaymentStart(value);
                break;
            case 'installment':
                setNewInstallment(parseInt(value));
                break;
            case 'description':
                setNewDescription(value);
                break;
            default:
                break;
        }
    };

    const clearNewDebtFields = () => {
        setNewDebtName('');
        setNewLenderName('');
        setNewDebtAmount(0);
        setNewInterestRate(0);
        setNewPaymentStart('');
        setNewInstallment(0);
        setNewDescription('');
        setNewPaymentPlan([]);
    };

    return (
        <div className="container my-5">
            <h1 className="mb-4">Dashboard</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card mb-4">
                <div className="card-header bg-info">
                    <h2>Debt List</h2>
                </div>
                <div className="card-body">
                    {debts.length > 0 ? (
                        <ul className="list-group">
                            {debts.map(debt => (
                                <li key={debt.debtId} className="list-group-item">
                                    <strong>{debt.debtName}</strong> - {debt.lenderName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No debts found.</p>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header bg-danger">
                    <h2>Add a New Debt</h2>
                </div>
                <div className="card-body">
                    <button onClick={openPopup} className='btn btn-primary'>Create a New Debt</button>
                    {showPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <h2>Create New Debt</h2>

                                <div className="d-flex justify-content-between my-2">
                                    <label className="w-100">Debt Name: </label>
                                    <input type="text" name="debtName" value={newDebtName} onChange={onInputChange} />
                                </div>
                                <div className="d-flex justify-content-between my-2">
                                    <label className="w-100">Lender Name: </label>
                                    <input type="text" name="lenderName" value={newLenderName} onChange={onInputChange} />
                                </div>
                                <div className="d-flex justify-content-between my-2">
                                    <label className="w-100">Debt Amount: </label>
                                    <input type="number" name="debtAmount" value={newDebtAmount} onChange={onInputChange} />
                                </div>
                                <div className="d-flex justify-content-between my-2">
                                    <label className="w-100">Interest Rate (%): </label>
                                    <input type="number" name="interestRate" value={newInterestRate} onChange={onInputChange} />
                                </div>
                                <div className="d-flex justify-content-between my-2">
                                    <label className="w-100">Installment (months): </label>
                                    <input type="number" name="installment" value={newInstallment} onChange={onInputChange} />
                                </div>
                                <div className="d-flex justify-content-between my-2">
                                    <label className="w-100">Payment Start: </label>
                                    <input className='w-100' type="date" name="paymentStart" value={newPaymentStart} onChange={onInputChange} />
                                </div>
                                <div className="d-flex justify-content-between my-2">
                                    <label className="w-100">Description: </label>
                                    <input type="text" name="description" value={newDescription} onChange={onInputChange} />
                                </div>
                                <div className="d-flex justify-content-center mt-3">
                                    <button onClick={onCreateDebt} className='btn btn-primary'>Ödeme Planı Oluştur</button>
                                    <button onClick={closePopup} className='btn text-decoration-underline'>cancel</button>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
