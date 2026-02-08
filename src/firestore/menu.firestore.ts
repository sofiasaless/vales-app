import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { PatternFirestore } from "./pattern.firestore";
import { ItemMenu, ItemMenuFirestorePostRequestBody, ItemMenuPostRequestBody } from "../schema/menu.schema";
import { itensCardapio } from "./cardapio";
import { RestauranteSerivce } from "../auth/restaurante.service";
import { itensNobres } from "../../cardapionob";

export class MenuFirestore extends PatternFirestore {
  private readonly restauranteService = new RestauranteSerivce()
  
  constructor() {
    super(COLLECTIONS.MENU);
  }

  public async listar(idRestaurante: string){
    try {
      const querySnap = await getDocs(
        query(
          this.setup(),
          where("restaurante_ref", "==", this.restauranteService.getRef(idRestaurante)),
          orderBy("descricao", "asc")
        )
      )
  
      const itens: ItemMenu[] = querySnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as ItemMenu
      })
  
      return itens
    } catch (error) {
      console.error(error)
    }
  }

  public async remover(idItem: string) {
    await deleteDoc(doc(this.setup(), idItem));
  }

  public async cadastrar() {

    console.info('itens cadastrados com sucesso')
  }

  public async adicionar(idRestaurante: string, body: ItemMenuPostRequestBody) {
    const itemToSave: ItemMenuFirestorePostRequestBody = {
      ...body,
      data_criacao: new Date(),
      restaurante_ref: this.restauranteService.getRef(idRestaurante),
    }

    await addDoc(this.setup(), itemToSave)
  }

  public async atualizar(idItem: string, body: ItemMenuPostRequestBody) {
    await updateDoc(doc(this.setup(), idItem), {
      descricao: body.descricao,
      preco: body.preco
    })
  }

  public getRef(id: string) {
    return doc(this.setup(), id);
  }
}

export const menuFirestore = new MenuFirestore()