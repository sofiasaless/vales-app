// Dados mockados iniciais

import type { Employee, MenuProduct, Manager } from '../types/index';

export const mockEmployees: Employee[] = [
  {
    id: 'emp1',
    name: 'Maria Silva Santos',
    birthDate: new Date('1990-05-15'),
    baseSalary: 2500,
    type: 'FIXO',
    cpf: '12345678901',
    admissionDate: new Date('2022-03-01'),
    payday: 5,
    role: 'Cozinheira',
    currentVoucher: [
      {
        id: 'v1',
        productId: 'prod1',
        name: 'Marmita Completa',
        unitPrice: 18.00,
        quantity: 3,
        addedAt: new Date('2024-01-10'),
      },
      {
        id: 'v2',
        productId: 'prod3',
        name: 'Refrigerante Lata',
        unitPrice: 5.00,
        quantity: 5,
        addedAt: new Date('2024-01-11'),
      },
    ],
    paymentHistory: [
      {
        id: 'pay1',
        employeeId: 'emp1',
        date: new Date('2023-12-05'),
        baseSalary: 2500,
        voucherTotal: 120,
        amountPaid: 2380,
        voucherItems: [],
      },
    ],
  },
  {
    id: 'emp2',
    name: 'João Pedro Oliveira',
    birthDate: new Date('1985-08-22'),
    baseSalary: 1800,
    type: 'FIXO',
    cpf: '98765432109',
    admissionDate: new Date('2021-07-15'),
    payday: 10,
    role: 'Garçom',
    currentVoucher: [
      {
        id: 'v3',
        productId: 'prod2',
        name: 'Prato do Dia',
        unitPrice: 15.00,
        quantity: 2,
        addedAt: new Date('2024-01-12'),
      },
    ],
    paymentHistory: [
      {
        id: 'pay2',
        employeeId: 'emp2',
        date: new Date('2024-01-10'),
        baseSalary: 1800,
        voucherTotal: 85,
        amountPaid: 1715,
        voucherItems: [],
      },
    ],
  },
  {
    id: 'emp3',
    name: 'Ana Carolina Ferreira',
    birthDate: new Date('1995-12-03'),
    baseSalary: 150,
    type: 'DIARISTA',
    cpf: '45678912345',
    admissionDate: new Date('2023-09-20'),
    payday: 15,
    role: 'Auxiliar de Cozinha',
    currentVoucher: [],
    paymentHistory: [],
  },
];

export const mockMenuProducts: MenuProduct[] = [
  {
    id: 'prod1',
    name: 'Marmita Completa',
    category: 'Refeições',
    price: 18.00,
    available: true,
  },
  {
    id: 'prod2',
    name: 'Prato do Dia',
    category: 'Refeições',
    price: 15.00,
    available: true,
  },
  {
    id: 'prod3',
    name: 'Refrigerante Lata',
    category: 'Bebidas',
    price: 5.00,
    available: true,
  },
  {
    id: 'prod4',
    name: 'Suco Natural 500ml',
    category: 'Bebidas',
    price: 8.00,
    available: true,
  },
  {
    id: 'prod5',
    name: 'Água Mineral',
    category: 'Bebidas',
    price: 3.00,
    available: true,
  },
  {
    id: 'prod6',
    name: 'Sobremesa do Dia',
    category: 'Sobremesas',
    price: 10.00,
    available: true,
  },
  {
    id: 'prod7',
    name: 'Café Expresso',
    category: 'Bebidas',
    price: 4.00,
    available: true,
  },
];

export const mockManager: Manager = {
  id: 'mgr1',
  name: 'Carlos Roberto',
  email: 'carlos@restaurante.com',
};

export const menuProducts: MenuProduct[] = [
  {
    id: '1',
    name: 'Hambúrguer Clássico',
    category: 'Lanches',
    price: 24.90,
    available: true
  },
  {
    id: '2',
    name: 'Batata Frita',
    category: 'Acompanhamentos',
    price: 12.50,
    available: true
  },
  {
    id: '3',
    name: 'Refrigerante 500ml',
    category: 'Bebidas',
    price: 8.00,
    available: true
  },
  {
    id: '4',
    name: 'Pizza Margherita',
    category: 'Pizzas',
    price: 45.90,
    available: true
  },
  {
    id: '5',
    name: 'Salada Caesar',
    category: 'Saladas',
    price: 22.50,
    available: false
  },
  {
    id: '6',
    name: 'Sorvete de Chocolate',
    category: 'Sobremesas',
    price: 14.90,
    available: true
  },
  {
    id: '7',
    name: 'Café Expresso',
    category: 'Bebidas',
    price: 5.00,
    available: true
  },
  {
    id: '8',
    name: 'X-Tudo',
    category: 'Lanches',
    price: 32.90,
    available: true
  },
  {
    id: '9',
    name: 'Água Mineral',
    category: 'Bebidas',
    price: 4.50,
    available: false
  },
  {
    id: '10',
    name: 'Brownie com Sorvete',
    category: 'Sobremesas',
    price: 18.90,
    available: true
  },
  {
    id: '11',
    name: 'Milk Shake de Morango',
    category: 'Bebidas',
    price: 16.90,
    available: true
  },
  {
    id: '12',
    name: 'Frango à Parmegiana',
    category: 'Pratos Principais',
    price: 38.50,
    available: true
  }
];