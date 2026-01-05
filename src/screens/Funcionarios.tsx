import { StyleSheet } from "react-native";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { ListaFuncionarios } from "../components/ListaFuncionarios";

export const Funcionarios = () => {

  return (
    <Container>
      <Header title="Funcionários" subtitle="3 cadastrados" />
      <ListaFuncionarios />
    </Container>
  )
}

const styles = StyleSheet.create({

});