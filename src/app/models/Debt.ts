export interface Debt {
    debtId: string;
    debtName: string;
    lenderName: string;
    debtAmount: number;
    interestRate: number;
    amount: number;
    paymentStart: string;
    installment: number;
    description: string;
    paymentPlan: PaymentPlanItem[];
}

export interface PaymentPlanItem {
    paymentDate: string;
    paymentAmount: number;
}