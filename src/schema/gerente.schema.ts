import { DocumentReference } from "firebase/firestore"

export type TiposGerente = 'GERENTE' | 'AUXILIAR'

export type Gerente = {
  id: string,
  nome: string,
  tipo: TiposGerente,
  senha: string,
  restaurante_ref: string,
  ativo: boolean,
  data_ultimo_acesso?: Date,
  data_criacao: Date
}

export type GerentePostRequestBody = Omit<Gerente, "id" | "data_criacao" | "ativo" | "data_ultimo_acesso" | "restaurante_ref">

export type GerenteUpdateRequestBody = Omit<Gerente, "id" | "restaurante_ref" | "data_ultimo_acesso" | "data_criacao">

export type GerenteFirestorePostRequestBody = Omit<Gerente, "id" | "restaurante_ref"> & {
  restaurante_ref: DocumentReference
}