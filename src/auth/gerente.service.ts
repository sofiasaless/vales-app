import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { PatternFirestore } from "../firestore/pattern.firestore";
import { Gerente } from "../schema/gerente.schema";

export class GerenteService extends PatternFirestore {

  constructor() {
    super(COLLECTIONS.GERENTES)
  }

  private restaurante_collection() {
    return collection(this.firestore(), COLLECTIONS.RESTAURENTES);
  }

  private gerente_collection(id_restaurante: string) {
    return collection(
      this.firestore(),
      COLLECTIONS.RESTAURENTES,
      id_restaurante,
      this.COLLECTION_NAME
    );
  }

  public async logar(idRestaurante: string, id: string, senha: string): Promise<Gerente> {
    const gerentesCollectionRef = this.gerente_collection(idRestaurante);
    const gerenteDoc = await getDoc(doc(gerentesCollectionRef, id))

    if (!gerenteDoc.exists()) throw new Error(`Gerente não encontrado`);

    if (!gerenteDoc.data().ativo) throw new Error(`Usuário desativado!`);

    // verificando se a senha bate
    if (gerenteDoc.data().senha !== senha) {
      throw new Error(`Senha incorreta`)
    }

    return {
      id: gerenteDoc.id,
      ...gerenteDoc.data()!
    } as Gerente
  }

}