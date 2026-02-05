import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { DateFilterProps } from "../firestore/despesa.firestore";
import { Despesa } from "../schema/financa.schema";
import { Funcionario } from "../schema/funcionario.schema";
import { Pagamento, PagamentoPostRequestBody } from "../schema/pagamento.schema";
import { Restaurante } from "../schema/restaurante.schema";
import { calcularTotalIncentivos, calcularTotalVales } from "./calculos.util";
import { converterTimestamp, formatDateRelatorio, formatMoney } from "./formatadores.util";

export async function gerarRelatorioVales(
  funcionario: Funcionario,
  pagamento: Pagamento | PagamentoPostRequestBody,
  data_pag: Date
) {
  const vales = pagamento.vales || [];
  const incentivos = pagamento.incentivo || [];

  const dataInicio = vales.length
    ? converterTimestamp(vales[0].data_adicao)
    : data_pag;

  const totalVales = calcularTotalVales(pagamento.vales);

  const totalIncentivos = calcularTotalIncentivos(pagamento.incentivo);

  const salarioBase = () => {
    return funcionario.tipo === 'FIXO'
      ? funcionario.salario / 2
      : funcionario.salario * (funcionario.dias_trabalhados_semanal || 1);
  };

  const salarioFinal = salarioBase() - totalVales + totalIncentivos;

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

        .subtitle {
          text-align: center;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .section {
          margin-bottom: 24px;
        }

        .section h2 {
          font-size: 16px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 4px;
          margin-bottom: 12px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px 24px;
          font-size: 14px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 14px;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 8px;
        }

        th {
          background-color: #f5f5f5;
        }

        .total {
          text-align: left;
          font-weight: bold;
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
        }

        .signature {
          margin-top: 48px;
          display: flex;
          justify-content: space-between;
        }

        .signature div {
          width: 45%;
          text-align: center;
        }

        .signature-line {
          border-top: 1px solid #000;
          margin-top: 48px;
        }

        .page-break {
          page-break-before: always;
          break-before: page;
        }
      </style>
    </head>

    <body>
      <h1>Declaração de Recebimento de Remuneração Quinzenal</h1>

      <div class="termo">
        <p>
        Declaro, para os devidos fins, que eu, <strong>${funcionario.nome}</strong>, recebi da empresa o valor <strong>${formatMoney(salarioFinal)}</strong> referente à minha remuneração quinzenal, correspondente ao período de apuração informado em meu contracheque.
        </p>
        <p>
        Declaro ainda que o pagamento foi realizado de forma correta, estando de acordo com os valores discriminados no respectivo contracheque, incluindo a remuneração pactuada e eventuais adicionais ou benefícios concedidos.
        </p>
        <p>
        Afirmo que o valor recebido corresponde integralmente ao que me era devido no período mencionado, não havendo, até a presente data, qualquer reclamação, divergência ou pendência financeira relacionada ao pagamento efetuado, dando plena, geral e irrevogável quitação quanto aos valores recebidos.
        </p>
      </div>

      ${pagamento.assinatura
        ?
        `<div class="section-assinatura">
          <h5>Assinatura do Funcionário</h5>
          <img src="${pagamento.assinatura}" style="width: 120px;" />
        </div>
        `
        :
        `<div class="signature">
          <div>
            <div class="signature-line"></div>
            Funcionário
          </div>
          <div>
            <div class="signature-line"></div>
            Responsável
          </div>
        </div>
        `
      }

      <div class="page-break"></div>

      <h2>Relatório de Pagamento</h2>
      <p>Período: ${(dataInicio).toLocaleDateString()} até ${(data_pag).toLocaleDateString()}</p>

      <div class="section">
        <h2>Funcionário</h2>
        <div class="info-grid">
          <div><strong>Nome:</strong> ${funcionario.nome}</div>
          <div><strong>Cargo:</strong> ${funcionario.cargo}</div>
          <div><strong>CPF:</strong> ${funcionario.cpf ?? '-'}</div>
          <div><strong>Tipo:</strong> ${funcionario.tipo}</div>
          <div><strong>Salário Bruto:</strong> ${formatMoney(funcionario.salario)}</div>
          <div><strong>Data de Admissão:</strong> ${formatDateRelatorio(converterTimestamp(funcionario.data_admissao))}</div>
        </div>
      </div>

      <div class="section">
        <h2>Resumo do Pagamento</h2>
        <div class="info-grid">
          <div><strong>Data do Pagamento:</strong> ${formatDateRelatorio(data_pag)}</div>
          <div><strong>Salário Base:</strong> ${formatMoney(salarioBase())}</div>
          <div><strong>Total em Vales:</strong> ${formatMoney(totalVales)}</div>
          <div><strong>Total em Incentivos:</strong> ${formatMoney(totalIncentivos)}</div>
          <div><strong>Salário Pago:</strong> ${formatMoney(salarioFinal)}</div>
        </div>
      </div>

      <div class="section">
        <h2>Vales</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Qtd</th>
              <th>Valor Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${vales.length === 0
      ? `<tr><td colspan="5">Nenhum vale registrado</td></tr>`
      : vales.map(v => `
        <tr>
          <td>${formatDateRelatorio(converterTimestamp(v.data_adicao))}</td>
          <td>${v.descricao}</td>
          <td>${v.quantidade}</td>
          <td>${formatMoney(v.preco_unit)}</td>
          <td>${formatMoney(v.preco_unit * v.quantidade)}</td>
        </tr>
      `).join('')
    }
            <tr>
              <td colspan="4" class="total">Total</td>
              <td class="total">${formatMoney(totalVales)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      ${incentivos.length > 0
      ? `
        <div class="section">
          <h2>Incentivos Recebidos</h2>
          <table>
            <thead>
              <tr>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${incentivos.map(i => `
                <tr>
                  <td>${formatMoney(i.valor)}</td>
                </tr>
              `).join('')}
              <tr>
                <td class="total">Total    ${formatMoney(totalIncentivos)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        `
      : ''
    }
    </body>
  </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}

export async function gerarRelatorioDespesas(
  despesas: Despesa[],
  estabelecimento: Restaurante,
  datas: DateFilterProps,
  nomeCategoria?: string,
) {
  const totalDespesas = despesas.reduce(
    (acc, despesa) => acc + despesa.valor,
    0
  );

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
          margin-bottom: 4px;
        }

        .subtitle {
          text-align: center;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .section {
          margin-bottom: 24px;
        }

        .section h2 {
          font-size: 16px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 4px;
          margin-bottom: 12px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px 24px;
          font-size: 14px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 14px;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 8px;
        }

        th {
          background-color: #f5f5f5;
          text-align: left;
        }

        .right {
          text-align: right;
        }

        .total-row td {
          font-weight: bold;
        }

        .footer {
          margin-top: 48px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>

    <body>
      <h1>Relatório de Gastos</h1>
      <div class="subtitle">
        ${(nomeCategoria) ? `Categoria: <strong>${nomeCategoria}</strong><br/>` : ''}
        Período: ${formatDateRelatorio(datas.dataInicio)} até ${formatDateRelatorio(datas.dataFim)}
      </div>

      <div class="section">
        <h2>Resumo do Período</h2>
        <div class="info-grid">
          <div><strong>Total de Despesas:</strong> ${formatMoney(totalDespesas)}</div>
          <div><strong>Quantidade de Lançamentos:</strong> ${despesas.length}</div>
        </div>
      </div>

      <div class="section">
        <h2>Estabelecimento</h2>
        <div class="info-grid">
          <div><strong>Nome Fantasia:</strong> ${estabelecimento.nome_fantasia}</div>
          <div><strong>Email:</strong> ${estabelecimento.email}</div>
          <div><strong>Status:</strong> ${estabelecimento.ativo ? 'Ativo' : 'Inativo'}</div>
          <div><strong>Data de Criação:</strong> ${formatDateRelatorio(converterTimestamp(estabelecimento.data_criacao))}</div>
        </div>
      </div>

      <div class="section">
        <h2>Lista de Despesas</h2>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              ${(!nomeCategoria) ? '' : '<th>Categoria</th>'}
              <th class="right">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${despesas.length === 0
      ? `<tr><td colspan=${(!nomeCategoria) ? '3' : "4"}>Nenhuma despesa registrada no período</td></tr>`
      : despesas
        .map(
          d => `
                      <tr>
                        <td>${formatDateRelatorio(converterTimestamp(d.data_criacao))}</td>
                        <td>${d.descricao}</td>
                        ${(!nomeCategoria) ? '' : `<td>${nomeCategoria}</td>`}
                        <td class="right">${formatMoney(d.valor)}</td>
                      </tr>
                    `
        )
        .join('')
    }
            <tr class="total-row">
              <td colspan=${(nomeCategoria) ? "3" : "2"}>Total</td>
              <td class="right">${formatMoney(totalDespesas)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}
      </div>
    </body>
  </html>
  `;

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  await Sharing.shareAsync(uri);
}
