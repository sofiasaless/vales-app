export type Restaurante = {
  id?: string,
  nome_fantasia: string,
  email: string,
  ativo: boolean,
  data_criacao: Date,
  pushTokens?: string[]
}

export type RestaurantePostRequestBody = Omit<Restaurante, "id" | "data_criacao" | "ativo">