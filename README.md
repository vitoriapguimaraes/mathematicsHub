# Mathematics Hub

> Um hub unificado que consolida três ferramentas essenciais (Calculadora de Média, Conversor de Moedas e Calculadora Básica) em uma única interface web moderna e responsiva. O projeto evolui ferramentas de aprendizado anteriores para um design premium com Glassmorphism.

[link acesso ao deploy, quando tiver]

![Demonstração do MathematicsHub](https://github.com/vitoriapguimaraes/mathematicsHub/blob/main/public/demo/navigation.gif)

## Funcionalidades Principais

- **Interface Unificada**: Acesso rápido a todas as ferramentas a partir de um dashboard central.
- **Calculadora de Média**:
  - Cálculo de média escolar com feedback visual de aprovação/reprovação.
  - Histórico de cálculos exportável para .txt e .csv.
- **Conversor de Moedas**:
  - Conversão em tempo real utilizando API aberta (sem necessidade de chaves).
  - Suporte a diversas moedas globais e inversão rápida de valores.
  - Histórico de conversões recente.
- **Calculadora Básica**:
  - Portada totalmente de Python para JavaScript (execução 100% no navegador).
  - Interface visual completa com teclado numérico e operações padrão.

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível.
- **CSS3**: Variáveis, Flexbox, Grid e efeitos de Glassmorphism.
- **JavaScript (ES6+)**: Lógica de cálculo, manipulação do DOM e consumo de APIs.
- **Ionicons**: Conjunto de ícones para interface.

## Como Executar

Não é necessária nenhuma instalação de dependências ou servidor backend (Python/Node). O projeto é puramente estático.

1. Clone o repositório:
   ```bash
   git clone https://github.com/vitoriapguimaraes/mathematicsHub.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd mathematicsHub
   ```
3. Abra o arquivo `index.html` no seu navegador preferido.

## Como Usar

1. **Dashboard**: Ao abrir o `index.html`, você verá cards para cada aplicação. Clique em "Acessar Ferramenta" para abrir a ferramenta desejada.
2. **Navegação**: Dentro de cada app, use o link "Voltar para o Hub" no topo para retornar à tela inicial.
3. **Exportação**: Nas ferramentas de Média e Conversão, utilize o botão "Exportar" para salvar seu histórico de uso localmente.

## Estrutura de Diretórios

```
/mathematicsHub
├── index.html              # Página Inicial (Dashboard)
├── assets/
│   └── css/                # Estilos globais e temas
├── apps/                   # Aplicações individuais
│   ├── media-calculator/   # Calculadora de Média
│   ├── currency-converter/ # Conversor de Moedas
│   └── basic-calculator/   # Calculadora Básica (Port JS)
├── legacy-files/           # Códigos originais (referência)
└── README.md
```

## Status

✅ Concluído

> Veja as [issues abertas](https://github.com/vitoriapguimaraes/mathematicsHub/issues) para sugestões de melhorias e próximos passos.

## Mais Sobre Mim

Acesse os arquivos disponíveis na [Pasta Documentos](https://github.com/vitoriapguimaraes/vitoriapguimaraes/tree/main/DOCUMENTOS) para mais informações sobre minhas qualificações e certificações.
