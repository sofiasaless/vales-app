import { DocumentReference } from "firebase/firestore"
import { GanhosIncentivo, Incentivo } from "./incentivo.schema"
import { Vale } from "./vale.shema"

export type Pagamento = {
  id: string,
  funcionario_ref: string,
  restaurante_ref: string,
  valor_pago: number,
  salario_atual: number,
  vales: Vale[],
  incentivo: GanhosIncentivo[],
  assinatura?: string,
  data_pagamento: Date
}

export type PagamentoPostRequestBody = Omit<Pagamento, "id" | "data_pagamento" | "funcionario_ref">

export type PagamentoFirestorePostRequestBody = Omit<Pagamento, "id" | "funcionario_ref" | "restaurante_ref"> & {
  funcionario_ref: DocumentReference,
  restaurante_ref: DocumentReference
}