import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Gerente, GerentePostRequestBody } from "../schema/gerente.schema";
import { PatternFirestore } from "./pattern.firestore";

export class GerenteFirestore extends PatternFirestore {

  constructor() {
    super(COLLECTIONS.GERENTES)
  }

  private restaurante_collection() {
    return collection(this.firestore(), COLLECTIONS.RESTAURENTES);
  }

  private gerente_collection(idRestaurante: string) {
    return collection(
      this.firestore(),
      COLLECTIONS.RESTAURENTES,
      idRestaurante,
      this.COLLECTION_NAME
    );
  }

  public async criar(idRestaurante: string, body: GerentePostRequestBody) {
    const gerenteToSave = {
      ...body,
      data_criacao: new Date(),
      ativo: true,
      restaurante_ref: doc(this.restaurante_collection(), idRestaurante)
    }

    await addDoc(this.gerente_collection(idRestaurante), gerenteToSave)
  }

  public async listar(idRestaurante: string) {
    const gerentesRef = this.gerente_collection(idRestaurante);

    const snapshot = await getDocs(gerentesRef);

    const gerentes: Gerente[] = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as Gerente
    })

    return gerentes;
  }


}