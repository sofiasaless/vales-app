import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { PatternFirestore } from "./pattern.firestore";
import { ItemMenu, ItemMenuFirestorePostRequestBody, ItemMenuPostRequestBody } from "../schema/menu.schema";
import { itensCardapio } from "./cardapio";
import { RestauranteSerivce } from "../auth/restaurante.service";

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
          where("restaurante_ref", "==", this.restauranteService.getRef(idRestaurante))
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
    itensCardapio.map(async (item) => {
      const itemToSave: ItemMenuFirestorePostRequestBody = {
        ...item,
        restaurante_ref: this.restauranteService.getRef('Az7xUZaL0IQDPp85bu9JDYB6DPE3'),
        data_criacao: new Date()
      }

      await addDoc(this.setup(), itemToSave);
    })

    console.info('itens cadastrados com sucesso')
  }

  public async adicionar(body: ItemMenuPostRequestBody) {
    const itemToSave: ItemMenuFirestorePostRequestBody = {
      ...body,
      data_criacao: new Date(),
      restaurante_ref: this.restauranteService.getRef(body.restaurante_ref),
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