export type Vale = {
  id: string,
  quantidade: number,
  descricao: string,
  data_adicao: Date,
  preco_unit: number;
  produto_ref?: string;
}

export type ValeDinheiroPostRequestBody = Omit<Vale, "id" | "quantidade" | "data_adicao" | "produto_ref">