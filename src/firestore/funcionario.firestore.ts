import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { Funcionario, FuncionarioPostRequestBody } from "../schema/funcionario.schema";
import { PatternFirestore } from "./pattern.firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Vale } from "../schema/vale.shema";
import { RestauranteSerivce } from "../auth/restaurante.service";

export class FuncionarioFirestore extends PatternFirestore {

  private readonly restauranteService = new RestauranteSerivce()

  constructor() {
    super(COLLECTIONS.FUNCIONARIOS)
  }

  public async criar(body: FuncionarioPostRequestBody) {
    const bodyToSave = {
      ...body,
      gerente_ref: this.restauranteService.getRef(),
      data_cadastro: new Date(),
    }

    await setDoc(doc(this.setup()), bodyToSave);
  }

  public async listar(): Promise<Funcionario[]> {
    const queryResult = await getDocs(
      query(
        this.setup(),
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

  public async adicionarVale(id: string, body: Vale) {
    await updateDoc(doc(this.setup(), id), {
      vales: arrayUnion(body)
    })
  }

  public async removerVale(id: string, body: Vale) {
    await updateDoc(doc(this.setup(), id), {
      vales: arrayRemove(body)
    })
  }

  public async atualizar(id: string, payload: Partial<Funcionario>) {
    await updateDoc(doc(this.setup(), id), {
      ...payload    
    })
  }

  public async excluir(id: string) {
    await deleteDoc(doc(this.setup(), id));
  }

}