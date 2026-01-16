import Feather from '@expo/vector-icons/Feather';
import { Button, Input, Layout, Radio, RadioGroup, Text } from "@ui-kitten/components";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { AvatarUpload } from "../components/AvatarUpload";
import { Container } from "../components/Container";
import { DatePicker } from "../components/DatePicker";
import { Header } from "../components/Header";
import { FuncionarioFirestore } from "../firestore/funcionario.firestore";
import { useGerenteConectado } from "../hooks/useGerente";
import { useRestauranteId } from "../hooks/useRestaurante";
import { FuncionarioPostRequestBody, TipoFuncionario } from "../schema/funcionario.schema";
import { uploadImage } from "../services/cloudnary.serivce";
import { customTheme } from "../theme/custom.theme";
import { converterParaDate } from "../util/datas.util";
import { validateCPF } from "../util/formatadores.util";

const emptyFuncionario: FuncionarioPostRequestBody = {
  nome: '',
  cargo: '',
  salario: 0,
  tipo: 'FIXO' as TipoFuncionario,
  dias_trabalhados_semanal: 0,
  cpf: '',
  data_admissao: new Date(),
  primeiro_dia_pagamento: 0,
  segundo_dia_pagamento: 0,
  vales: [],
  incentivo: [],
  restaurante_ref: '',
  foto_url: undefined
}

export const Cadastro = () => {
  const { data: gerente } = useGerenteConectado()

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FuncionarioPostRequestBody>(emptyFuncionario);

  const [dataAdmissao, setDataAdmissao] = useState<Date>(new Date)
  const settingAdmissao = (tipo: 'DATA' | 'HORA', dado?: string) => {
    if (tipo === 'DATA' && dado != undefined) {
      setDataAdmissao(converterParaDate(dado))
    }
  }

  const [dataNascimento, setDataNascimento] = useState<Date>(new Date)
  const settingNascimento = (tipo: 'DATA' | 'HORA', dado?: string) => {
    if (tipo === 'DATA' && dado != undefined) {
      setDataNascimento(converterParaDate(dado))
      setFormData((prev) => (({
        ...prev,
        data_nascimento: converterParaDate(dado)
      })))
    }
  }

  const calcularDiasDePagamento = () => {
    const dia1 = new Date(new Date().setDate(dataAdmissao.getDate() + 14));
    const dia2 = new Date(new Date().setDate(dia1.getDate() + 14));
    setFormData((prev) => (
      {
        ...prev,
        primeiro_dia_pagamento: dia1.getDate(),
        segundo_dia_pagamento: dia2.getDate()
      }
    ))
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCPFChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;

    if (digits.length > 9) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
        6,
        9
      )}-${digits.slice(9)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(
        3,
        6
      )}.${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }

    handleChange('cpf', formatted);
  };

  const handleSalaryChange = (value: string) => {
    let valor = Number(value)
    if (isNaN(valor)) {
      handleChange('salario', 0);
      return
    }
    handleChange('salario', valor);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.nome === '') newErrors.nome = 'Nome é obrigatório';
    if (formData.cargo === '') newErrors.cargo = 'Cargo é obrigatório';

    if (formData.tipo === 'DIARISTA') {
      if (formData.dias_trabalhados_semanal! <= 0) {
        newErrors.dias_trabalhados_semanal = 'Obrigatório';
      }
    }

    if (!formData.salario) {
      newErrors.salario = 'Salário é obrigatório';
    } else if (formData.salario <= 0) {
      newErrors.salario = 'Salário deve ser maior que zero';
    }

    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { data: id_res } = useRestauranteId()

  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async () => {
    setIsLoading(true)
    if (!validate()) {
      setIsLoading(false)
      return;
    }

    if (id_res?.uid) {
      formData.restaurante_ref = id_res.uid;
    }

    if (formData.foto_url) formData.foto_url = await uploadImage(formData.foto_url);

    try {
      const funcSer = new FuncionarioFirestore()
      await funcSer.criar(formData);
      setFormData(emptyFuncionario);
      console.info('sucesso ao cadastrar')
    } catch (error) {
      console.error(`erro ao cadastrar funcionario ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    (gerente?.tipo === 'AUXILIAR') ?
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <Feather name="x-circle" size={40} color={customTheme['color-danger-600']} />
        <Text category="h5">Não autorizado!</Text>
      </Layout>
      :
      <Container>
        <Header title="Novo funcionário" />

        <ScrollView contentContainerStyle={{padding: 16}}>

          <KeyboardAvoidingView style={styles.card} keyboardVerticalOffset={40}>
            <AvatarUpload value={formData.foto_url}
              onChange={(url) => handleChange('foto_url', url)}
            />

            <Input
              size="small"
              label="Nome Completo *"
              placeholder="Ex: Maria Silva"
              value={formData.nome}
              onChangeText={(v) => handleChange('nome', v)}
              status={errors.nome ? 'danger' : 'basic'}
              caption={errors.nome}
            />

            {/* Cargo */}
            <Input
              size="small"
              label="Cargo *"
              placeholder="Ex: Cozinheira"
              value={formData.cargo}
              onChangeText={(v) => handleChange('cargo', v)}
              status={errors.cargo ? 'danger' : 'basic'}
              caption={errors.cargo}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <Input
                style={{ flex: 1 }}
                size="small"
                label={
                  formData.tipo === 'DIARISTA'
                    ? 'Valor da Diária *'
                    : 'Salário Base *'
                }
                placeholder="0,00"
                keyboardType="numeric"
                value={formData.salario.toString()}
                onChangeText={handleSalaryChange}
                status={errors.salario ? 'danger' : 'basic'}
                caption={errors.salario}
                accessoryLeft={() => (
                  <Text style={{ marginHorizontal: 8 }}>R$</Text>
                )}
              />

              <Input
                style={{ display: (formData.tipo === 'DIARISTA') ? 'flex' : 'none' }}
                size="small"
                label={"Dias de trabalho p/ semana *"}
                placeholder="0"
                keyboardType="numeric"
                value={formData.dias_trabalhados_semanal?.toString() || ''}
                onChangeText={(v) => handleChange('dias_trabalhados_semanal', Number(v))}
                status={errors.dias_trabalhados_semanal ? 'danger' : 'basic'}
                caption={errors.dias_trabalhados_semanal}
              />
            </View>

            {/* CPF */}
            <Input
              size="small"
              label="CPF"
              placeholder="000.000.000-00"
              keyboardType="numeric"
              value={formData.cpf}
              onChangeText={handleCPFChange}
              status={errors.cpf ? 'danger' : 'basic'}
              caption={errors.cpf}
            />

            {/* Datas */}
            <View>
              <Text category="label" style={styles.label}>
                Data de nascimento
              </Text>
              <DatePicker dataPreEstabelecida={dataNascimento} tamanBtn="small" tipo="date" setarData={settingNascimento} />
            </View>

            <View>
              <Text category="label" style={styles.label}>
                Data de admissão
              </Text>
              <DatePicker dataPreEstabelecida={dataAdmissao} tamanBtn="small" tipo="date" setarData={settingAdmissao} />
            </View>

            {/* Payday */}
            <View style={styles.paymentDays}>
              <Input
                style={{ flex: 1 }}
                size="small"
                label="1° Dia do Pagamento"
                placeholder="4"
                value={(formData.primeiro_dia_pagamento === 0) ? '' : formData.primeiro_dia_pagamento.toString()}
                onChangeText={(v) => handleChange('primeiro_dia_pagamento', v)}
                accessoryLeft={() => (
                  <Text category="s2" style={{ marginHorizontal: 4 }}>Todo dia </Text>
                )}
              />

              <Input
                style={{ flex: 1 }}
                size="small"
                label="2° Dia do Pagamento"
                placeholder="19"
                value={(formData.segundo_dia_pagamento === 0) ? '' : formData.segundo_dia_pagamento.toString()}
                onChangeText={(v) => handleChange('segundo_dia_pagamento', v)}
                accessoryLeft={() => (
                  <Text category="s2" style={{ marginHorizontal: 4 }}>Todo dia </Text>
                )}
              />
            </View>

            <Button onPress={calcularDiasDePagamento} size="small" status="warning" appearance="ghost">Calcular dias de pagamento</Button>

            <View>
              <Text category="label" style={styles.label}>
                Tipo de Contrato
              </Text>

              <RadioGroup
                selectedIndex={formData.tipo === 'FIXO' ? 0 : 1}
                onChange={(index) =>
                  handleChange('tipo', index === 0 ? 'FIXO' : 'DIARISTA')
                }
              >
                <Radio>Fixo (Quinzenas)</Radio>
                <Radio>Diarista</Radio>
              </RadioGroup>
            </View>
          </KeyboardAvoidingView>

          <Button
            size="large"
            onPress={handleSubmit}
            style={styles.submit}
            disabled={isLoading}
          >
            {(isLoading) ? 'Contrantado...' : 'Cadastrar Funcionário'}
          </Button>
        </ScrollView>
      </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },

  card: {
    padding: 16,
    gap: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: customTheme["text-disabled-color"],
    borderRadius: 16,
    backgroundColor: customTheme["background-basic-color-4"]
  },

  label: {
    marginBottom: 8,
  },

  submit: {
    borderRadius: 12,
  },

  paymentDays: {
    flexDirection: 'row',
    gap: 10
  }
});
