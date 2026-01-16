import { DocumentReference } from "firebase/firestore"
import { Funcionario } from "./funcionario.schema"

export type FuncionarioIncentivo = {
  id: string,
  ganhador: boolean,
  contador: number,
  incentivo_ref: string,
  funcinoario_ref: string,
  funcionario_obj?: Funcionario,
  data_criacao: Date
}

export type FuncionarioIncentivoFirestorePostRequestBody = Omit<FuncionarioIncentivo, "id" | "incentivo_ref" | "funcinoario_ref"> & {
  funcinoario_ref: DocumentReference,
  incentivo_ref: DocumentReference
}

export type FuncionarioIncentivoUpdateRequestBody = Pick<FuncionarioIncentivo, "contador" | "ganhador">