import { getDocs, orderBy, query, where } from "firebase/firestore";
import { RestauranteSerivce } from "../auth/restaurante.service";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Mensalidade } from "../schema/mensalidade.schema";
import { PatternFirestore } from "./pattern.firestore";

export class MensalidadeFirestore extends PatternFirestore {
  private readonly restauranteService = new RestauranteSerivce()

  constructor() {
    super(COLLECTIONS.MENSALIDADE)
  }

  async criar() {
  }

  async listar(idRest: string) {
    try {
      const querySnap = await getDocs(
        query(
          this.setup(),
          where("restaurante_ref", "==", this.restauranteService.getRef(idRest)),
          orderBy("data_vencimento", "desc")
        )
      )

      const mensalidades: Mensalidade[] = querySnap.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          restaurante_ref: doc.data().restaurante_ref?.id || '',
        } as Mensalidade
      })

      return mensalidades
    } catch (error) {
      console.error(error)
    }
  }
}

export const mensalidadeFirestore = new MensalidadeFirestore()