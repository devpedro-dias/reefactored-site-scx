/**
 * Portos reais usados pelo globo do hero e pelo ticker.
 * `code` é o código UN/LOCODE — é ele que aparece em mono na interface.
 */
export interface Port {
  code: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

/** Porto-sede: todos os arcos partem daqui. */
export const HOME_PORT: Port = {
  code: 'BRSSZ',
  city: 'Santos',
  country: 'BR',
  lat: -23.96,
  lng: -46.33,
};

export const PORTS: Port[] = [
  { code: 'CNSHA', city: 'Xangai', country: 'CN', lat: 31.23, lng: 121.47 },
  { code: 'SGSIN', city: 'Singapura', country: 'SG', lat: 1.29, lng: 103.85 },
  { code: 'NLRTM', city: 'Roterdã', country: 'NL', lat: 51.92, lng: 4.48 },
  { code: 'DEHAM', city: 'Hamburgo', country: 'DE', lat: 53.55, lng: 9.99 },
  { code: 'BEANR', city: 'Antuérpia', country: 'BE', lat: 51.22, lng: 4.4 },
  { code: 'USHOU', city: 'Houston', country: 'US', lat: 29.76, lng: -95.37 },
  { code: 'USLAX', city: 'Los Angeles', country: 'US', lat: 33.74, lng: -118.27 },
  { code: 'USNYC', city: 'Nova York', country: 'US', lat: 40.71, lng: -74.01 },
  { code: 'AEJEA', city: 'Jebel Ali', country: 'AE', lat: 25.01, lng: 55.06 },
  { code: 'ZADUR', city: 'Durban', country: 'ZA', lat: -29.87, lng: 31.02 },
  { code: 'KRPUS', city: 'Busan', country: 'KR', lat: 35.1, lng: 129.04 },
  { code: 'ESVLC', city: 'Valência', country: 'ES', lat: 39.45, lng: -0.33 },
  { code: 'PECLL', city: 'Callao', country: 'PE', lat: -12.05, lng: -77.14 },
  { code: 'BRPNG', city: 'Paranaguá', country: 'BR', lat: -25.52, lng: -48.51 },
];

/** Sequência usada no ticker do hero. */
export const TICKER_PORTS: Port[] = [HOME_PORT, ...PORTS];
