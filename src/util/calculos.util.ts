// Funções de cálculo

import { Funcionario, TipoFuncionario } from '../schema/funcionario.schema';
import { GanhosIncentivo } from '../schema/incentivo.schema';
import { Vale } from '../schema/vale.shema';
import type { VoucherItem, Employee } from '../types';

export const calculateVoucherItemTotal = (item: VoucherItem): number => {
  return item.unitPrice * item.quantity;
};

export const calcularTotalVale = (item: Vale): number => {
  return item.preco_unit * item.quantidade;
};

export const calculateVoucherTotal = (items: VoucherItem[]): number => {
  return items.reduce((total, item) => total + calculateVoucherItemTotal(item), 0);
};

export const calcularTotalVales = (items: Vale[] | undefined): number => {
  if (!items) return 0;
  return items.reduce((total, item) => total + calcularTotalVale(item), 0);
};

export const calculatePaymentAmount = (baseSalary: number, voucherTotal: number): number => {
  return Math.max(0, baseSalary - voucherTotal);
};

export const getVoucherStatus = (employee: Employee): 'clean' | 'pending' | 'high' => {
  const total = calculateVoucherTotal(employee.currentVoucher);
  const percentage = (total / employee.baseSalary) * 100;

  if (total === 0) return 'clean';
  if (percentage > 50) return 'high';
  return 'pending';
};

export const getPaymentStatusText = (employee: Employee): string => {
  const today = new Date();
  const lastPayment = employee.paymentHistory[employee.paymentHistory.length - 1];

  if (!lastPayment) return 'Sem pagamentos';

  const lastPaymentDate = new Date(lastPayment.date);
  const diffTime = today.getTime() - lastPaymentDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Pago hoje';
  if (diffDays === 1) return 'Pago ontem';
  if (diffDays < 7) return `Pago há ${diffDays} dias`;
  if (diffDays < 30) return `Pago há ${Math.floor(diffDays / 7)} semana(s)`;

  return 'A receber';
};

export const isPayday = (employee: Employee): boolean => {
  const today = new Date().getDate();
  return today === employee.payday;
};

export const daysUntilPayday = (employee: Employee): number => {
  const today = new Date();
  const currentDay = today.getDate();
  const payday = employee.payday;

  if (currentDay <= payday) {
    return payday - currentDay;
  }

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return daysInMonth - currentDay + payday;
};

export const calcularTotalIncentivos = (incentivos: GanhosIncentivo[]) => {
  if (incentivos.length === 0) return 0;
  return incentivos.reduce((acc, inc) => {
    return acc + inc.valor;
  }, 0)
}

interface Props {
  tipo: TipoFuncionario,
  salario: number,
  dias_trabalhados_semanal?: number,
  incentivo: GanhosIncentivo[],
  vales: Vale[]
}

export const calcularSalarioQuinzena = (funcObj: Props) => {
  return (funcObj.tipo === 'FIXO') ? (funcObj.salario / 2) : (funcObj.salario * (funcObj.dias_trabalhados_semanal || 1))
}

export const calcularTotalParaPagar = (funcObj: Props) => {
  return calcularSalarioQuinzena(funcObj) - calcularTotalVales(funcObj.vales) + calcularTotalIncentivos(funcObj.incentivo);
}