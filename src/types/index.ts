// Tipos principais do sistema de vales

export type EmployeeType = 'DIARISTA' | 'FIXO';

export interface Employee {
  id: string;
  name: string;
  birthDate: Date;
  baseSalary: number;
  type: EmployeeType;
  cpf: string;
  admissionDate: Date;
  payday: number;
  role: string;
  currentVoucher: VoucherItem[];
  paymentHistory: Payment[];
}

export interface VoucherItem {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  addedAt: Date;
}

export interface Payment {
  id: string;
  employeeId: string;
  date: Date;
  baseSalary: number;
  voucherTotal: number;
  amountPaid: number;
  voucherItems: VoucherItem[];
}

export interface MenuProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  timestamp: Date;
}
