import { collection, doc } from "firebase/firestore";
import { firestore } from "../config/firebase.config";

export abstract class PatternFirestore {

  protected COLLECTION_NAME: string

  constructor(collection_name: string) {
    this.COLLECTION_NAME = collection_name;
    this.setup();
  }

  setup(){
    return collection(firestore, this.COLLECTION_NAME);
  }

  firestore() {
    return firestore
  }

  public getRef(id: string) {
    return doc(this.setup(), id);
  }

}