import { DocumentReference } from "firebase/firestore"

export type CategoriaFinancas = {
  id: string,
  descricao: string,
  cor: string,
  icone: string,
  restaurante_ref: string
  data_criacao: Date
}

export type CategoriaPostRequestBodyFinancas = Omit<CategoriaFinancas, "id" | "data_criacao" | "restaurante_ref">

export type CategoriaFirestorePostRequestBodyFinancas = Omit<CategoriaFinancas, "id" | "restaurante_ref"> & {
  restaurante_ref: DocumentReference 
}

export type Despesa = {
  id: string,
  categoria_ref: string,
  descricao: string,
  valor: number,
  data_criacao: Date
}

export type DespesaPostRequestBody = Omit<Despesa, "id" | "data_criacao" | "categoria_ref">

export type DespesaFirestorePostRequestBody = Omit<Despesa, "id" | "categoria_ref"> & {
  categoria_ref: DocumentReference
}