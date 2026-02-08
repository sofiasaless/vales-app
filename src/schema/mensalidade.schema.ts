export type Mensalidade = {
  id?: string
  status: StatusMensalidade,
  data_vencimento: Date,
  data_pagamento: Date | null,
  valor: number,
  link: string,
  restaurante_ref: string,
  data_criacao: Date
}

export type MensalidadePostRequestBody = Omit<Mensalidade, "data_criacao" | "restaurante_ref" | "status">

export type StatusMensalidade = 'PENDENTE' | 'PAGO' | 'VENCIDO'