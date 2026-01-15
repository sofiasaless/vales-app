import { doc, getDoc, getDocs, increment, query, Transaction, updateDoc, where } from "firebase/firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { FuncionarioIncentivo, FuncionarioIncentivoFirestorePostRequestBody } from "../schema/funcionario.incentivo.schema";
import { PatternFirestore } from "./pattern.firestore";
import { incentivoFirestore } from "./incentivo.firestore";
import { funcionarioFirestore } from "./funcionario.firestore";

export class FuncionarioIncentivosFirestore extends PatternFirestore {

  constructor() {
    super(COLLECTIONS.FUNCIONARIOS_INCENTIVOS);
  }

  public async criar(transaction: Transaction, idIncentivo: string, idsFuncionarios: string[]) {
    idsFuncionarios.map((id) => {
      const toSave: FuncionarioIncentivoFirestorePostRequestBody = {
        contador: 0,
        data_criacao: new Date(),
        ganhador: false,
        incentivo_ref: incentivoFirestore.getRef(idIncentivo),
        funcinoario_ref: funcionarioFirestore.getRef(id)
      }

      transaction.set(doc(this.setup()), {
        ...toSave
      })
    })
  }

  public async incrementarContador(idFuncIncent: string, valor: number) {
    await updateDoc(this.getRef(idFuncIncent), {
      contador: increment(valor)
    })
  }

  public async atualizar(idFuncIncent: string,
    body: Partial<FuncionarioIncentivoFirestorePostRequestBody>
  ) {
    await updateDoc(this.getRef(idFuncIncent), {
      ...body
    })
  }

  public async atualizar_EmTransacao(transaction: Transaction, idFuncIncent: string,
    body: Partial<FuncionarioIncentivoFirestorePostRequestBody>
  ) {
    transaction.update(this.getRef(idFuncIncent), {
      ...body
    })
  }

  public async enviarIncentivo(
    transaction: Transaction,
    idFuncIncent: string,
    valor: number,
  ) {
    const idFuncionario = (await this.encontrarPorId(idFuncIncent)).funcinoario_ref;

    transaction.update(this.getRef(idFuncIncent), {
      ganhador: true
    })

    funcionarioFirestore.adicionarGanhoIncentivo(transaction, idFuncionario, {
      incentivo_ref: idFuncIncent,
      valor: valor
    })
  }

  public async encontrarPorId(idFuncIncentivo: string) {
    console.info(idFuncIncentivo);
    const docSnap = await getDoc(this.getRef(idFuncIncentivo));

    if (!docSnap.exists()) {
      throw new Error('Incentivo não encontrado');
    }

    const data = docSnap.data();

    if (!data?.funcinoario_ref) {
      throw new Error('funcinoario_ref não existe no incentivo');
    }

    if (!data.funcinoario_ref.id) {
      throw new Error('funcinoario_ref não é um DocumentReference válido');
    }

    return {
      id: docSnap.id,
      ...data,
      funcinoario_ref: data.funcinoario_ref.id,
      funcionario_obj: await funcionarioFirestore.encontrarPorId(
        data.funcinoario_ref.id
      ),
    } as FuncionarioIncentivo;
  }

  public async listar(idIncentivo: string) {
    const snap = await getDocs(
      query(
        this.setup(),
        where("incentivo_ref", "==", incentivoFirestore.getRef(idIncentivo))
      )
    )

    const funcionariosEmIncentivo: FuncionarioIncentivo[] = []
    await Promise.all(
      snap.docs.map(async (doc) => {
        funcionariosEmIncentivo.push({
          id: doc.id,
          ...doc.data(),
          funcinoario_ref: doc.data().funcinoario_ref.id,
          funcionario_obj: await funcionarioFirestore.encontrarPorId(doc.data().funcinoario_ref.id),
        } as FuncionarioIncentivo)
      })
    );

    return funcionariosEmIncentivo
  }

}

export const funcinoarioIncentivosFirestore = new FuncionarioIncentivosFirestore()