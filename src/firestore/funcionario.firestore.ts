import { doc, setDoc } from "firebase/firestore";
import { Funcionario, FuncionarioPostRequestBody } from "../schema/funcionario.schema";
import { PatternFirestore } from "./pattern.firestore";
import { COLLECTIONS } from "../enums/firebase.enum";

export class FuncionarioFirestore extends PatternFirestore {
  
  constructor() {
    super(COLLECTIONS.FUNCIONARIOS)
  }

  public async criar(body: FuncionarioPostRequestBody) {
    const bodyToSave: Partial<Funcionario> = {
      ...body,
      data_cadastro: new Date(),
    }

    await setDoc(doc(this.setup()), bodyToSave);
  }

}