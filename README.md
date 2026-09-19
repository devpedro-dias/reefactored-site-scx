# SCX Agenciamentos Marítimos — site institucional

Redesign do site da SCX. Frete marítimo, aéreo e rodoviário, desembaraço
aduaneiro e seguro de carga.

**Stack:** Angular 20.3 (standalone) · SCSS · ngx-translate (PT/EN) · three.js · EmailJS

---

## Rodando localmente

```bash
npm ci
npm start          # http://localhost:4200
```

Outros comandos:

```bash
npm run build      # build de produção em dist/scx-website/browser
npm test           # testes unitários (Karma)
```

Requer Node 20 ou superior.

---

## Como o projeto está organizado

```
src/
├── styles.scss                  Camada global: tokens, reset, botões, utilitários
├── app/
│   ├── variables.scss           Paleta bruta, breakpoints e mixins SCSS
│   ├── data/ports.ts            Portos usados pelo globo e pelo ticker
│   ├── directives/              Diretiva de reveal no scroll
│   ├── services/                Tema, e-mail (EmailJS), cotação de moedas
│   ├── components/
│   │   ├── globe/               Globo 3D em three.js (carregado sob demanda)
│   │   ├── service-layout/      Layout único das 5 páginas de serviço
│   │   └── …                    Header, footer, formulário, cotação, etc.
│   └── pages/                   Home, contato e as 5 páginas de serviço
└── assets/i18n/                 pt.json e en.json
```

### Duas convenções que valem conhecer antes de mexer

**1. Cor vem em duas camadas.** `--c-*` é a paleta bruta da marca e não muda
com o tema. Tudo o mais (`--surface`, `--on-feature`, `--signal`…) é semântico
e inverte entre claro e escuro. Um `rgba()` fixo dentro de um componente é um
bug de tema esperando acontecer — use os tokens.

**2. As páginas de serviço são configuração, não template.** As cinco
compartilham `ServiceLayoutComponent`; cada página é só um objeto
`ServicePageConfig`. Para mudar o layout de todas, mexa no componente; para
mudar o conteúdo de uma, mexa no config dela.

---

## Textos e traduções

Todo texto visível vive em `src/assets/i18n/pt.json` e `en.json`. As duas
árvores precisam ter exatamente as mesmas chaves — se uma existir só num
idioma, a interface mostra a chave crua no outro.

---

## Deploy

O repositório traz configuração pronta para **Netlify** (`netlify.toml`) e
**Vercel** (`vercel.json`). Basta conectar o repositório no painel do serviço
escolhido; ele detecta o arquivo e faz o resto.

Ambos incluem o *rewrite* de SPA que o Angular exige: sem ele, abrir
`/frete-maritimo` diretamente ou recarregar a página devolve 404.

Diretório de publicação: `dist/scx-website/browser`

---

## Configuração de e-mail

O formulário de contato usa [EmailJS](https://www.emailjs.com/). As chaves
ficam em `src/environments/`.

> As três chaves do EmailJS (`publicKey`, `serviceId`, `templateId`) são
> públicas por natureza — elas vão no JavaScript do navegador e qualquer
> visitante consegue lê-las. Quem protege a conta é a **lista de domínios
> autorizados** no painel do EmailJS, não o sigilo das chaves. Mantenha essa
> lista configurada.

---

## Próximos passos em aberto

- **Imagens de desembaraço e seguro.** As outras três páginas usam fotografia
  tratada em duotone; essas duas ainda usam um banco de imagens datado e um
  ícone chapado. A alternativa é desenhar os motivos em SVG, como o globo.
- **Rotas do globo.** Os portos em `src/app/data/ports.ts` são ilustrativos,
  não as rotas reais operadas pela SCX. O rótulo no hero diz "principais
  portos do comércio global" justamente por isso — se as rotas reais entrarem,
  o texto pode virar uma afirmação sobre a operação.
- **Contraste do letreiro.** "AGENCIAMENTOS MARÍTIMOS" usa a cor principal da
  marca (`#31859b`), que no tema claro fica em 3.57:1 — abaixo do mínimo de
  4.5:1 para texto desse tamanho. O `#225c6a`, também da paleta, resolveria
  em 6.30:1.
