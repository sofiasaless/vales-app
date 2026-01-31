import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, runTransaction, setDoc, Transaction, updateDoc, where } from "firebase/firestore";
import { RestauranteSerivce } from "../auth/restaurante.service";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Funcionario, FuncionarioPostRequestBody } from "../schema/funcionario.schema";
import { GanhosIncentivo } from "../schema/incentivo.schema";
import { Vale, ValeFirestorePostRequestBody } from "../schema/vale.shema";
import { MenuFirestore } from "./menu.firestore";
import { PatternFirestore } from "./pattern.firestore";

export class FuncionarioFirestore extends PatternFirestore {

  private readonly restauranteService = new RestauranteSerivce()
  private readonly menuFirestore = new MenuFirestore()

  constructor() {
    super(COLLECTIONS.FUNCIONARIOS)
  }

  public async criar(body: FuncionarioPostRequestBody) {
    const bodyToSave = {
      ...body,
      restaurante_ref: this.restauranteService.getRef(body.restaurante_ref),
      data_cadastro: new Date(),
    }

    await setDoc(doc(this.setup()), bodyToSave);
  }

  public async listar(restauranteId: string): Promise<Funcionario[]> {
    const queryResult = await getDocs(
      query(
        this.setup(),
        where("restaurante_ref", "==", this.restauranteService.getRef(restauranteId)),
        orderBy('nome', 'asc')
      )
    );

    const funcionarios: Funcionario[] = queryResult.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      } as Funcionario
    })

    return funcionarios
  }

  public async encontrarPorId(id: string): Promise<Funcionario> {
    const result = await getDoc(doc(this.setup(), id))

    return {
      id: result.id,
      ...result.data()
    } as Funcionario
  }

  public async adicionarVale(idFuncionario: string, body: Vale) {
    let valeToSave: ValeFirestorePostRequestBody = {
      ...body,
      produto_ref: null
    }

    if (body.produto_ref) valeToSave.produto_ref = this.menuFirestore.getRef(body.produto_ref);

    await updateDoc(doc(this.setup(), idFuncionario), {
      vales: arrayUnion(valeToSave)
    })
  }

  public async adicionarMultiplosVales(id: string, body: Vale[]) {
    let valesToSave: ValeFirestorePostRequestBody[] = body.map((v) => {
      return {
        ...v,
        produto_ref: (v.produto_ref) ? this.menuFirestore.getRef(v.produto_ref) : null
      }
    })

    await updateDoc(doc(this.setup(), id), {
      vales: arrayUnion(valesToSave)
    })
  }

  public async removerVale(id: string, body: Vale) {
    await updateDoc(doc(this.setup(), id), {
      vales: arrayRemove(body)
    })
  }

  public adicionarGanhoIncentivo(transaction: Transaction, idFuncionario: string, incentivo: GanhosIncentivo) {
    transaction.update(this.getRef(idFuncionario), {
      incentivo: arrayUnion(incentivo)
    })

  }

  public removerGanhoIncentivo(transaction: Transaction, idFuncionario: string, incentivo: GanhosIncentivo) {
    transaction.update(this.getRef(idFuncionario), {
      incentivo: arrayRemove(incentivo)
    })

  }

  public async atualizar(id: string, payload: Partial<Funcionario>) {
    await updateDoc(doc(this.setup(), id), {
      ...payload
    })
  }

  public async excluir(idFunc: string) {
    await runTransaction(this.firestore(), async (transaction) => {
      // apagar históricos do funcionário
      const queryResult = await getDocs(
        query(
          collection(this.firestore(), COLLECTIONS.PAGAMENTOS),
          where("funcionario_ref", "==", this.getRef(idFunc)),
        )
      );

      queryResult.docs.map((docSnapshot) => {
        const ref = doc(collection(this.firestore(), COLLECTIONS.PAGAMENTOS), docSnapshot.id);
        transaction.delete(ref);
      })

      transaction.delete(this.getRef(idFunc))
    })

  }

}

export const funcionarioFirestore = new FuncionarioFirestore()