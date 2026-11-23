export type ArticleCategory = 'Economía' | 'Hogares' | 'Sociedad' | 'Tecnología';

export interface ArticleSummary {
  id: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  readTime: string;
  date: string;
  accentHex: string;
  lead: string;
  isWeeklyMain?: boolean;
  sections: {
    id: string;
    number: string;
    heading: string;
    summary: string;
  }[];
  keyTakeaways: string[];
}

export interface IpcDivision {
  id: string;
  name: string;
  shortName: string;
  weight: number;
  monthlyChange: number;
  color: string;
  lightBg: string;
  textColor: string;
  products: string[];
  whyItChanges: string;
}

export interface IpcTimelinePoint {
  label: string;
  year: string;
  annualRate: number;
  note: string;
}

export const IPC_HISTORICAL_SERIES: IpcTimelinePoint[] = [
  { label: '2021 T1', year: '2021', annualRate: 2.9, note: 'Inicio de presiones por reapertura y retiros.' },
  { label: '2021 T3', year: '2021', annualRate: 5.3, note: 'Aceleración en bienes durables y alimentos.' },
  { label: '2022 T1', year: '2022', annualRate: 9.4, note: 'Alza global de energía, trigo y combustibles.' },
  { label: '2022 T3', year: '2022', annualRate: 13.7, note: 'Máximo reciente en la variación anual de precios.' },
  { label: '2023 T1', year: '2023', annualRate: 11.1, note: 'Comienza moderación tras tasas altas.' },
  { label: '2023 T3', year: '2023', annualRate: 5.1, note: 'Fuerte retroceso respecto al peak de 2022.' },
  { label: '2024 T1', year: '2024', annualRate: 3.7, note: 'Convergencia gradual hacia la meta del 3%.' },
  { label: '2024 T3', year: '2024', annualRate: 4.1, note: 'Incidencia puntual de tarifas eléctricas.' },
  { label: '2025 T1', year: '2025', annualRate: 4.5, note: 'Estabilización paulatina de cuentas y servicios.' },
  { label: 'Actual', year: '2026', annualRate: 3.6, note: 'Trayectoria cercana al rango meta anual.' },
];

export const IPC_DIVISIONS: IpcDivision[] = [
  {
    id: 'alimentos',
    name: 'Alimentos y bebidas no alcohólicas',
    shortName: 'Alimentos',
    weight: 22.3,
    monthlyChange: 0.6,
    color: '#9E5A63',
    lightBg: '#F6ECEB',
    textColor: '#6E363E',
    products: ['Pan marraqueta', 'Tomates y paltas', 'Carne de vacuno y pollo', 'Leche y huevos', 'Arroz y fideos'],
    whyItChanges: 'Depende del clima (heladas o sequías), el costo del transporte y el precio internacional de granos como el trigo.'
  },
  {
    id: 'vivienda',
    name: 'Vivienda y servicios básicos',
    shortName: 'Vivienda y luz',
    weight: 16.5,
    monthlyChange: 0.9,
    color: '#7A8B74',
    lightBg: '#EEF2EC',
    textColor: '#485643',
    products: ['Arriendo de vivienda', 'Cuenta de electricidad', 'Gas licuado y natural', 'Agua potable', 'Gastos comunes'],
    whyItChanges: 'Los arriendos suelen reajustarse según la UF, mientras que las tarifas eléctricas y de gas responden a decretos tarifarios y tipo de cambio.'
  },
  {
    id: 'transporte',
    name: 'Transporte',
    shortName: 'Transporte',
    weight: 13.7,
    monthlyChange: 0.3,
    color: '#64798A',
    lightBg: '#ECF1F4',
    textColor: '#3C4D5B',
    products: ['Bencina 93 y 95', 'Pasaje de Metro y bus', 'Automóvil nuevo', 'Pasaje aéreo', 'Peajes'],
    whyItChanges: 'Muy sensible al precio internacional del petróleo, el valor del dólar y los mecanismos de estabilización de combustibles (MEPCO).'
  },
  {
    id: 'restaurantes',
    name: 'Restaurantes y alojamiento',
    shortName: 'Restaurantes',
    weight: 7.9,
    monthlyChange: 0.4,
    color: '#B87462',
    lightBg: '#F7EFEA',
    textColor: '#7A4638',
    products: ['Menú de almuerzo', 'Comida rápida', 'Café en local', 'Hoteles y hostales'],
    whyItChanges: 'Refleja el costo de los insumos alimenticios sumado a los sueldos del personal y el arriendo de locales comerciales.'
  },
  {
    id: 'salud',
    name: 'Salud',
    shortName: 'Salud',
    weight: 7.8,
    monthlyChange: 0.2,
    color: '#8E9B77',
    lightBg: '#F1F4EC',
    textColor: '#4F593D',
    products: ['Consultas médicas', 'Medicamentos con y sin receta', 'Exámenes de laboratorio', 'Lentes ópticos'],
    whyItChanges: 'Varía según el precio de fármacos importados y los aranceles anuales de prestaciones médicas.'
  },
  {
    id: 'bienes',
    name: 'Bienes y servicios diversos',
    shortName: 'Otros servicios',
    weight: 6.4,
    monthlyChange: 0.3,
    color: '#856B82',
    lightBg: '#F3EEF2',
    textColor: '#564154',
    products: ['Artículos de higiene personal', 'Seguros automotrices', 'Peluquería', 'Servicios financieros'],
    whyItChanges: 'Combina productos de uso diario importados con servicios ligados a la evolución de la UF y remuneraciones.'
  },
  {
    id: 'equipamiento',
    name: 'Equipamiento y mantención del hogar',
    shortName: 'Hogar y muebles',
    weight: 6.1,
    monthlyChange: -0.2,
    color: '#C29A63',
    lightBg: '#F8F3E8',
    textColor: '#7A5B30',
    products: ['Electrodomésticos', 'Detergentes y limpieza', 'Muebles', 'Servicio doméstico'],
    whyItChanges: 'Las ofertas estacionales del comercio minorista y la variación del dólar suelen generar bajas temporales.'
  },
  {
    id: 'recreacion',
    name: 'Recreación, deportes y cultura',
    shortName: 'Recreación',
    weight: 5.5,
    monthlyChange: -0.4,
    color: '#7B7491',
    lightBg: '#F1F0F5',
    textColor: '#4D4761',
    products: ['Paquetes turísticos', 'Alimento para mascotas', 'Entradas a cine y conciertos', 'Televisores'],
    whyItChanges: 'Es una de las divisiones más estacionales: sube fuerte en vacaciones de verano o Fiestas Patrias y baja después.'
  },
  {
    id: 'educacion',
    name: 'Educación',
    shortName: 'Educación',
    weight: 4.9,
    monthlyChange: 0.1,
    color: '#5B7C8D',
    lightBg: '#EDF2F5',
    textColor: '#354F5C',
    products: ['Arancel universitario', 'Mensualidad escolar', 'Jardines infantiles', 'Textos escolares'],
    whyItChanges: 'Casi toda su variación ocurre en marzo, cuando comienzan las clases y se reajustan matrículas y mensualidades.'
  },
  {
    id: 'comunicaciones',
    name: 'Información y comunicación',
    shortName: 'Conectividad',
    weight: 4.5,
    monthlyChange: -0.3,
    color: '#6C847E',
    lightBg: '#EEF2F1',
    textColor: '#3E524D',
    products: ['Plan de telefonía móvil', 'Internet hogar', 'Teléfonos celulares', 'Servicios de streaming'],
    whyItChanges: 'La alta competencia entre empresas de telecomunicaciones suele empujar los precios a la baja o entregar más datos por el mismo valor.'
  },
  {
    id: 'vestuario',
    name: 'Vestuario y calzado',
    shortName: 'Vestuario',
    weight: 2.5,
    monthlyChange: -0.5,
    color: '#A96B72',
    lightBg: '#F7EEEF',
    textColor: '#6D3B41',
    products: ['Zapatillas', 'Pantalones y poleras', 'Abrigos de invierno', 'Ropa escolar'],
    whyItChanges: 'Cambia por temporadas (lanzamiento de colección otoño-invierno vs. liquidaciones de fin de temporada).'
  },
  {
    id: 'bebidas',
    name: 'Bebidas alcohólicas y tabaco',
    shortName: 'Bebidas y tabaco',
    weight: 1.9,
    monthlyChange: 0.2,
    color: '#9F805D',
    lightBg: '#F6F1EA',
    textColor: '#644D32',
    products: ['Cerveza', 'Vino embotellado', 'Pisco', 'Cigarrillos'],
    whyItChanges: 'Responde a impuestos específicos y promociones en supermercados y botillerías.'
  }
];

export const IPC_CALCULATION_STEPS = [
  {
    step: '01',
    title: 'Encuesta de Presupuestos Familiares',
    color: '#9E5A63',
    summary: 'Cada 5 años, el INE pregunta a miles de hogares chilenos en qué gastan su dinero.',
    detail: 'Así se define qué entra en la canasta (cerca de 283 productos representativos) y qué peso tiene cada uno. Si las familias destinan más dinero a arriendos o internet que antes, esos ítems ganan ponderación.'
  },
  {
    step: '02',
    title: 'Cotización en terreno cada mes',
    color: '#B87462',
    summary: 'Encuestadores visitan ferias, supermercados, farmacias y sitios web en todas las regiones.',
    detail: 'Se registran más de 100.000 precios mensuales en las mismas tiendas y formatos (por ejemplo, el kilo del mismo pan o el mismo modelo de zapatilla) para medir cambios reales de precio y no de calidad.'
  },
  {
    step: '03',
    title: 'Ponderación por importancia en el gasto',
    color: '#7A8B74',
    summary: 'No todos los precios pesan igual en el resultado final.',
    detail: 'Si el precio del pan sube 5%, empuja el IPC mucho más que si sube 5% el precio del cine, porque el presupuesto mensual destinado a alimentos es bastante mayor.'
  },
  {
    step: '04',
    title: 'Publicación oficial y efecto en la UF',
    color: '#64798A',
    summary: 'El octavo día hábil de cada mes se publica el dato del mes anterior.',
    detail: 'Ese porcentaje mensual se traslada directamente al valor diario de la Unidad de Fomento (UF) entre el día 10 del mes actual y el día 9 del mes siguiente.'
  }
];

export const IPC_MYTHS = [
  {
    id: 'cero',
    statement: '“Si el IPC de un mes es 0,0%, significa que todos los precios bajaron.”',
    isTrue: false,
    answerLabel: 'Mito',
    explanation: 'Un IPC de 0,0% significa que, en promedio, la canasta mantuvo su nivel del mes anterior: algunos productos subieron y otros bajaron compensándose entre sí. Para que los precios bajen en promedio, el IPC debe ser negativo.'
  },
  {
    id: 'ponderacion',
    statement: '“La subida de la bencina o el arriendo pesa más en el IPC que la de entradas al cine.”',
    isTrue: true,
    answerLabel: 'Realidad',
    explanation: 'Exacto. La canasta es ponderada según cuánto gasta un hogar típico en cada categoría. Alimentos, vivienda y transporte suman más de la mitad del índice total.'
  },
  {
    id: 'casas',
    statement: '“El precio de compra de casas y departamentos nuevos forma parte del IPC.”',
    isTrue: false,
    answerLabel: 'Mito',
    explanation: 'El IPC mide el gasto en consumo corriente, como el valor de los arriendos y los gastos comunes, pero no incluye la compra de viviendas nuevas porque se consideran inversión patrimonial.'
  }
];

export interface UfTimelinePoint {
  id: string;
  monthShort: string;
  dateLabel: string;
  value: number;
  note: string;
}

export interface UfDailySample {
  dateLabel: string;
  value: number;
  isToday?: boolean;
  note?: string;
}

export const UF_TODAY = {
  dateLabel: '23 de noviembre de 2026',
  shortDate: '23 nov 2026',
  value: 41391.69,
  dailyDelta: 6.88,
  yearlyBaseDate: '23 de noviembre de 2025',
  yearlyBaseValue: 39697.26,
  monthEndDate: '30 de noviembre de 2026',
  monthEndValue: 41439.89,
};

export const UF_NEARBY_DAYS: UfDailySample[] = [
  { dateLabel: '21 nov 2026', value: 41377.93 },
  { dateLabel: '22 nov 2026', value: 41384.81 },
  { dateLabel: '23 nov 2026', value: 41391.69, isToday: true, note: 'Valor de hoy' },
  { dateLabel: '24 nov 2026', value: 41398.57 },
  { dateLabel: '30 nov 2026', value: 41439.89, note: 'Cierre de mes' },
];

export const UF_YEARLY_SERIES: UfTimelinePoint[] = [
  {
    id: '2025-11',
    monthShort: 'Nov 25',
    dateLabel: '23 de noviembre de 2025',
    value: 39697.26,
    note: 'Punto de partida hace 12 meses. El IPC nulo de ese período mantuvo la UF casi sin cambios hasta diciembre.',
  },
  {
    id: '2025-12',
    monthShort: 'Dic 25',
    dateLabel: '23 de diciembre de 2025',
    value: 39697.26,
    note: 'Mes plano: cuando el IPC del mes previo marca 0,0%, la UF se congela y no sube ni un peso diario.',
  },
  {
    id: '2026-01',
    monthShort: 'Ene 26',
    dateLabel: '23 de enero de 2026',
    value: 39726.59,
    note: 'Retoma un avance suave de apenas +$29,33 en el mes tras un ajuste acotado de precios.',
  },
  {
    id: '2026-02',
    monthShort: 'Feb 26',
    dateLabel: '23 de febrero de 2026',
    value: 39762.28,
    note: 'Alza moderada (+$35,69) durante la temporada de verano.',
  },
  {
    id: '2026-03',
    monthShort: 'Mar 26',
    dateLabel: '23 de marzo de 2026',
    value: 39864.28,
    note: 'Acelera en +$102,00 reflejando el repunte estacional de inicio de año.',
  },
  {
    id: '2026-04',
    monthShort: 'Abr 26',
    dateLabel: '23 de abril de 2026',
    value: 40027.15,
    note: 'Supera por primera vez la barrera simbólica de los $40.000 pesos chilenos.',
  },
  {
    id: '2026-05',
    monthShort: 'May 26',
    dateLabel: '23 de mayo de 2026',
    value: 40475.55,
    note: 'Mayor salto mensual del período (+$448,40), impulsado por el IPC de marzo y ajustes de temporada.',
  },
  {
    id: '2026-06',
    monthShort: 'Jun 26',
    dateLabel: '23 de junio de 2026',
    value: 40801.29,
    note: 'Segundo avance importante del año (+$325,74) antes de estabilizarse en invierno.',
  },
  {
    id: '2026-07',
    monthShort: 'Jul 26',
    dateLabel: '23 de julio de 2026',
    value: 40844.79,
    note: 'Moderación clara del ritmo diario (+$43,50 en el mes).',
  },
  {
    id: '2026-08',
    monthShort: 'Ago 26',
    dateLabel: '23 de agosto de 2026',
    value: 40863.23,
    note: 'Avance mínimo de +$18,44, reflejando un mes de precios casi estables.',
  },
  {
    id: '2026-09',
    monthShort: 'Sep 26',
    dateLabel: '23 de septiembre de 2026',
    value: 40999.93,
    note: 'Roza los $41.000 tras sumar +$136,70 en el ciclo previo a Fiestas Patrias.',
  },
  {
    id: '2026-10',
    monthShort: 'Oct 26',
    dateLabel: '23 de octubre de 2026',
    value: 41205.16,
    note: 'Cruza los $41.000 con un incremento mensual de +$205,23.',
  },
  {
    id: '2026-11',
    monthShort: 'Nov 26',
    dateLabel: '23 de noviembre de 2026',
    value: 41391.69,
    note: 'Valor vigente hoy: acumula +$1.694,43 (+4,27%) frente a noviembre de 2025.',
  },
];

export const ARTICLES: ArticleSummary[] = [
  {
    id: 'ipc',
    isWeeklyMain: true,
    title: '¿Qué es el IPC y qué productos mide?',
    subtitle: 'Guía visual para entender el termómetro de los precios en Chile',
    category: 'Economía',
    readTime: '5 min de exploración',
    date: 'Edición semanal · Noviembre 2026',
    accentHex: '#9E5A63',
    lead: 'El Índice de Precios al Consumidor (IPC) es un indicador económico que mide cuánto suben o bajan, en promedio, los precios de una canasta básica de productos y servicios que consumen habitualmente los hogares (como alimentos, transporte, arriendo y cuentas de luz).',
    sections: [
      { id: 'canasta', number: '01', heading: 'La canasta por dentro', summary: 'Explora las 12 divisiones principales y su peso real en el gasto.' },
      { id: 'simulador', number: '02', heading: 'Tu IPC personal', summary: 'Calcula cómo te afecta la inflación según tus propios consumos.' },
      { id: 'metodologia', number: '03', heading: 'Cómo se mide cada mes', summary: 'Del trabajo de campo del INE al titular de las noticias.' },
      { id: 'uf-conexion', number: '04', heading: 'El salto del IPC a la UF', summary: 'Por qué un alza de precios mueve tu arriendo o dividendo.' },
      { id: 'mitos', number: '05', heading: 'Mito o realidad', summary: 'Tres ideas comunes puestas a prueba.' }
    ],
    keyTakeaways: [
      'El IPC mide el cambio promedio de precios de ~283 productos representativos, no el costo total de vida en pesos.',
      'Alimentos, Vivienda y Transporte explican más del 52% de todo el movimiento del índice.',
      'Tu inflación personal puede ser distinta al promedio nacional dependiendo de en qué gastas más cada mes.'
    ]
  },
  {
    id: 'uf',
    title: '¿Qué es la UF y por qué sube todos los días?',
    subtitle: 'Cómo funciona la unidad reajustable que marca arriendos, créditos e isapres',
    category: 'Economía',
    readTime: '4 min de exploración',
    date: 'Actualidad · 23 de noviembre de 2026',
    accentHex: '#B87462',
    lead: 'La Unidad de Fomento (UF) es una moneda de cuenta creada en Chile en 1967 para que los contratos, arriendos y créditos hipotecarios no pierdan su valor frente a la inflación. No existen billetes de UF: su precio en pesos cambia todos los días según el IPC del mes anterior.',
    sections: [
      { id: 'valor-hoy', number: '01', heading: 'Valor de la UF hoy', summary: 'El dato oficial de hoy y su avance diario paso a paso.' },
      { id: 'visualizador-uf', number: '02', heading: 'Visualizador del último año', summary: 'Recorre la evolución mensual desde noviembre de 2025 hasta hoy.' },
      { id: 'por-que-sube', number: '03', heading: 'Por qué cambia cada día', summary: 'La regla del día 10 al día 9 y qué pasa cuando el IPC baja.' },
      { id: 'calculadora-uf', number: '04', heading: 'Tu bolsillo en UF', summary: 'Convierte arriendos o dividendos y compara con hace un año.' }
    ],
    keyTakeaways: [
      'Hoy 23 de noviembre de 2026 la UF vale $41.391,69 y acumula un alza de +$1.694,43 (+4,27%) en los últimos 12 meses.',
      'La UF se reajusta cada día entre el 10 de un mes y el 9 del siguiente repartiendo de manera pareja el IPC del mes anterior.',
      'La UF no siempre sube: si el IPC de un mes es 0,0% (como ocurrió hacia diciembre de 2025) se mantiene fija, y si el IPC es negativo, baja.'
    ]
  },
  {
    id: 'tpm',
    title: '¿Cómo decide el Banco Central si suben o bajan los créditos?',
    subtitle: 'El rol de la Tasa de Política Monetaria (TPM) explicado sin tecnicismos',
    category: 'Economía',
    readTime: '4 min',
    date: 'Política monetaria',
    accentHex: '#7A8B74',
    lead: '',
    sections: [],
    keyTakeaways: []
  },
  {
    id: 'luz',
    title: 'Tarifas eléctricas: ¿por qué subieron las cuentas de la luz?',
    subtitle: 'Desglose simple del descongelamiento tarifario, costos de generación y subsidios',
    category: 'Hogares',
    readTime: '4 min',
    date: 'Energía y bolsillo',
    accentHex: '#C29A63',
    lead: '',
    sections: [],
    keyTakeaways: []
  },
  {
    id: 'pensiones',
    title: 'Reforma previsional: claves para entender el debate de las pensiones',
    subtitle: 'Cómo se divide la cotización actual y qué discute el Congreso sobre el 6% adicional',
    category: 'Sociedad',
    readTime: '5 min',
    date: 'Políticas públicas',
    accentHex: '#64798A',
    lead: '',
    sections: [],
    keyTakeaways: []
  },
  {
    id: 'ia-elecciones',
    title: 'IA y desinformación: cómo detectar contenido falso en campañas',
    subtitle: 'Señales visuales, audios clonados y herramientas prácticas de verificación ciudadana',
    category: 'Tecnología',
    readTime: '4 min',
    date: 'Tecnología y democracia',
    accentHex: '#856B82',
    lead: '',
    sections: [],
    keyTakeaways: []
  }
];
