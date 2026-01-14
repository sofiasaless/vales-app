import { DocumentReference } from "firebase/firestore"

export type Incentivo = {
  id: string,
  valor_incentivo: number,
  descricao: string,
  meta: number,
  restaurante_ref: string,
  status: boolean,
  data_expiracao: Date,
  ganhador_nome?: string,
  ganhador_ref?: string,
  data_adicao: Date
}

export type IncentivoPostRequestBody = Omit<Incentivo, "id" | "data_adicao" | "restaurante_ref" | "status" | "ganhador_nome" | "ganhador_ref">

export type IncentivoFirestorePostRequestBody = Omit<Incentivo, "id" | "ganhador_nome" | "ganhador_ref" | "restaurante_ref"> & {
  restaurante_ref: DocumentReference
}

export type IncentivoUpdateRequestBody = Pick<Incentivo, "data_expiracao" | "descricao" | "valor_incentivo" | "meta" | "ganhador_nome" | "status" | "ganhador_ref">

export type IncentivoFirestoreUpdateRequestBody = Omit<IncentivoUpdateRequestBody, "ganhador_ref"> & {
  ganhador_ref: DocumentReference
}

// atributos que ficará salvo no funcionário
export type IncentivoFuncionario = {
  contador: number,
  incentivo_ref: string,
  ganhador: boolean
}

export type IncentivoFuncionarioFirestorePostRequestBody = Omit<IncentivoFuncionario, "incentivo_ref"> & {
  incentivo_ref: DocumentReference
}

// atributos que ficará salvo no funcionário
export type GanhosIncentivo = {
  valor: number;
  incentivo_ref: string;
}

export type GanhoIncentivoFirestorePostResquestBody = Omit<GanhosIncentivo, "incentivo_ref"> & {
  incentivo_ref: DocumentReference
}