import { DocumentReference } from "firebase/firestore"

export type ItemMenu = {
  id: string,
  descricao: string,
  preco: number,
  restaurante_ref: string,
  data_criacao: Date
}

export type ItemMenuPostRequestBody = Omit<ItemMenu, "id" | "data_criacao">

export type ItemMenuFirestorePostRequestBody = Omit<ItemMenu, "id" | "restaurante_ref"> & {
  restaurante_ref: DocumentReference
}