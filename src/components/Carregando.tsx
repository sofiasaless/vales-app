import { Layout, Spinner } from "@ui-kitten/components";

export function Carregando() {
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Spinner />
    </Layout>
  )
}