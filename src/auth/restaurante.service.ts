import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { PatternFirestore } from "../firestore/pattern.firestore";
import { Restaurante } from "../schema/restaurante.schema";
import { auth } from "../config/firebase.config";

export class RestauranteSerivce extends PatternFirestore {

  constructor() {
    super(COLLECTIONS.RESTAURENTES);
  }

  private setupAuth() {
    return auth;
  }

  public async logar(email: string, senha: string) {
    return (await signInWithEmailAndPassword(this.setupAuth(), email, senha)).user;
  }

  public async registrar(nome: string, senha: string) {
    try {
      let email = `${nome}@upbusiness.com`

      const authResult = (await createUserWithEmailAndPassword(this.setupAuth(), email, senha)).user;

      const restauranteToSave: Restaurante = {
        ativo: true,
        data_criacao: new Date(),
        email,
        nome_fantasia: 'Café Ilhas Java'
      }

      await setDoc(doc(this.setup(), authResult.uid), restauranteToSave);
    } catch (error: any) {
      console.error(error)
      throw new Error(error)
    }
  }

  public getRestauranteLogado() {
    return this.setupAuth().currentUser;
  }

  public getRef() {
    return doc(this.setup(), '')
  }

}