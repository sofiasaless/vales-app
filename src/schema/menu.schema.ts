export type ItemMenu = {
  id: string,
  descricao: string,
  preco: number,
  gerente_ref: string,
  data_criacao: Date
}

export type ItemMenuPostRequestBody = Omit<ItemMenu, "id" | "data_criacao">