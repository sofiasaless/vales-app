import { Button, Layout } from "@ui-kitten/components"
import { RestauranteSerivce } from "../auth/restaurante.service"
import { GerenteFirestore } from "../firestore/gerente.firestore"

export const Config = () => {
  return (
    <Layout style={{flex: 1, justifyContent: 'center', gap: 20}}>
      <Button
        onPress={() => {
          const restSer = new RestauranteSerivce()
          restSer.registrar('cafeilhasjava', '123456')
        }}
      >Registrar restaurante</Button>

      <Button
        onPress={() => {
          console.info('clicando')
          const gerSer = new GerenteFirestore()
          gerSer.criar('Az7xUZaL0IQDPp85bu9JDYB6DPE3', {
            nome: 'Java',
            senha: '1234',
            tipo: 'GERENTE'
          })
        }}
      >Registrar gerente</Button>
    </Layout>
  )
}