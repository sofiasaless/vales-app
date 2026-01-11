import { doc, getDoc } from "firebase/firestore";
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
}