import { Button, Layout } from "@ui-kitten/components"
import { RestauranteSerivce } from "../auth/restaurante.service"
import { GerenteFirestore } from "../firestore/gerente.firestore"
import { MenuFirestore } from "../firestore/menu.firestore"
import { mensalidadeFirestore } from "../firestore/mensalidade.firestore"

export const Config = () => {
  return (
    <Layout style={{flex: 1, justifyContent: 'center', gap: 20}}>
      <Button
        onPress={() => {
          const restSer = new RestauranteSerivce()
          restSer.registrar('padariapaodemel', '123456')
        }}
      >Registrar restaurante</Button>

      <Button
        onPress={() => {
          console.info('clicando')
          const gerSer = new GerenteFirestore()
          gerSer.criar('q8E49B6oeiPEKFzXpXH0lL5yYPX2', {
            nome: 'Miau',
            senha: '1234',
            tipo: 'GERENTE'
          })
        }}
      >Registrar gerente</Button>

      <Button onPress={() => {
        const menuFir = new MenuFirestore()
        menuFir.cadastrar()
      }}>registrar cardápio</Button>

      <Button onPress={() => {
        mensalidadeFirestore.criar()
      }}>criar mensalidades</Button>
    </Layout>
  )
}