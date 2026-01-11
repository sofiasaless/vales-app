import { DocumentReference } from "firebase/firestore"
import { Incentivo } from "./incentivo.schema"
import { Vale } from "./vale.shema"

export type Pagamento = {
  id: string,
  funcionario_ref: string,
  valor_pago: number,
  vales: Vale[],
  incentivo: Incentivo[],
  data_pagamento: Date
}

export type PagamentoPostRequestBody = Omit<Pagamento, "id" | "data_pagamento">

export type PagamentoFirestorePostRequestBody = Omit<Pagamento, "id" | "data_pagamento" | "funcionario_ref"> & {
  funcionario_ref: DocumentReference
}