import { arrayRemove, arrayUnion, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
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
      await updateDoc(this.getRef(idRestaurante), {
        pushTokens: arrayUnion(token)
      })
      return
    }
    console.info('removendo de onde estava ', snap.docs[0].id)
    await updateDoc(this.getRef(snap.docs[0].id), {
      pushTokens: arrayRemove(token)
    })

    console.info('adicionadno no novo restaurante ', idRestaurante)
    await updateDoc(this.getRef(idRestaurante), {
      pushTokens: arrayUnion(token)
    })


  }
}

export const restauranteFirestore = new RestarautenFirestore()