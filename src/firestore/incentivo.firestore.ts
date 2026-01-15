import { doc, getDocs, orderBy, query, runTransaction, updateDoc, where } from "firebase/firestore";
import { RestauranteSerivce } from "../auth/restaurante.service";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Funcionario } from "../schema/funcionario.schema";
import { Incentivo, IncentivoFirestorePostRequestBody, IncentivoFirestoreUpdateRequestBody, IncentivoPostRequestBody } from "../schema/incentivo.schema";
import { FuncionarioFirestore } from "./funcionario.firestore";
import { funcinoarioIncentivosFirestore } from "./funcionario.incentivo.firestore";
import { PatternFirestore } from "./pattern.firestore";

export class IncentivoFirestore extends PatternFirestore {

  constructor(
    private readonly restauranteService = new RestauranteSerivce(),
    private readonly funcionarioFirestore = new FuncionarioFirestore()
  ) {
    super(COLLECTIONS.INCENTIVO);
  }

  async criar(idRestaurante: string, body: IncentivoPostRequestBody, funcionarios: Funcionario[]) {
    const toSave: IncentivoFirestorePostRequestBody = {
      ...body,
      restaurante_ref: this.restauranteService.getRef(idRestaurante),
      status: true,
      data_adicao: new Date()
    }

    await runTransaction(this.firestore(), async (transaction) => {
      const idIncentivo = doc(this.setup());
      const ids = funcionarios.map((f) => f.id)
      await funcinoarioIncentivosFirestore.criar(transaction, idIncentivo.id, ids);

      transaction.set(idIncentivo, toSave);
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
        ...doc.data(),
        restaurante_ref: doc.data().restaurante_ref.id,
        ganhador_ref: doc.data().ganhador_ref.id,
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
        ...doc.data(),
        restaurante_ref: doc.data().restaurante_ref.id,
        ganhador_ref: doc.data().ganhador_ref?.id || null,
      } as Incentivo
    })

    return incentivos;
  }

  public async declararGanhador(incentivoObj: Incentivo, funcionario: Funcionario, idGanhador: string) {
    const toUpdate: Partial<IncentivoFirestoreUpdateRequestBody> = {
      ganhador_nome: funcionario.nome,
      ganhador_ref: funcinoarioIncentivosFirestore.getRef(idGanhador)
    }

    await runTransaction(this.firestore(), async (transaction) => {
      transaction.update(this.getRef(incentivoObj.id), {
        ...toUpdate
      })
      await funcinoarioIncentivosFirestore.enviarIncentivo(transaction, idGanhador, incentivoObj.valor_incentivo)
    })
  }

  public async cancelarGanhador(incentivoObj: Incentivo, idGanhador: string) {
    const toUpdate = {
      ganhador_nome: null,
      ganhador_ref: null,
    }

    await runTransaction(this.firestore(), async (transaction) => {
      // retirando as informações do ganhador do documento de incentivo
      transaction.update(this.getRef(incentivoObj.id), {
        ...toUpdate
      })

      // retirando o status de ganhador
      funcinoarioIncentivosFirestore.atualizar_EmTransacao(transaction, idGanhador, {
        ganhador: false,
      });

      const idFuncionario = (await funcinoarioIncentivosFirestore.encontrarPorId(idGanhador)).funcinoario_ref
      // retirando o ganho que foi para o documento do funcionário
      this.funcionarioFirestore.removerGanhoIncentivo(transaction, idFuncionario, {
        valor: incentivoObj.valor_incentivo,
        incentivo_ref: idGanhador
      })
    })
  }

  public async atualizar(idIncentivo: string, body: Partial<Incentivo>) {
    await updateDoc(this.getRef(idIncentivo), {
      ...body
    })
  }

}

export const incentivoFirestore = new IncentivoFirestore()