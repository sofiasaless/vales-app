import { ScrollView, StyleSheet, View } from "react-native";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { CardGradient } from "../components/CardGradient";
import { Button, Input, Layout, Radio, RadioGroup, Text } from "@ui-kitten/components";
import { EmployeeType } from "../types";
import { useState } from "react";
import { parseCurrencyInput, validateCPF } from "../util/formatadores.util";
import { customTheme } from "../theme/custom.theme";

const paydayOptions = [5, 10, 15, 20, 25, 30];

export const Cadastro = () => {

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    baseSalary: '',
    type: 'FIXO' as EmployeeType,
    cpf: '',
    birthDate: '',
    admissionDate: '',
    payday: 5,
  });

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
    handleChange('baseSalary', value.replace(/[^\d,]/g, ''));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.role.trim()) newErrors.role = 'Cargo é obrigatório';

    if (!formData.baseSalary) {
      newErrors.baseSalary = 'Salário é obrigatório';
    } else if (parseCurrencyInput(formData.baseSalary) <= 0) {
      newErrors.baseSalary = 'Salário deve ser maior que zero';
    }

    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  return (
    <Container>
      <Header title="Novo funcionário" subtitle="Preencha os dados" />
      <Layout level="1" style={{ flex: 1 }}>

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Input
              size="small"
              label="Nome Completo *"
              placeholder="Ex: Maria Silva"
              value={formData.name}
              onChangeText={(v) => handleChange('name', v)}
              status={errors.name ? 'danger' : 'basic'}
              caption={errors.name}
            />

            {/* Cargo */}
            <Input
              size="small"
              label="Cargo *"
              placeholder="Ex: Cozinheira"
              value={formData.role}
              onChangeText={(v) => handleChange('role', v)}
              status={errors.role ? 'danger' : 'basic'}
              caption={errors.role}
            />

            {/* Tipo */}
            <View>
              <Text category="label" style={styles.label}>
                Tipo de Contrato
              </Text>

              <RadioGroup
                selectedIndex={formData.type === 'FIXO' ? 0 : 1}
                onChange={(index) =>
                  handleChange('type', index === 0 ? 'FIXO' : 'DIARISTA')
                }
              >
                <Radio>Fixo (Quinzenas)</Radio>
                <Radio>Diarista</Radio>
              </RadioGroup>
            </View>

            {/* Salário */}
            <Input
              size="small"
              label={
                formData.type === 'DIARISTA'
                  ? 'Valor da Diária *'
                  : 'Salário Base *'
              }
              placeholder="0,00"
              keyboardType="numeric"
              value={formData.baseSalary}
              onChangeText={handleSalaryChange}
              status={errors.baseSalary ? 'danger' : 'basic'}
              caption={errors.baseSalary}
              accessoryLeft={() => (
                <Text style={{ marginHorizontal: 8 }}>R$</Text>
              )}
            />

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
            <Input
              size="small"
              label="Data de Nascimento"
              placeholder="YYYY-MM-DD"
              value={formData.birthDate}
              onChangeText={(v) => handleChange('birthDate', v)}
            />

            <Input
              size="small"
              label="Data de Admissão"
              placeholder="YYYY-MM-DD"
              value={formData.admissionDate}
              onChangeText={(v) => handleChange('admissionDate', v)}
            />

            {/* Payday */}
            <View style={styles.paymentDays}>
              <Input
                style={{flex: 1}}
                size="small"
                label="1° Dia do Pagamento"
                placeholder="Todo dia 4"
                // value={formData.d}
                onChangeText={(v) => handleChange('birthDate', v)}
              />

              <Input
                style={{flex: 1}}
                size="small"
                label="2° Dia do Pagamento"
                placeholder="Todo dia 19"
                // value={formData.d}
                onChangeText={(v) => handleChange('birthDate', v)}
              />
            </View>

            <Button size="small" appearance="outline">Calcular dias de pagamento</Button>
          </View>

          <Button
            size="large"
            // onPress={handleSubmit}
            // accessoryLeft={<UserPlus size={18} />}
            style={styles.submit}
          >
            Cadastrar Funcionário
          </Button>
        </ScrollView>
      </Layout>
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
