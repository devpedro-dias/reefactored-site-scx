/**
 * Configuração de uma página de serviço.
 *
 * As cinco páginas compartilham a mesma estrutura e diferem só nos dados —
 * então elas viram configuração, não cinco templates quase iguais.
 * Todas as chaves são relativas a `services.<key>` no i18n.
 */
export interface ServicePageConfig {
  /** Sufixo em `services.*` — ex.: 'freteMaritimo'. */
  key: string;

  /** Chave completa do rótulo em `navigation.*`, usada no eyebrow. */
  navKey: string;

  /** Quantos parágrafos `descriptionN` a página tem (2 ou 3). */
  descriptionCount: number;

  /** Imagem circular do hero, relativa a `assets/`. */
  image: string;

  /** Texto alternativo da imagem do hero. */
  imageAlt: string;

  /** Chave do título que antecede a lista — 'servicesTitle' ou 'tasksTitle'. */
  listTitleKey?: string;

  /** Sub-chaves dos itens da lista; cada uma tem `.title` e `.description`. */
  items?: string[];

  /** Bloco de apoio ao cliente, quando a página tem um. */
  support?: {
    titleKey: string;
    descriptionKeys: string[];
  };

  /** Parágrafo solto ao final da lista — hoje só o VMI usa. */
  footnoteKey?: string;
}
