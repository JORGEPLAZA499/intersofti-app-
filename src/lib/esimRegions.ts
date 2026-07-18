// eSIM Access regional bundles catalog
// Maps region keys to available multi-country bundles, identified by locationCode.

export type RegionKey =
  | 'global'
  | 'europe'
  | 'africa'
  | 'asia'
  | 'middleeast'
  | 'northamerica'
  | 'southamerica'
  | 'caribbean'
  | 'oceania';

export type Lang = 'en' | 'pt' | 'es';

export interface RegionBundle {
  /** locationCode prefix to match (e.g. "EU-42"). Plans are filtered by exact prefix match (case-insensitive, with trailing "-" handling). */
  locationCode: string;
  countryCount: number;
  /** Localized human-readable label */
  label: Record<Lang, string>;
}

export const REGION_LABELS: Record<RegionKey, Record<Lang, string>> = {
  global:        { en: 'Global',          pt: 'Global',          es: 'Global' },
  europe:        { en: 'Europe',          pt: 'Europa',          es: 'Europa' },
  africa:        { en: 'Africa',          pt: 'África',          es: 'África' },
  asia:          { en: 'Asia',            pt: 'Ásia',            es: 'Asia' },
  middleeast:    { en: 'Middle East',     pt: 'Oriente Médio',   es: 'Oriente Medio' },
  northamerica:  { en: 'North America',   pt: 'América do Norte', es: 'Norteamérica' },
  southamerica:  { en: 'South America',   pt: 'América do Sul',  es: 'Sudamérica' },
  caribbean:     { en: 'Caribbean',       pt: 'Caribe',          es: 'Caribe' },
  oceania:       { en: 'Oceania',         pt: 'Oceania',         es: 'Oceanía' },
};

export const REGION_ORDER: RegionKey[] = [
  'global', 'europe', 'africa', 'asia', 'middleeast',
  'northamerica', 'southamerica', 'caribbean', 'oceania',
];

export const REGION_BUNDLES: Record<RegionKey, RegionBundle[]> = {
  global: [
    { locationCode: 'GL-120', countryCount: 118, label: { en: 'Global standard',  pt: 'Global padrão',    es: 'Global estándar' } },
    { locationCode: 'GL-139', countryCount: 125, label: { en: 'Global extended',  pt: 'Global ampliado',  es: 'Global ampliado' } },
  ],
  europe: [
    { locationCode: 'EU-42',  countryCount: 41, label: { en: 'Europe standard',     pt: 'Europa padrão',         es: 'Europa estándar' } },
    { locationCode: 'EU-43',  countryCount: 41, label: { en: 'Europe + Morocco',    pt: 'Europa + Marrocos',     es: 'Europa + Marruecos' } },
    { locationCode: 'EU-30',  countryCount: 34, label: { en: 'Europe core',         pt: 'Europa central',        es: 'Europa core' } },
    { locationCode: 'EU-35',  countryCount: 35, label: { en: 'Europe extended',     pt: 'Europa estendida',      es: 'Europa extendida' } },
    { locationCode: 'EU-7',   countryCount: 7,  label: { en: 'Balkans',             pt: 'Balcãs',                es: 'Balcanes' } },
    { locationCode: 'BI-2',   countryCount: 2,  label: { en: 'Ireland + UK',        pt: 'Irlanda + Reino Unido', es: 'Irlanda + Reino Unido' } },
    { locationCode: 'IESI-2', countryCount: 2,  label: { en: 'Ireland + Slovenia',  pt: 'Irlanda + Eslovênia',   es: 'Irlanda + Eslovenia' } },
  ],
  africa: [
    { locationCode: 'AF-29',  countryCount: 29, label: { en: 'Africa regional',     pt: 'África regional',       es: 'África regional' } },
  ],
  asia: [
    { locationCode: 'AS-20',         countryCount: 20, label: { en: 'Asia regional',         pt: 'Ásia regional',         es: 'Asia regional' } },
    { locationCode: 'AS-21',         countryCount: 20, label: { en: 'Asia (alt)',            pt: 'Ásia (alt)',            es: 'Asia (alt)' } },
    { locationCode: 'AS-12',         countryCount: 12, label: { en: 'Southeast Asia',        pt: 'Sudeste Asiático',      es: 'Asia sudeste' } },
    { locationCode: 'AS-7',          countryCount: 7,  label: { en: 'East Asia',             pt: 'Leste Asiático',        es: 'Asia este' } },
    { locationCode: 'AS-5',          countryCount: 5,  label: { en: 'Central Asia (5)',      pt: 'Ásia Central (5)',      es: 'Asia central (5)' } },
    { locationCode: 'CA-4',          countryCount: 4,  label: { en: 'Central Asia (4)',      pt: 'Ásia Central (4)',      es: 'Asia central (4)' } },
    { locationCode: 'CN-3',          countryCount: 3,  label: { en: 'China + HK + Macao',    pt: 'China + HK + Macau',    es: 'China + Hong Kong + Macao' } },
    { locationCode: 'CNHK-2',        countryCount: 2,  label: { en: 'China + Hong Kong',     pt: 'China + Hong Kong',     es: 'China + Hong Kong' } },
    { locationCode: 'CNJPKR-3',      countryCount: 3,  label: { en: 'China + Japan + Korea', pt: 'China + Japão + Coreia', es: 'China + Japón + Corea' } },
    { locationCode: 'JPKR-2',        countryCount: 2,  label: { en: 'Japan + Korea',         pt: 'Japão + Coreia',        es: 'Japón + Corea' } },
    { locationCode: 'SGMY-2',        countryCount: 2,  label: { en: 'Singapore + Malaysia',  pt: 'Singapura + Malásia',   es: 'Singapur + Malasia' } },
    { locationCode: 'SGMYTH-3',      countryCount: 3,  label: { en: 'SG + MY + Thailand',    pt: 'SG + MY + Tailândia',   es: 'SG + MY + Tailandia' } },
    { locationCode: 'SGMYVNTHID-5',  countryCount: 5,  label: { en: 'SG + MY + VN + TH + ID', pt: 'SG + MY + VN + TH + ID', es: 'SG + MY + VN + TH + ID' } },
  ],
  middleeast: [
    { locationCode: 'ME-13',          countryCount: 11, label: { en: 'Middle East',                  pt: 'Oriente Médio',                es: 'Oriente Medio' } },
    { locationCode: 'ME-12',          countryCount: 12, label: { en: 'Middle East + N. Africa',      pt: 'Oriente Médio + N. África',    es: 'Oriente Medio + N. África' } },
    { locationCode: 'ME-6',           countryCount: 6,  label: { en: 'Gulf',                         pt: 'Golfo',                        es: 'Golfo' } },
    { locationCode: 'SAAEQAKWOMBH-6', countryCount: 6,  label: { en: 'GCC',                          pt: 'CCG',                          es: 'GCC' } },
  ],
  northamerica: [
    { locationCode: 'NA-3',   countryCount: 3, label: { en: 'North America',  pt: 'América do Norte', es: 'Norteamérica' } },
    { locationCode: 'USCA-2', countryCount: 2, label: { en: 'USA + Canada',   pt: 'EUA + Canadá',     es: 'EEUU + Canadá' } },
  ],
  southamerica: [
    { locationCode: 'SA-18',  countryCount: 17, label: { en: 'South America', pt: 'América do Sul',   es: 'Sudamérica' } },
  ],
  caribbean: [
    { locationCode: 'CB-25',  countryCount: 25, label: { en: 'Caribbean',     pt: 'Caribe',           es: 'Caribe' } },
  ],
  oceania: [
    { locationCode: 'O-OC-3', countryCount: 3, label: { en: 'Oceania',                 pt: 'Oceania',                 es: 'Oceanía' } },
    { locationCode: 'AUNZ-2', countryCount: 2, label: { en: 'Australia + New Zealand', pt: 'Austrália + Nova Zelândia', es: 'Australia + Nueva Zelanda' } },
    { locationCode: 'AUKUS-3', countryCount: 3, label: { en: 'Australia + UK + USA',   pt: 'Austrália + RU + EUA',    es: 'Australia + RU + EEUU' } },
  ],
};

export function getRegionLabel(region: RegionKey, lang: string): string {
  const l = (lang as Lang) in REGION_LABELS[region] ? (lang as Lang) : 'en';
  return REGION_LABELS[region][l];
}

export function getBundleLabel(bundle: RegionBundle, lang: string): string {
  const l = (lang as Lang) in bundle.label ? (lang as Lang) : 'en';
  return bundle.label[l];
}
