import { addDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { RestauranteSerivce } from "../auth/restaurante.service";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Incentivo, IncentivoFirestorePostRequestBody, IncentivoPostRequestBody } from "../schema/incentivo.schema";
import { PatternFirestore } from "./pattern.firestore";

export class IncentivoFirestore extends PatternFirestore {

  private readonly restauranteService = new RestauranteSerivce()

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

    await addDoc(this.setup(), toSave);
  }

  async listar(idRestaurante: string) {
    const queryResult = await getDocs(
      query(
        this.setup(),
        where("restaurante_ref", "==", this.restauranteService.getRef(idRestaurante)),
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

    const incentivos: Incentivo[] = queryResult.docs.map((doc) => {
      return {
        id: doc.id,
        restaurante_ref: doc.data().restaurante_ref.id,
        ...doc.data()
      } as Incentivo
    })

    return incentivos;
  }


}