import { arrayUnion, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Restaurante } from "../schema/restaurante.schema";
import { PatternFirestore } from "./pattern.firestore";

export class RestarautenFirestore extends PatternFirestore {
  constructor() {
    super(COLLECTIONS.RESTAURENTES);
  }

  public async encontrarPorId(id: string): Promise<Restaurante> {
    const docF = await getDoc(doc(this.setup(), id));
  
    return {
      id: docF.id,
      ...docF.data()
    } as Restaurante
  }

  public async atualizarPushToken(idRestaurante: string, token: string) {
    // primeiro verificar se o token ja nao foi salvo no doc do restaurante, pra nao salvar duas vezes...
    const snap = await getDocs(
      query(
        this.setup(),
        where("pushTokens", "array-contains", token)
      )
    )
    
    if (snap.empty) {
      // console.info('token nao existe, entao registra no restaurante indicado')
      await updateDoc(this.getRef(idRestaurante), {
        pushTokens: arrayUnion(token)
      })
      return
    }
    
  }
}

export const restauranteFirestore = new RestarautenFirestore()