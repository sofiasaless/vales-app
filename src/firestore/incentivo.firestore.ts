import { addDoc, doc, getDocs, orderBy, query, runTransaction, updateDoc, where } from "firebase/firestore";
import { RestauranteSerivce } from "../auth/restaurante.service";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Incentivo, IncentivoFirestorePostRequestBody, IncentivoFirestoreUpdateRequestBody, IncentivoPostRequestBody } from "../schema/incentivo.schema";
import { PatternFirestore } from "./pattern.firestore";
import { FuncionarioFirestore } from "./funcionario.firestore";

export class IncentivoFirestore extends PatternFirestore {

  private readonly restauranteService = new RestauranteSerivce()
  private readonly funcionarioFirestore = new FuncionarioFirestore()

  constructor() {
    super(COLLECTIONS.INCENTIVO);
  }

  async criar(idRestaurante: string, body: IncentivoPostRequestBody) {    
    const toSave: IncentivoFirestorePostRequestBody = {
      ...body,
      restaurante_ref: this.restauranteService.getRef(idRestaurante),
      status: true,
      data_adicao: new Date()
    }

    await runTransaction(this.firestore(), async (transaction) => {
      await this.funcionarioFirestore.removerIncentivos(transaction)
      
      transaction.set(doc(this.setup()), toSave);
    })
  }

  async listar(idRestaurante: string, status: boolean = false) {    
    const queryResult = await getDocs(
      query(
        this.setup(),
        where("restaurante_ref", "==", this.restauranteService.getRef(idRestaurante)),
        where("status", "==", status),
        orderBy('data_adicao', 'desc')
      )
    );

    const incentivos: Incentivo[] = queryResult.docs.map((doc) => {
      return {
        id: doc.id,
        restaurante_ref: doc.data().restaurante_ref.id,
        ...doc.data()
      } as Incentivo
    })

    return incentivos;
  }

  async encontrarPorStatus(idRestaurante: string, status: boolean) {
    const queryResult = await getDocs(
      query(
        this.setup(),
        where("restaurante_ref", "==", this.restauranteService.getRef(idRestaurante)),
        where("status", "==", status),
        orderBy('data_adicao', 'desc')
      )
    );

    if (queryResult.empty) return [];

    const incentivos: Incentivo[] = queryResult.docs.map((doc) => {
      return {
        id: doc.id,
        restaurante_ref: doc.data().restaurante_ref.id,
        ...doc.data()
      } as Incentivo
    })

    return incentivos;
  }

  public async declararGanhador(idIncentivo: string, nomeGanhador: string, idGanhador: string) {
    const toUpdate: Partial<IncentivoFirestoreUpdateRequestBody> = {
      ganhador_nome: nomeGanhador,
      ganhador_ref: this.funcionarioFirestore.getRef(idGanhador)
    }
    
    await updateDoc(this.getRef(idIncentivo), {
      ...toUpdate
    })

    await this.funcionarioFirestore.adicionarIncentivo(idGanhador);
  }

  public async encerrar(idIncentivo: string) {
    await updateDoc(this.getRef(idIncentivo), {
      status: false
    })
    
    // await runTransaction(this.firestore(), async (transaction) => {
    //   await this.funcionarioFirestore.removerIncentivos(transaction, idGanhador)
      
    //   transaction.update(this.getRef(idIncentivo), {
    //     status: false
    //   })
    // })
  }

}

export const incentivoFirestore = new IncentivoFirestore()