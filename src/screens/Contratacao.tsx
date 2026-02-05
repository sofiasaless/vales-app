import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { Button, Input, Layout, Radio, RadioGroup, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Container } from "../components/Container";
import { FuncionarioFirestore } from "../firestore/funcionario.firestore";
import { RootStackParamList } from "../routes/StackRoutes";
import { FuncionarioPostRequestBody } from "../schema/funcionario.schema";
import { customTheme } from "../theme/custom.theme";

export const Contratacao = () => {
  const route = useRoute();
  const { funcObj } = route.params as { funcObj: FuncionarioPostRequestBody };

  const navigator = useNavigation<NavigationProp<RootStackParamList>>();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<{
    regimeClt: boolean,
    descricaoServicos: string
  }>({
    regimeClt: false,
    descricaoServicos: ''
  });


  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.descricaoServicos === '') newErrors.descricaoServicos = 'Descrição de serviço é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.info('funcionario ', funcObj)
  }, [funcObj])

  return (
    <Container>
      <Layout level="1" style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Input
              size="small"
              label="Descrição dos serviços *"
              placeholder="Ex: Atender e servir mesas..."
              value={formData.descricaoServicos}
              onChangeText={(v) => handleChange('descricaoServicos', v)}
              status={errors.descricaoServicos ? 'danger' : 'basic'}
              caption={errors.descricaoServicos}
            />

            <View>
              <Text category="label" style={styles.label}>
                Tipo de Contrato
              </Text>

              <RadioGroup
                selectedIndex={formData.regimeClt ? 0 : 1}
                onChange={(index) =>
                  handleChange('regimeClt', index === 0)
                }
              >
                <Radio>Regime CLT</Radio>
                <Radio>Prestação de serviço (Sem CLT)</Radio>
              </RadioGroup>
            </View>
          </View>

          <View style={styles.btnsArea}>
            <Button
              appearance='outline'
              size="large"
              onPress={() => {
                if (!validate()) {
                  setIsLoading(false)
                  return;
                }
                const toSave: FuncionarioPostRequestBody = {
                  ...funcObj,
                  contrato: {
                    contratacao_regime_ctl: formData.regimeClt,
                    descricao_servicos: formData.descricaoServicos
                  }
                }
                navigator.navigate('AssinaturaContrato', {funcObj: toSave})
              }}
              style={styles.submit}
              disabled={isLoading}
            >
              {(isLoading) ? 'Carregando...' : 'Coletar assinatura e cadastrar'}
            </Button>
          </View>
        </View>
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
  },
  btnsArea: {
    gap: 10
  }
});
