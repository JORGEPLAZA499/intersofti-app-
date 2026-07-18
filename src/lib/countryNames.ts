// Country name translations for search filtering
// Maps English country names (as returned by the eSIM API) to PT and ES equivalents
// Synced with the eSIM Access catalog (185 individual countries).

const countryTranslations: Record<string, { pt: string; es: string }> = {
  "Afghanistan": { pt: "Afeganistão", es: "Afganistán" },
  "Åland Islands": { pt: "Ilhas Åland", es: "Islas Åland" },
  "Albania": { pt: "Albânia", es: "Albania" },
  "Algeria": { pt: "Argélia", es: "Argelia" },
  "Andorra": { pt: "Andorra", es: "Andorra" },
  "Angola": { pt: "Angola", es: "Angola" },
  "Anguilla": { pt: "Anguila", es: "Anguila" },
  "Antigua and Barbuda": { pt: "Antígua e Barbuda", es: "Antigua y Barbuda" },
  "Argentina": { pt: "Argentina", es: "Argentina" },
  "Armenia": { pt: "Arménia", es: "Armenia" },
  "Australia": { pt: "Austrália", es: "Australia" },
  "Austria": { pt: "Áustria", es: "Austria" },
  "Azerbaijan": { pt: "Azerbaijão", es: "Azerbaiyán" },
  "Bahamas": { pt: "Bahamas", es: "Bahamas" },
  "Bahrain": { pt: "Bahrein", es: "Baréin" },
  "Bangladesh": { pt: "Bangladesh", es: "Bangladés" },
  "Barbados": { pt: "Barbados", es: "Barbados" },
  "Belarus": { pt: "Bielorrússia", es: "Bielorrusia" },
  "Belgium": { pt: "Bélgica", es: "Bélgica" },
  "Belize": { pt: "Belize", es: "Belice" },
  "Benin": { pt: "Benim", es: "Benín" },
  "Bermuda": { pt: "Bermudas", es: "Bermudas" },
  "Bhutan": { pt: "Butão", es: "Bután" },
  "Bolivia": { pt: "Bolívia", es: "Bolivia" },
  "Bosnia and Herzegovina": { pt: "Bósnia e Herzegovina", es: "Bosnia y Herzegovina" },
  "Botswana": { pt: "Botsuana", es: "Botsuana" },
  "Brazil": { pt: "Brasil", es: "Brasil" },
  "British Virgin Islands": { pt: "Ilhas Virgens Britânicas", es: "Islas Vírgenes Británicas" },
  "Brunei": { pt: "Brunei", es: "Brunéi" },
  "Bulgaria": { pt: "Bulgária", es: "Bulgaria" },
  "Burkina Faso": { pt: "Burkina Faso", es: "Burkina Faso" },
  "Cabo Verde": { pt: "Cabo Verde", es: "Cabo Verde" },
  "Cambodia": { pt: "Camboja", es: "Camboya" },
  "Cameroon": { pt: "Camarões", es: "Camerún" },
  "Canada": { pt: "Canadá", es: "Canadá" },
  "Cayman Islands": { pt: "Ilhas Cayman", es: "Islas Caimán" },
  "Central African Republic": { pt: "República Centro-Africana", es: "República Centroafricana" },
  "Chad": { pt: "Chade", es: "Chad" },
  "Chile": { pt: "Chile", es: "Chile" },
  "China": { pt: "China", es: "China" },
  "Colombia": { pt: "Colômbia", es: "Colombia" },
  "Congo": { pt: "Congo", es: "Congo" },
  "Costa Rica": { pt: "Costa Rica", es: "Costa Rica" },
  "Croatia": { pt: "Croácia", es: "Croacia" },
  "Curaçao": { pt: "Curaçao", es: "Curazao" },
  "Cyprus": { pt: "Chipre", es: "Chipre" },
  "Czech Republic": { pt: "República Checa", es: "República Checa" },
  "Czechia": { pt: "Chéquia", es: "Chequia" },
  "Democratic Republic of the Congo": { pt: "República Democrática do Congo", es: "República Democrática del Congo" },
  "Denmark": { pt: "Dinamarca", es: "Dinamarca" },
  "Dominica": { pt: "Dominica", es: "Dominica" },
  "Dominican Republic": { pt: "República Dominicana", es: "República Dominicana" },
  "Ecuador": { pt: "Equador", es: "Ecuador" },
  "Egypt": { pt: "Egito", es: "Egipto" },
  "El Salvador": { pt: "El Salvador", es: "El Salvador" },
  "Estonia": { pt: "Estónia", es: "Estonia" },
  "Eswatini": { pt: "Essuatíni", es: "Esuatini" },
  "Faroe Islands": { pt: "Ilhas Feroe", es: "Islas Feroe" },
  "Fiji": { pt: "Fiji", es: "Fiyi" },
  "Finland": { pt: "Finlândia", es: "Finlandia" },
  "France": { pt: "França", es: "Francia" },
  "French Guiana": { pt: "Guiana Francesa", es: "Guayana Francesa" },
  "French Polynesia": { pt: "Polinésia Francesa", es: "Polinesia Francesa" },
  "Gabon": { pt: "Gabão", es: "Gabón" },
  "Gambia": { pt: "Gâmbia", es: "Gambia" },
  "Georgia": { pt: "Geórgia", es: "Georgia" },
  "Germany": { pt: "Alemanha", es: "Alemania" },
  "Ghana": { pt: "Gana", es: "Ghana" },
  "Gibraltar": { pt: "Gibraltar", es: "Gibraltar" },
  "Greece": { pt: "Grécia", es: "Grecia" },
  "Greenland": { pt: "Gronelândia", es: "Groenlandia" },
  "Grenada": { pt: "Granada", es: "Granada" },
  "Guadeloupe": { pt: "Guadalupe", es: "Guadalupe" },
  "Guam": { pt: "Guam", es: "Guam" },
  "Guatemala": { pt: "Guatemala", es: "Guatemala" },
  "Guernsey": { pt: "Guernsey", es: "Guernsey" },
  "Guinea": { pt: "Guiné", es: "Guinea" },
  "Guinea-Bissau": { pt: "Guiné-Bissau", es: "Guinea-Bisáu" },
  "Guyana": { pt: "Guiana", es: "Guyana" },
  "Haiti": { pt: "Haiti", es: "Haití" },
  "Honduras": { pt: "Honduras", es: "Honduras" },
  "Hong Kong": { pt: "Hong Kong", es: "Hong Kong" },
  "Hungary": { pt: "Hungria", es: "Hungría" },
  "Iceland": { pt: "Islândia", es: "Islandia" },
  "India": { pt: "Índia", es: "India" },
  "Indonesia": { pt: "Indonésia", es: "Indonesia" },
  "Iraq": { pt: "Iraque", es: "Irak" },
  "Ireland": { pt: "Irlanda", es: "Irlanda" },
  "Isle of Man": { pt: "Ilha de Man", es: "Isla de Man" },
  "Israel": { pt: "Israel", es: "Israel" },
  "Italy": { pt: "Itália", es: "Italia" },
  "Ivory Coast": { pt: "Costa do Marfim", es: "Costa de Marfil" },
  "Jamaica": { pt: "Jamaica", es: "Jamaica" },
  "Japan": { pt: "Japão", es: "Japón" },
  "Jersey": { pt: "Jersey", es: "Jersey" },
  "Jordan": { pt: "Jordânia", es: "Jordania" },
  "Kazakhstan": { pt: "Cazaquistão", es: "Kazajistán" },
  "Kenya": { pt: "Quénia", es: "Kenia" },
  "Kyrgyzstan": { pt: "Quirguistão", es: "Kirguistán" },
  "Laos": { pt: "Laos", es: "Laos" },
  "Latvia": { pt: "Letónia", es: "Letonia" },
  "Liberia": { pt: "Libéria", es: "Liberia" },
  "Libya": { pt: "Líbia", es: "Libia" },
  "Liechtenstein": { pt: "Liechtenstein", es: "Liechtenstein" },
  "Lithuania": { pt: "Lituânia", es: "Lituania" },
  "Luxembourg": { pt: "Luxemburgo", es: "Luxemburgo" },
  "Macao": { pt: "Macau", es: "Macao" },
  "Madagascar": { pt: "Madagáscar", es: "Madagascar" },
  "Malawi": { pt: "Malawi", es: "Malaui" },
  "Malaysia": { pt: "Malásia", es: "Malasia" },
  "Maldives": { pt: "Maldivas", es: "Maldivas" },
  "Mali": { pt: "Mali", es: "Malí" },
  "Malta": { pt: "Malta", es: "Malta" },
  "Martinique": { pt: "Martinica", es: "Martinica" },
  "Mauritius": { pt: "Maurícia", es: "Mauricio" },
  "Mayotte": { pt: "Mayotte", es: "Mayotte" },
  "Mexico": { pt: "México", es: "México" },
  "Moldova": { pt: "Moldávia", es: "Moldavia" },
  "Monaco": { pt: "Mónaco", es: "Mónaco" },
  "Mongolia": { pt: "Mongólia", es: "Mongolia" },
  "Montenegro": { pt: "Montenegro", es: "Montenegro" },
  "Montserrat": { pt: "Montserrat", es: "Montserrat" },
  "Morocco": { pt: "Marrocos", es: "Marruecos" },
  "Mozambique": { pt: "Moçambique", es: "Mozambique" },
  "Nepal": { pt: "Nepal", es: "Nepal" },
  "Netherlands": { pt: "Países Baixos", es: "Países Bajos" },
  "New Zealand": { pt: "Nova Zelândia", es: "Nueva Zelanda" },
  "Nicaragua": { pt: "Nicarágua", es: "Nicaragua" },
  "Niger": { pt: "Níger", es: "Níger" },
  "Nigeria": { pt: "Nigéria", es: "Nigeria" },
  "North Macedonia": { pt: "Macedónia do Norte", es: "Macedonia del Norte" },
  "Norway": { pt: "Noruega", es: "Noruega" },
  "Oman": { pt: "Omã", es: "Omán" },
  "Pakistan": { pt: "Paquistão", es: "Pakistán" },
  "Panama": { pt: "Panamá", es: "Panamá" },
  "Paraguay": { pt: "Paraguai", es: "Paraguay" },
  "Peru": { pt: "Peru", es: "Perú" },
  "Philippines": { pt: "Filipinas", es: "Filipinas" },
  "Poland": { pt: "Polónia", es: "Polonia" },
  "Portugal": { pt: "Portugal", es: "Portugal" },
  "Puerto Rico": { pt: "Porto Rico", es: "Puerto Rico" },
  "Qatar": { pt: "Catar", es: "Catar" },
  "Réunion": { pt: "Reunião", es: "Reunión" },
  "Romania": { pt: "Roménia", es: "Rumanía" },
  "Russia": { pt: "Rússia", es: "Rusia" },
  "Rwanda": { pt: "Ruanda", es: "Ruanda" },
  "Saint Barthélemy": { pt: "São Bartolomeu", es: "San Bartolomé" },
  "Saint Kitts and Nevis": { pt: "São Cristóvão e Nevis", es: "San Cristóbal y Nieves" },
  "Saint Lucia": { pt: "Santa Lúcia", es: "Santa Lucía" },
  "Saint Martin": { pt: "São Martinho", es: "San Martín" },
  "Saint Vincent and the Grenadines": { pt: "São Vicente e Granadinas", es: "San Vicente y las Granadinas" },
  "Samoa": { pt: "Samoa", es: "Samoa" },
  "San Marino": { pt: "São Marino", es: "San Marino" },
  "São Tomé and Príncipe": { pt: "São Tomé e Príncipe", es: "Santo Tomé y Príncipe" },
  "Saudi Arabia": { pt: "Arábia Saudita", es: "Arabia Saudita" },
  "Senegal": { pt: "Senegal", es: "Senegal" },
  "Serbia": { pt: "Sérvia", es: "Serbia" },
  "Seychelles": { pt: "Seicheles", es: "Seychelles" },
  "Sierra Leone": { pt: "Serra Leoa", es: "Sierra Leona" },
  "Singapore": { pt: "Singapura", es: "Singapur" },
  "Slovakia": { pt: "Eslováquia", es: "Eslovaquia" },
  "Slovenia": { pt: "Eslovénia", es: "Eslovenia" },
  "South Africa": { pt: "África do Sul", es: "Sudáfrica" },
  "South Korea": { pt: "Coreia do Sul", es: "Corea del Sur" },
  "Spain": { pt: "Espanha", es: "España" },
  "Sri Lanka": { pt: "Sri Lanka", es: "Sri Lanka" },
  "Sudan": { pt: "Sudão", es: "Sudán" },
  "Suriname": { pt: "Suriname", es: "Surinam" },
  "Sweden": { pt: "Suécia", es: "Suecia" },
  "Switzerland": { pt: "Suíça", es: "Suiza" },
  "Tajikistan": { pt: "Tajiquistão", es: "Tayikistán" },
  "Tanzania": { pt: "Tanzânia", es: "Tanzania" },
  "Thailand": { pt: "Tailândia", es: "Tailandia" },
  "Trinidad and Tobago": { pt: "Trinidad e Tobago", es: "Trinidad y Tobago" },
  "Tunisia": { pt: "Tunísia", es: "Túnez" },
  "Turkey": { pt: "Turquia", es: "Turquía" },
  "Türkiye": { pt: "Turquia", es: "Turquía" },
  "Turks and Caicos Islands": { pt: "Ilhas Turks e Caicos", es: "Islas Turcas y Caicos" },
  "Uganda": { pt: "Uganda", es: "Uganda" },
  "Ukraine": { pt: "Ucrânia", es: "Ucrania" },
  "United Arab Emirates": { pt: "Emirados Árabes Unidos", es: "Emiratos Árabes Unidos" },
  "United Kingdom": { pt: "Reino Unido", es: "Reino Unido" },
  "United States": { pt: "Estados Unidos", es: "Estados Unidos" },
  "Uruguay": { pt: "Uruguai", es: "Uruguay" },
  "Uzbekistan": { pt: "Uzbequistão", es: "Uzbekistán" },
  "Vatican City": { pt: "Vaticano", es: "Vaticano" },
  "Vietnam": { pt: "Vietnã", es: "Vietnam" },
  "Zambia": { pt: "Zâmbia", es: "Zambia" },
};

// ISO 3166-1 alpha-2 code → English country name
// Synced 1:1 with the eSIM Access catalog (185 countries).
const codeToEnglishName: Record<string, string> = {
  AD: "Andorra", AE: "United Arab Emirates", AF: "Afghanistan",
  AG: "Antigua and Barbuda", AI: "Anguilla", AL: "Albania", AM: "Armenia",
  AO: "Angola", AR: "Argentina", AT: "Austria", AU: "Australia",
  AX: "Åland Islands", AZ: "Azerbaijan",
  BA: "Bosnia and Herzegovina", BB: "Barbados", BD: "Bangladesh",
  BE: "Belgium", BF: "Burkina Faso", BG: "Bulgaria", BH: "Bahrain",
  BJ: "Benin", BL: "Saint Barthélemy", BM: "Bermuda", BN: "Brunei",
  BO: "Bolivia", BR: "Brazil", BS: "Bahamas", BT: "Bhutan",
  BW: "Botswana", BY: "Belarus", BZ: "Belize",
  CA: "Canada", CD: "Democratic Republic of the Congo",
  CF: "Central African Republic", CG: "Congo", CH: "Switzerland",
  CI: "Ivory Coast", CL: "Chile", CM: "Cameroon", CN: "China",
  CO: "Colombia", CR: "Costa Rica", CV: "Cabo Verde", CW: "Curaçao",
  CY: "Cyprus", CZ: "Czech Republic",
  DE: "Germany", DK: "Denmark", DM: "Dominica", DO: "Dominican Republic",
  DZ: "Algeria",
  EC: "Ecuador", EE: "Estonia", EG: "Egypt", ES: "Spain",
  FI: "Finland", FJ: "Fiji", FO: "Faroe Islands", FR: "France",
  GA: "Gabon", GB: "United Kingdom", GD: "Grenada", GE: "Georgia",
  GF: "French Guiana", GG: "Guernsey", GH: "Ghana", GI: "Gibraltar",
  GL: "Greenland", GM: "Gambia", GN: "Guinea", GP: "Guadeloupe",
  GR: "Greece", GT: "Guatemala", GU: "Guam", GW: "Guinea-Bissau",
  GY: "Guyana",
  HK: "Hong Kong", HN: "Honduras", HR: "Croatia", HT: "Haiti",
  HU: "Hungary",
  ID: "Indonesia", IE: "Ireland", IL: "Israel", IM: "Isle of Man",
  IN: "India", IQ: "Iraq", IS: "Iceland", IT: "Italy",
  JE: "Jersey", JM: "Jamaica", JO: "Jordan", JP: "Japan",
  KE: "Kenya", KG: "Kyrgyzstan", KH: "Cambodia", KN: "Saint Kitts and Nevis",
  KR: "South Korea", KY: "Cayman Islands", KZ: "Kazakhstan",
  LA: "Laos", LC: "Saint Lucia", LI: "Liechtenstein", LK: "Sri Lanka",
  LR: "Liberia", LT: "Lithuania", LU: "Luxembourg", LV: "Latvia",
  LY: "Libya",
  MA: "Morocco", MC: "Monaco", MD: "Moldova", ME: "Montenegro",
  MF: "Saint Martin", MG: "Madagascar", MK: "North Macedonia",
  ML: "Mali", MN: "Mongolia", MO: "Macao", MQ: "Martinique",
  MS: "Montserrat", MT: "Malta", MU: "Mauritius", MV: "Maldives",
  MW: "Malawi", MX: "Mexico", MY: "Malaysia", MZ: "Mozambique",
  NE: "Niger", NG: "Nigeria", NI: "Nicaragua", NL: "Netherlands",
  NO: "Norway", NP: "Nepal", NZ: "New Zealand",
  OM: "Oman",
  PA: "Panama", PE: "Peru", PF: "French Polynesia", PH: "Philippines",
  PK: "Pakistan", PL: "Poland", PR: "Puerto Rico", PT: "Portugal",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Réunion", RO: "Romania", RS: "Serbia", RU: "Russia",
  RW: "Rwanda",
  SA: "Saudi Arabia", SC: "Seychelles", SD: "Sudan", SE: "Sweden",
  SG: "Singapore", SI: "Slovenia", SK: "Slovakia", SL: "Sierra Leone",
  SM: "San Marino", SN: "Senegal", SR: "Suriname", SV: "El Salvador",
  SZ: "Eswatini",
  TC: "Turks and Caicos Islands", TD: "Chad", TH: "Thailand",
  TJ: "Tajikistan", TN: "Tunisia", TR: "Turkey", TT: "Trinidad and Tobago",
  TZ: "Tanzania",
  UA: "Ukraine", UG: "Uganda", US: "United States", UY: "Uruguay",
  UZ: "Uzbekistan",
  VA: "Vatican City", VC: "Saint Vincent and the Grenadines",
  VG: "British Virgin Islands", VN: "Vietnam",
  WS: "Samoa",
  YT: "Mayotte",
  ZA: "South Africa", ZM: "Zambia",
};

/**
 * Get the localized country name for a given ISO code.
 */
export function getCountryNameByCode(code: string, lang: 'en' | 'pt' | 'es' = 'en'): string | undefined {
  const upper = code.toUpperCase();
  const en = codeToEnglishName[upper];
  if (!en) return undefined;
  if (lang === 'en') return en;
  const t = countryTranslations[en];
  return t ? t[lang] : en;
}

/**
 * Get all available country codes and their English names.
 */
export function getAllCountryCodes(): Record<string, string> {
  return codeToEnglishName;
}

/**
 * Get all name variants for a country (EN + PT + ES) for search matching.
 * Returns an array of lowercase strings.
 */
export function getCountrySearchTerms(englishName: string): string[] {
  const terms = [englishName.toLowerCase()];
  const t = countryTranslations[englishName];
  if (t) {
    terms.push(t.pt.toLowerCase(), t.es.toLowerCase());
  }
  return terms;
}

/**
 * Check if a query matches any translation of a country/location name.
 */
const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function matchesCountrySearch(name: string | undefined, query: string): boolean {
  if (!name) return false;
  const q = normalize(query);
  if (normalize(name).includes(q)) return true;
  const terms = getCountrySearchTerms(name);
  return terms.some(t => normalize(t).includes(q));
}

/**
 * Check if a country CODE (e.g. "ES") matches a search query via translated names.
 */
export function matchesCountryCodeSearch(code: string | undefined, query: string): boolean {
  if (!code) return false;
  const upperCode = code.toUpperCase();
  const englishName = codeToEnglishName[upperCode];
  if (!englishName) return false;
  return matchesCountrySearch(englishName, query);
}
