export type TiposGerente = 'GERENTE' | 'CAIXA'

export type Gerente = {
  id?: string,
  nome: string,
  tipo: TiposGerente,
  senha: string,
  expoPushToken?: string,
  restaurante_ref: string,
  ativo: boolean,
  data_ultimo_acesso?: Date,
  data_criacao: Date
}

export type GerentePostRequestBody = Omit<Gerente, "id" | "data_criacao" | "expoPushToken" | "ativo" | "data_ultimo_acesso" | "restaurante_ref">