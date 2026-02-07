import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { AssinaturasContrato } from "../schema/funcionario.schema";

export async function contratoFuncionario(servico: string, clt: boolean, assinaturas?: AssinaturasContrato) {

  let contagem_clausulas = 1

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 32px;
            color: #111;
          }
  
          h1 {
            text-align: center;
            margin-bottom: 8px;
          }
  
          .section-assinatura {
            margin-top: 14px;
            display: flex;
            flex-direction: row;
            gap: 10px;
          }
  
          .termo {
            margin-top: 32px;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 50px;
          }
  
          .signature {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            gap: 15px;
          }
  
          .signature div {
            width: 90%;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            align-items: center;
          }
  
          .signature-line {
            border-top: 1px solid #000;
            margin-bottom: 12px;
          }
  
          .page-break {
            page-break-before: always;
            break-before: page;
          }
        </style>
      </head>
  
      <body>
        <h1>Contrato de Prestação de Serviços Autônomos</h1>
  
        <div class="termo">
          <p>DO OBJETO</p>
          
          <p><strong>CLÁUSULA ${contagem_clausulas++}ª:</strong> O presente instrumento tem por objeto a prestação de serviços autônomos, de natureza NÃO-EMPREGATÍCIA, a serem executados pelo(a) CONTRATADO(A) em favor do(a) CONTRATANTE, conforme especificado em anexo ou descrito a seguir: ${servico}.</p>
          
          <p>DA NATUREZA JURÍDICA E AUTONOMIA</p>
          
          <p><strong>CLÁUSULA ${(contagem_clausulas++)}ª:</strong> ACEITAÇÃO DA CONDIÇÃO DE AUTÔNOMO: O(A) CONTRATADO(A) DECLARA, expressa e livremente, que aceita prestar os serviços sob o regime jurídico de Prestador Autônomo, não existindo vínculo empregatício de qualquer natureza (sem carteira de trabalho assinada – CLT), sendo esta a sua vontade e a forma que melhor atende aos seus interesses profissionais atuais.</p>

          <p><strong>CLÁUSULA ${(contagem_clausulas++)}ª:</strong> PLENO CONHECIMENTO E CONSENTIMENTO: O(A) CONTRATADO(A) DECLARA ter pleno conhecimento e consentimento sobre todas as implicações legais e trabalhistas desta opção, inclusive no que tange à ausência de direitos tipicamente trabalhistas (como FGTS, Seguro-Desemprego, PIS/PASEP, etc.), os quais não serão devidos por força deste acordo, salvo os explicitamente previstos nas cláusulas seguintes.</p>

          ${(!clt)?`<p><strong>CLÁUSULA ${(contagem_clausulas++)}ª:</strong> DECISÃO PESSOAL DO CONTRATADO: O(A) CONTRATADO(A) DECLARA que não deseja a contratação sob o regime da CLT por decisão pessoal e exclusiva, visando preservar benefícios de programas governamentais dos quais é beneficiário e que seriam afetados pela formalização do vínculo empregatício, assumindo toda e qualquer responsabilidade por esta escolha.</p>`:''}
          
          <p>DA CARGA HORÁRIA E REMUNERAÇÃO</p>

          <p><strong>CLÁUSULA ${(contagem_clausulas++)}ª:</strong> ACEITAÇÃO DA JORNADA: O(A) CONTRATADO(A) ACEITA a organização da prestação dos serviços conforme o combinado entre as partes, podendo incluir dias e horários específicos (Terça a Domingo, das 16h às 23h30h) mas reconhece e concorda que possui autonomia para gerir seu tempo e método de trabalho, desde que entregue os resultados pactuados no prazo estipulado.</p>

          <p>DA RESPONSABILIDADE PELA DECISÃO</p>

          <p><strong>CLÁUSULA ${(contagem_clausulas++)}ª:</strong> RESPONSABILIDADE INDIVIDUAL: O(A) CONTRATADO(A) DECLARA ter plena responsabilidade por sua decisão de atuar como profissional autônomo, isentando o(a) CONTRATANTE de quaisquer ônus ou responsabilidades decorrentes da não-contratação sob o regime da Consolidação das Leis do Trabalho (CLT). O(A) CONTRATADO(A) obriga-se a custear todas as despesas pertinentes ao seu trabalho e a recolher todos os tributos devidos pela sua atividade (INSS, impostos municipais, estaduais ou federais).</p>

          <div class="page-break"></div>

          <p>DIREITOS ACORDADOS</p>

          <p><strong>CLÁUSULA ${(contagem_clausulas++)}ª:</strong> DIREITO A FÉRIAS E GRATIFICAÇÃO (DÉCIMO TERCEIRO): Em caráter ESPONTÂNEO E NÃO OBRIGATÓRIO POR LEI, e reconhecendo a importância do bem-estar do(a) prestador(a) de serviços, o(a) CONTRATANTE se compromete a conceder ao(à) CONTRATADO(A), anualmente:
          a) Férias: Um período de 30 dias consecutivos de recesso, sem prestação de serviços, a ser agendado de comum acordo. Durante este período, o(a) CONTRATADO(A) receberá a remuneração mensal integral combinada.
          b) Gratificação de Final de Ano (Décimo Terceiro): Uma gratificação no valor equivalente a uma remuneração mensal integral, a ser paga até o dia 30 de dezembro de cada ano.</p>

          <p><strong>CLÁUSULA ${(contagem_clausulas++)}ª:</strong> RESCISÃO: Este contrato poderá ser rescindido por qualquer das partes, sem justa causa, ou imediatamente, em caso de descumprimento grave de qualquer cláusula.</p>

        </div>

        ${(assinaturas)
      ?
      `<div class="section-assinatura">
          <h5>Assinatura do Contratado</h5>
          <img src="${assinaturas.contratado}" style="width: 120px; transform: rotate(90deg);" />
        </div>
        `
      :
      `<div class="signature">
          <div>
            <div class="signature-line"></div>
            Assinatura Contratante
          </div>
          <div>
            <div class="signature-line"></div>
            Assinatura Contratado
          </div>
        </div>
        `
    }
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);

}