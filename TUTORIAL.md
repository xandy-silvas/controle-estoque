# Guia do Usuário: Sistema de Controle de Ativos de TI

Bem-vindo ao **Sistema Integrado de Almoxarifado e Controle de Ativos de TI**. Este guia foi elaborado para ajudar você e sua equipe de suporte a gerenciar com excelência todo o ciclo de vida dos equipamentos e materiais tecnológicos em posse de colaboradores.

---

## 📌 Sumário
1. [Visão Geral do Ciclo de Vida do Ativo](#1-visão-geral-do-ciclo-de-vida-do-ativo)
2. [Módulo 1: Listagem e Gestão de Entregas](#2-módulo-1-listagem-e-gestão-de-entregas)
   - [Realizando uma Nova Entrega](#realizando-uma-nova-entrega)
   - [Filtragem Avançada](#filtragem-avançada)
   - [Ações de Gestão (Retorno, Transferência, Manutenção e Descarte)](#ações-de-gestão-retorno-transferência-manutenção-e-descarte)
3. [Módulo 2: Inventário de Estoque](#3-módulo-2-inventário-de-estoque)
   - [Cadastro de Novos Modelos](#cadastro-de-novos-modelos)
   - [Reabastecimento de Estoque](#reabastecimento-de-estoque)
4. [Módulo 3: Histórico de Movimentações](#4-módulo-3-histórico-de-movimentações)
   - [Exportação para CSV](#exportação-para-csv)
5. [Módulo 4: Baixas e Ativos Descartados](#5-módulo-4-baixas-e-ativos-descartados)
6. [Módulo 5: Configuração e Painel Administrativo (Novo)](#6-módulo-5-configuração-e-painel-administrativo-novo)
7. [💡 Dicas Extras e Boas Práticas](#7-️-dicas-extras-e-boas-práticas)

---

## 1. Visão Geral do Ciclo de Vida do Ativo

No sistema, todo equipamento segue um fluxo lógico de estado e integridade física:

```
  [ Entrada no Estoque ] ──► [ Disponível para Entrega ]
                                       │
                                       ▼
  [ Descarte / Baixa ] ◄──  [ Em Uso / Alocado ]  ◄──►  [ Em Manutenção ]
                                       │
                                       ▼
                             [ Transferência de Posse ]
                                       │
                                       ▼
                            [ Retorno ao Estoque ]
```

---

## 2. Módulo 1: Listagem e Gestão de Entregas

A aba **Ativos Entregues** é a tela principal de controle das alocações vigentes. Nela é possível visualizar quem está com cada equipamento, o setor do colaborador e o status da posse.

### Realizando uma Nova Entrega
1. No canto superior direito, clique em **Nova Entrega** (botão preto no cabeçalho).
2. Selecione o **Equipamento** disponível no estoque (o sistema reduzirá automaticamente a quantidade disponível no inventário).
3. Insira o **Nome do Colaborador**, **Setor**, **Quantidade Alocada**, **Data da Entrega** e eventuais **Observações** (Ex: "Acompanha mouse sem fio").
4. **Termo de Empréstimo Opcional (PDF):** Caso o ativo seja um item de alto valor (como notebooks, celulares, servidores, etc.), o sistema exibirá uma sugestão automática de recomendação para inclusão do termo. Arraste ou selecione o arquivo PDF do termo assinado para mantê-lo anexado à alocação.
5. Clique em **Confirmar Entrega**.

*Nota: Os termos PDFs associados a alocações concluídas podem ser baixados individualmente a qualquer momento através do badge **[PDF] Termo** localizado abaixo do nome do equipamento na tabela de Ativos Entregues.*

### Filtragem Avançada
Use a barra de filtros inteligente acima da tabela para encontrar registros rapidamente por:
* **Colaborador:** Digite parte do nome do colaborador.
* **Setor:** Selecione o setor desejado (Ex: TI, Finanças, RH, Suporte, Vendas).
* **Equipamento / Cód/Patrimônio:** Pesquise por termos específicos ou pela etiqueta de patrimônio eletrônico.
* **Status / Período:** Use o filtro de datas de início e fim para gerar listas de conferência semanais ou mensais.

### Ações de Gestão (Retorno, Transferência, Manutenção e Descarte)
Ao lado de cada ativo alocado com status *Em Uso* ou *Em Manutenção*, você encontrará botões específicos de ação:

* **Devolver (Retorno ao Almoxarifado):**
  * Use quando o colaborador se desliga ou não precisa do equipamento.
  * O formulário solicitará a **Quantidade a Devolver**, a **Data do Retorno**, a **Condição Física** (Ex: *Excelente*, *Bom*, *Desgastado*) e observações sobre o vistoria física.
  * O estoque do item será imediatamente incrementado ao confirmar.

* **Transferir:**
  * Use para mover fisicamente ou transferir a responsabilidade de um ativo de um colaborador para outro diretamente, sem a necessidade de reentrar o ativo de volta ao estoque para em seguida entregá-lo.
  * Preencha o **Novo Colaborador**, **Setor** e informe o **Motivo/Justificativa da Transferência**.
  * A transferência gera registros no histórico detalhando quem era o portador original e quem passa a ser o novo responsável.

* **Manutenção (Ativar/Desativar):**
  * Clique no botão de chave de fenda/ferramenta para colocar o ativo em manutenção temporária. O status mudará para **Em Manutenção**. Para tirar, basta clicar novamente.

* **Descartar (Dar Baixa Irrevogável):**
  * Quando houver quebra (perda total), obsolescência ou dano severo de um ativo que esteja em uso, clique no ícone de lixeira vermelha.
  * O sistema fará a baixa imediata e enviará o item de forma irreversível para o fluxo oficial de descarte técnica com laudo/justificativa.

---

## 3. Módulo 2: Inventário de Estoque

A aba **Inventário de Estoque** centraliza o volume total de recursos controlados pelo almoxarifado tecnológico.

### Cadastro de Novos Modelos
Se você adquiriu um novo lote de computadores ou acessórios:
1. Vá até a aba **Estoque** e clique em **Cadastrar Novo Modelo**.
2. Preencha o **Nome do Material**, o **Código de Patrimônio (Ref. Patrimonial)**, escolha a **Categoria** e indique a **Quantidade Inicial** integrada ao almoxarifado física.
3. Clique em **Adicionar ao Estoque**.

### Reabastecimento de Estoque
Para adicionar mais unidades de um modelo já cadastrado, localize o item desejado na lista de estoque, defina a quantidade que deseja adicionar no seletor de número e clique no botão **Reabastecer**.

---

## 4. Módulo 3: Histórico de Movimentações

O **Histórico Geral de Movimentações** funciona como uma "trilha de auditoria" (ledger imutável). Toda alteração efetuada no ecossistema (Cadastro de novas peças, Entregas, Retornos, Transferências de posse, Ativações de Manutenção e Descartes) é documentada cronologicamente de forma automática.

* Você pode pesquisar termos específicos na caixa de buscas do histórico.
* É possível filtrar logs por tipo de ação de forma ágil através de botões rápidos.

### Exportação para CSV
Para prestar contas com a gerência sobre a movimentação mensal ou auditar os insumos de hardware de TI, clique no botão **Exportar CSV** no canto superior direito do painel de Histórico. O arquivo de planilha será baixado contendo todos os dados já estruturados e formatados.

---

## 5. Módulo 4: Baixas e Ativos Descartados

Para garantir o perfeito alinhamento do inventário físico e contábil, todos os descartes realizados vão para a aba dedicada **Ativos Descartados**.

Nessa área de segurança:
* É mantido o registro de ativos inutilizados.
* É exibido o **Laudo ou Justificativa de Descarte** fornecido pelo técnico e a **Condição de Estado** que o gerou.
* É exibido quem era o colaborador que estava em posse do item no momento do acidente ou defeito irreversível, permitindo total controle e transparência de responsabilidades.

---

## 6. Módulo 5: Configuração e Painel Administrativo (Novo)

O **Painel Admin** é a central onde o administrador da TI pode ajustar a estrutura organizacional de cadastro e alocações sem precisar tocar no código-fonte. Este painel é separado em duas abas internas:

### Gerenciar Setores
* **Adicionar Setor:** Preencha o nome do novo setor corporativo (ex: `Comercial Sul`, `Diretoria Executiva`, `Atendimento VIP`) e clique em **Adicionar Setor**.
* **Visualizar & Excluir:** Na lista lateral direita, exibe-se todos os setores cadastrados. Se um setor não for mais utilizado, basta clicar no ícone de lixeira para removê-lo de futuros formulários.

### Gerenciar Categorias
* **Adicionar Categoria:** Crie classificações personalizadas de ativos do estoque (ex: `Equipamentos Apple`, `Licenças Virtuais`, `Cabos & Hubs`).
* **Visualizar & Excluir:** Permite ver e apagar categorias cadastradas, reordenando instantaneamente as opções exibidas na adição de novos modelos de hardware.

> **Persistência Remota/Offline:** Todas as categorias e setores novos criados são gravados de forma segura e durável no navegador (`localStorage`), garantindo que estejam visíveis em todas as futuras inicializações da ferramenta e reabastecimentos de estoque.

---

## 7. 💡 Dicas Extras e Boas Práticas

1. **Evite duplicar códigos de Patrimônio:** O sistema monitora códigos duplicados para garantir que cada ativo tenha uma identificação única na empresa.
2. **Exporte relatórios periódicos:** Guarde uma cópia mensal do histórico via exportação de CSV para documentação e compliance institucional.
3. **Estoque Crítico (Indicador "Baixo"):** Ao notar o indicador de status "BAIXO" em cor de alerta na lista de estoque, planeje a compra de novas unidades de reabastecimento junto ao setor de compras para evitar que equipes fiquem desamparadas de hardware.
4. **Resete para demonstração se precisar:** Se desejar limpar testes e retornar a aplicação aos dados padrão iniciais da TI de fábrica para apresentar o fluxo para novos membros da equipe, clique no botão **Reset Demo** no topo. Isso restaurará também os setores e categorias de fábrica.
