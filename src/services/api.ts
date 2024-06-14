import { getAuthToken, setAuthToken } from '../app/utils/Authutils';
import { RegisterRequest, LoginRequest, ApiResponse } from '../app/models/User';
import { Debt, PaymentPlanItem } from '../app/models/Debt';

const API_BASE_URL = 'https://study.logiper.com';

export const fetchWithInterceptor = async (url: string, options: RequestInit = {}): Promise<ApiResponse<any>> => {
    const token = getAuthToken();

    if (token && !url.includes(`${API_BASE_URL}/auth`)) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        };
    }

    try {
        const response = await fetch(url, options);
        const responseData: ApiResponse<any> = await response.json();

        if (!response.ok) {
            const errorMessage = responseData.message || 'Something went wrong';
            throw new Error(errorMessage);
        }

        return responseData;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Network error occurred');
    }
};

//auth/register
export const register = async (registerData: RegisterRequest): Promise<ApiResponse<any>> => {
    const url = `${API_BASE_URL}/auth/register`;
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
    };

    try {
        const response = await fetchWithInterceptor(url, options);
        console.log("API register response",response);
        return response;
    } catch (error) {
        throw new Error('Failed to register');
    }
};

//auth/login
export const login = async (loginData: LoginRequest): Promise<ApiResponse<any>> => {
    const url = `${API_BASE_URL}/auth/login`;
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    };

    try {
        const response = await fetchWithInterceptor(url, options);

        console.log("API login Response:", response);

        return response;
    } catch (error) {
        throw new Error('Failed to login');
    }
};

//finance/debt
export const getAllDebts = async (): Promise<ApiResponse<Debt[]>> => {
    const url = `${API_BASE_URL}/finance/debt`;

    try {
        const response = await fetchWithInterceptor(url, {
            method: 'GET',
        });

        if (response.status === 'success') {
            return response;
        } else {
            throw new Error(response.message || 'Failed to fetch debts');
        }
    } catch (error) {
        throw new Error('Failed to fetch debts');
    }
};

export const createNewDebt = async (newDebt: Omit<Debt, 'debtId'>, paymentPlan: PaymentPlanItem[]): Promise<Debt> => {
    const url = `${API_BASE_URL}/finance/debt`;

    try {
        const response = await fetchWithInterceptor(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...newDebt,
                paymentPlan: paymentPlan,
            }),
        });
        
        const responseData: ApiResponse<Debt> = await response;

        if (response.status === 'success') {
            return responseData.data;
        } else {
            throw new Error(responseData.message || 'Failed to create debt');
        }
    } catch (error: any) {
        console.error('Error creating debt:', error);
        throw new Error('An error occurred while creating debt');
    }
};