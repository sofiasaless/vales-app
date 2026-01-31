import { addDoc, getDocs, orderBy, query, Transaction, where } from "firebase/firestore";
import { RestauranteSerivce } from "../auth/restaurante.service";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Pagamento, PagamentoFirestorePostRequestBody, PagamentoPostRequestBody } from "../schema/pagamento.schema";
import { converterTimestamp } from "../util/formatadores.util";
import { FuncionarioFirestore } from "./funcionario.firestore";
import { PatternFirestore } from "./pattern.firestore";
import { DateFilterProps } from "./despesa.firestore";

export class PagamentoFirestore extends PatternFirestore {

  private readonly restauranteService = new RestauranteSerivce()
  private readonly funcionarioFirestore = new FuncionarioFirestore()

  constructor() {
    super(COLLECTIONS.PAGAMENTOS)
  }

  public async criar(idFunc: string, body: PagamentoPostRequestBody) {
    const bodyToSave: PagamentoFirestorePostRequestBody = {
      ...body,
      funcionario_ref: this.funcionarioFirestore.getRef(idFunc),
      restaurante_ref: this.restauranteService.getRef(body.restaurante_ref),
      data_pagamento: new Date()
    }

    await addDoc(this.setup(), bodyToSave);

    await this.funcionarioFirestore.atualizar(idFunc, {
      vales: [],
      incentivo: []
    })
  }

  public async listar(idFunc: string, datas: DateFilterProps): Promise<Pagamento[]> {
    try {
      const queryResult = await getDocs(
        query(
          this.setup(),
          where("funcionario_ref", "==", this.funcionarioFirestore.getRef(idFunc)),
          where("data_pagamento", ">=", datas.dataInicio),
          where("data_pagamento", "<=", datas.dataFim),
          orderBy('data_pagamento', 'desc')
        )
      );

      const pagamentos: Pagamento[] = queryResult.docs.map((doc) => {
        return {
          id: doc.id,
          data_pagamento: converterTimestamp(doc.data().data_pagamento),
          ...doc.data()
        } as Pagamento
      })

      return pagamentos
    } catch (error) {
      console.error(error)
      return []
    }
  }
  
}

export const pagamentoFirestore = new PagamentoFirestore()