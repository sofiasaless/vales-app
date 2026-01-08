import { Vale } from "./vale.shema"

export type TipoFuncionario = 'DIARISTA' | 'FIXO'

export type Funcionario = {
  id: string,
  nome: string,
  salario: number,
  cpf?: string,
  cargo: string,
  tipo: TipoFuncionario,
  foto_url?: string,
  data_nascimento?: Date,
  data_admissao: Date,
  vales: Vale[]
  primeiro_dia_pagamento: number,
  segundo_dia_pagamento: number,
  restaurante_ref?: string,
  data_cadastro: Date,
}

export type FuncionarioPostRequestBody = Omit<Funcionario, "id" | "data_cadastro" | "restaurante_ref">