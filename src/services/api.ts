import { getAuthToken } from '../app/utils/Authutils';
import { RegisterRequest, LoginRequest, ApiResponse } from '../app/models/User';

const API_BASE_URL = 'https://study.logiper.com';

const fetchWithInterceptor = async (url: string, options: RequestInit = {}): Promise<ApiResponse<any>> => {
    const token = getAuthToken();

    if (token && !url.includes(`${API_BASE_URL}/auth`)) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        };
    }

    const response = await fetch(url, options);
    const responseData: ApiResponse<any> = await response.json();

    if (!response.ok) {
        const errorMessage = responseData.data || responseData.message || 'Something went wrong';
        throw new Error(errorMessage);
    }

    return responseData;
};

export const register = async (registerData: RegisterRequest): Promise<ApiResponse<any>> => {
    const url = `${API_BASE_URL}/auth/register`;
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
    };

    return fetchWithInterceptor(url, options);
};

export const login = async (loginData: LoginRequest): Promise<ApiResponse<any>> => {
    const url = `${API_BASE_URL}/auth/login`;
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    };

    return fetchWithInterceptor(url, options);
};