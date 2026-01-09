import { Incentivo } from "./incentivo.schema"
import { Vale } from "./vale.shema"

export type Pagamento = {
  id: string,
  funcionario_ref: string,
  valor_pago: number,
  vales: Vale[],
  incentivo: Incentivo[],
  data_pagamento: Date
}