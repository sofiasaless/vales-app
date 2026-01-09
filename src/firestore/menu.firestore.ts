import { addDoc, collection, doc, getDocs, query, where } from "firebase/firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { PatternFirestore } from "./pattern.firestore";
import { ItemMenu } from "../schema/menu.schema";
import { itensCardapio } from "./cardapio";

export class MenuFirestore extends PatternFirestore {
  constructor() {
    super(COLLECTIONS.MENU);
  }

  public async listar(idGerente: string){
    const querySnap = await getDocs(
      query(
        this.setup(),
        where("gerente_ref", "==", doc(collection(this.firestore(), COLLECTIONS.GERENTES), idGerente))
      )
    )

    const itens: ItemMenu[] = querySnap.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      } as ItemMenu
    })

    return itens
  }

  public async cadastrar() {
    itensCardapio.map(async (item) => {
      const itemToSave = {
        ...item,
        gerente_ref: doc(collection(this.firestore(), COLLECTIONS.GERENTES), item.gerente_ref),
        data_criacao: new Date()
      }

      await addDoc(this.setup(), itemToSave);
    })

    console.info('itens cadastrados com sucesso')
  }
}