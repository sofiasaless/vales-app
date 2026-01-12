import { addDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { RestauranteSerivce } from "../auth/restaurante.service";
import { COLLECTIONS } from "../enums/firebase.enum";
import { CategoriaFinancas, CategoriaFirestorePostRequestBodyFinancas, CategoriaPostRequestBodyFinancas } from "../schema/financa.schema";
import { PatternFirestore } from "./pattern.firestore";
import { converterTimestamp } from "../util/formatadores.util";

export class CategoriaFinancaFirestore extends PatternFirestore {

  private readonly restauranteService = new RestauranteSerivce()

  constructor() {
    super(COLLECTIONS.CATEGORIA_FINANCA);
  }

  public async criar(idRestaurante: string, body: CategoriaPostRequestBodyFinancas) {
    const bodyToSave: CategoriaFirestorePostRequestBodyFinancas = {
      ...body,
      data_criacao: new Date(),
      restaurante_ref: this.restauranteService.getRef(idRestaurante)
    }

    await addDoc(this.setup(), bodyToSave);
  }

  public async listar(idRestaurante: string) {
    try {
      const queryResult = await getDocs(
        query(
          this.setup(),
          where("restaurante_ref", "==", this.restauranteService.getRef(idRestaurante)),
          orderBy('descricao', 'desc')
        )
      );
  
      const categorias: CategoriaFinancas[] = queryResult.docs.map((c) => {
        return {
          ...c.data(),
          id: c.id,
          data_criacao: converterTimestamp(c.data().data_criacao),
          restaurante_ref: c.data().restaurante_ref.id
        } as CategoriaFinancas
      })
  
      return categorias
      
    } catch (error) {
      console.error(error)
    }
  }

}

export const categoriaFinancas = new CategoriaFinancaFirestore()