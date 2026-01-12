import { addDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { COLLECTIONS } from "../enums/firebase.enum";
import { Despesa, DespesaFirestorePostRequestBody, DespesaPostRequestBody } from "../schema/financa.schema";
import { CategoriaFinancaFirestore } from "./categoriaFinanca.firestore";
import { PatternFirestore } from "./pattern.firestore";
import { RestauranteSerivce } from "../auth/restaurante.service";

export interface DateFilterProps {
  dataInicio: Date,
  dataFim: Date
}

export class DespesaFirestore extends PatternFirestore {

  private readonly categoriaFinancaFirestore = new CategoriaFinancaFirestore()
  private readonly restauranteService = new RestauranteSerivce()

  constructor() {
    super(COLLECTIONS.DESPESA);
  }

  public async criar(idCategoria: string, body: DespesaPostRequestBody) {
    const bodyToSave: DespesaFirestorePostRequestBody = {
      ...body,
      data_criacao: new Date(),
      categoria_ref: this.categoriaFinancaFirestore.getRef(idCategoria)
    }

    await addDoc(this.setup(), bodyToSave);
  }

  public async listar(idCategoria: string, datasFilter: DateFilterProps) {
    const queryResult = await getDocs(
      query(
        this.setup(),
        where("categoria_ref", "==", this.categoriaFinancaFirestore.getRef(idCategoria)),
        where("data_criacao", ">=", datasFilter.dataInicio),
        where("data_criacao", "<=", datasFilter.dataFim),
        orderBy('data_criacao', 'desc')
      )
    );

    const despesas: Despesa[] = queryResult.docs.map((c) => {
      return {
        id: c.id,
        ...c.data()
      } as Despesa
    })

    return despesas
  }

  public async listarDeTodasCategorias(idRestaurante: string, datasFilter: DateFilterProps) {
    const categoriasSnap = await getDocs(
      query(
        this.categoriaFinancaFirestore.setup(),
        where("restaurante_ref", "==", this.restauranteService.getRef(idRestaurante))
      )
    )

    const despesas: Despesa[] = []

    await Promise.all(
      categoriasSnap.docs.map(async (c) => {
        const despesasEncontradas = await getDocs(
          query(
            this.setup(),
            where("categoria_ref", "==", this.categoriaFinancaFirestore.getRef(c.id)),
            where("data_criacao", ">=", datasFilter.dataInicio),
            where("data_criacao", "<=", datasFilter.dataFim)
          )
        )

        despesasEncontradas.docs.forEach((d) => {
          despesas.push({
            id: d.id,
            ...(d.data() as Omit<Despesa, "id">),
          })
        })
      })
    )

    return despesas
  }


}

export const despesaFirestore = new DespesaFirestore()