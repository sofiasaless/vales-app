import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { authFirebase } from "../config/firebase.config";
import { COLLECTIONS } from "../enums/firebase.enum";
import { PatternFirestore } from "../firestore/pattern.firestore";

export class AuthSerivce extends PatternFirestore {

  constructor() {
    super(COLLECTIONS.GERENTES);
  }

  private setupAuth() {
    return authFirebase;
  }

  public async logar(email: string, senha: string) {
    await signInWithEmailAndPassword(this.setupAuth(), email, senha);
  }

  public async registrar(nome: string, senha: string) {
    try {
      let email = `${nome}@upbusiness.com`

      const authResult = (await createUserWithEmailAndPassword(this.setupAuth(), email, senha)).user;

      const gerenteToSave = {
        estabelecimento_nome: 'Café Ilhas Java',
        nome: nome,
        email: email,
        data_criacao: new Date,
      }

      await setDoc(doc(this.setup(), authResult.uid), gerenteToSave);
      console.info('registrado com sucesso')
    } catch (error: any) {
      console.error(error)
      throw new Error(error)
    }
  }

  public getUsuarioLogado() {
    return this.setupAuth().currentUser;
  }

  public getRef() {
    return doc(this.setup(), '5ZgfLpdgaEZbAlq5Bf9Bs0qf5Fw1')
  }

}