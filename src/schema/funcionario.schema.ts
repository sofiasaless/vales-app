import { Incentivo, IncentivoFuncionario } from "./incentivo.schema"
import { Vale } from "./vale.shema"

export type TipoFuncionario = 'DIARISTA' | 'FIXO'

export type Funcionario = {
  id: string,
  nome: string,
  salario: number,
  cpf?: string,
  cargo: string,
  tipo: TipoFuncionario,
  dias_trabalhados_semanal?: number;
  foto_url?: string,
  data_nascimento?: Date,
  data_admissao: Date,
  vales: Vale[],
  incentivo: IncentivoFuncionario[],
  primeiro_dia_pagamento: number,
  segundo_dia_pagamento: number,
  restaurante_ref: string,
  data_cadastro: Date,
}

export type FuncionarioPostRequestBody = Omit<Funcionario, "id" | "data_cadastro">

export type FuncionarioUpdateRequestBody = Pick<
  Funcionario,
  "nome" | "cargo" | 'cpf' | 'data_admissao' | 'data_nascimento' | 'primeiro_dia_pagamento' | 'segundo_dia_pagamento' | 'tipo' | 'salario' | 'foto_url' | 'dias_trabalhados_semanal'
>
