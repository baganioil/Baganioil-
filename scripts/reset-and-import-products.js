// Reset & Import All Products — Bagani Oil Sanity CMS
// Deletes all existing products, uploads images, creates fresh product documents
// Run: SANITY_API_TOKEN=your_token node scripts/reset-and-import-products.js

const { createClient } = require('@sanity/client')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const client = createClient({
  projectId: 'c7mgn6k7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const IMAGES_DIR = 'C:/Users/vince/Downloads/BAGANI WEBSITE PICS-20260419T075947Z-3-001/BAGANI WEBSITE PICS/PRODUCT'
const COMPRESSED_DIR = path.join(__dirname, 'compressed-images')

// ── Product image mapping ────────────────────────────────────────────────────
const IMAGE_MAP = {
  'bagani-4t-tempest':        'AMIHAN TEMPEST.png',
  'bagani-aman-deep':         'AMAN DEEP 90.png',
  'bagani-amihan-4t-gale':    'AMIHAN GALE.png',
  'bagani-amihan-4t-gust':    'AMIHAN GUST.png',
  'bagani-anitun-dxiii':      'ANITUN DXIII.png',
  'bagani-hanan-raze-20w-50': 'HANAN RAZE.png',
  'bagani-laon-burst-15w-40': 'LAON BURST.png',
  'bagani-laon-core':         'LAON CORE.png',
}

// ── Product data from TDS PDFs ───────────────────────────────────────────────
const PRODUCTS = [
  // ── 1. BAGANI 4T TEMPEST ──────────────────────────────────────────────────
  {
    _type: 'product',
    name: 'Bagani 4T Tempest',
    slug: { _type: 'slug', current: 'bagani-4t-tempest' },
    line: 'Amihan',
    category: 'amihan',
    spec: 'JASO MA-2 | API SL | SAE 20W-50 & 20W-40',
    shortDesc: 'High-speed top choice motorcycle engine oil for 4-stroke air-cooled and water-cooled engines.',
    description: 'BAGANI 4T TEMPEST is a high-quality multi-grade engine oil developed for four-stroke motorcycle engines, including both air-cooled and water-cooled systems. Its advanced wear protection formulation helps maintain consistent engine protection, particularly in motorcycles operating under high power and demanding conditions.',
    description2: 'Meets API Service Classification SL and complies with JASO T903 MA-2 specifications, making it suitable for many modern Japanese and European motorcycle models.',
    benefits: [
      { _type: 'object', _key: 'b1', title: 'Excellent Wear Protection', desc: 'Helps reduce friction and protects critical engine components from premature wear.' },
      { _type: 'object', _key: 'b2', title: 'Engine Cleanliness', desc: 'Formulated with effective detergent and dispersant additives to help keep internal engine parts clean and free from harmful deposits.' },
      { _type: 'object', _key: 'b3', title: 'Deposit and Sludge Control', desc: 'Helps minimize sludge formation, manage soot accumulation, and reduce the risk of piston ring sticking.' },
      { _type: 'object', _key: 'b4', title: 'Stable Viscosity Performance', desc: 'A high viscosity index combined with strong TBN reserves helps ensure reliable lubrication during cold starts and maintains protection at elevated operating temperatures.' },
      { _type: 'object', _key: 'b5', title: 'Reduced Oil Consumption', desc: 'Supports controlled oil usage while helping extend oil service intervals.' },
      { _type: 'object', _key: 'b6', title: 'Component Protection', desc: 'Maintains oil stability to protect critical parts such as the engine, clutch, and gear system.' },
    ],
    applicationText: 'BAGANI 4T TEMPEST is recommended for modern four-stroke motorcycle engines, suitable for both on-road motorcycles and off-road dirt bikes.\n\nIt is also appropriate for use in selected farm machinery and portable generator sets requiring similar lubricant specifications.',
    approvalsText: 'This product meets the requirements of API Service Classification SL and complies with JASO T903 MA-2 specifications, making it suitable for many modern Japanese and European motorcycle models.',
    availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX', '12X800ML BOX', '60X200ML BOX'],
    typicalProperties: {
      grades: ['20W-50', '20W-40'],
      rows: [
        { _type: 'object', _key: 'r1', property: 'Specific Gravity @ 15.6°C', values: ['0.884', '0.871'] },
        { _type: 'object', _key: 'r2', property: 'Flash Point, °C', values: ['234', '234'] },
        { _type: 'object', _key: 'r3', property: 'Pour Point, °C', values: ['-18.5', '-18.5'] },
        { _type: 'object', _key: 'r4', property: 'Viscosity @ 40°C, cSt', values: ['173', '120'] },
        { _type: 'object', _key: 'r5', property: 'Viscosity @ 100°C, cSt', values: ['18.6', '15.0'] },
        { _type: 'object', _key: 'r6', property: 'Viscosity Index', values: ['122', '128'] },
        { _type: 'object', _key: 'r7', property: 'Color, ASTM', values: ['3.5', '3.5'] },
        { _type: 'object', _key: 'r8', property: 'TBN, mgKOH/g', values: ['10.0', '10.0'] },
      ],
    },
  },

  // ── 2. BAGANI AMAN DEEP ───────────────────────────────────────────────────
  {
    _type: 'product',
    name: 'Bagani Aman Deep',
    slug: { _type: 'slug', current: 'bagani-aman-deep' },
    line: 'Aman',
    category: 'aman',
    spec: 'API GL-4 | SAE 90 & 140',
    shortDesc: 'Multi-purpose automotive gear lubricant with strong load-carrying capability and extreme pressure protection.',
    description: 'BAGANI AMAN DEEP is a multi-purpose gear lubricant developed to satisfy the performance requirements of API GL-4 service applications. It is manufactured using carefully selected base oils combined with a specialized additive system that delivers reliable performance, including strong load-carrying capability, resistance to oxidation and foaming, protection against oil thickening, and effective defense against rust and corrosion.',
    benefits: [
      { _type: 'object', _key: 'b1', title: 'API GL-4 Service Ready', desc: 'Specifically designed for API GL-4 service requirements.' },
      { _type: 'object', _key: 'b2', title: 'High Thermal Stability', desc: 'Helps maintain proper viscosity across a wide temperature range.' },
      { _type: 'object', _key: 'b3', title: 'Extreme Pressure Protection', desc: 'Extreme pressure and anti-wear additives help reduce direct metal-to-metal contact between gear components.' },
    ],
    applicationText: 'BAGANI AMAN DEEP is recommended for use in manual transmissions, axles, differentials, steering gear units, and other gear housings found in passenger cars, jeeps, trucks, and various utility vehicles.',
    approvalsText: 'BAGANI AMAN DEEP complies with the following standards: MIL-L-2105, Ford M2C 83A, Ford M2C 85A, Mercedes-Benz DB 235.1, ZF TE-ML 02 | TE-ML 07 | TE-ML 08, API Classification GL-4.',
    availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX', '4X4L BOX'],
    typicalProperties: {
      grades: ['SAE 90', 'SAE 140'],
      rows: [
        { _type: 'object', _key: 'r1', property: 'Specific Gravity @ 15.6°C', values: ['0.899', '0.910'] },
        { _type: 'object', _key: 'r2', property: 'Flash Point, °C', values: ['220', '231'] },
        { _type: 'object', _key: 'r3', property: 'Pour Point, °C', values: ['-12', '-9'] },
        { _type: 'object', _key: 'r4', property: 'Viscosity @ 40°C, cSt', values: ['188', '438'] },
        { _type: 'object', _key: 'r5', property: 'Viscosity @ 100°C, cSt', values: ['17.4', '28.9'] },
        { _type: 'object', _key: 'r6', property: 'Viscosity Index', values: ['93', '95'] },
      ],
    },
  },

  // ── 3. BAGANI AMIHAN 4T GALE ─────────────────────────────────────────────
  {
    _type: 'product',
    name: 'Bagani Amihan 4T Gale',
    slug: { _type: 'slug', current: 'bagani-amihan-4t-gale' },
    line: 'Amihan',
    category: 'amihan',
    spec: 'JASO MB | API SL | SAE 10W-40',
    shortDesc: 'Best performance semi-synthetic motorcycle engine oil specially made for scooters.',
    description: 'BAGANI AMIHAN 4T GALE is a semi-synthetic, multi-grade engine oil developed for 4-stroke motorcycles, formulated according to Japanese and U.S. performance standards. It is produced using high-quality base oils combined with advanced additive technology to deliver reliable engine protection and performance.',
    description2: 'Recognized and trusted by motorcycle enthusiasts and professional riders worldwide, BAGANI AMIHAN 4T GALE helps optimize engine operation for improved power output and efficiency.',
    benefits: [
      { _type: 'object', _key: 'b1', title: 'Performance Enhancement', desc: 'Designed to support stronger engine performance and smoother acceleration for an improved riding experience.' },
      { _type: 'object', _key: 'b2', title: 'Reliable Engine Protection', desc: 'Helps guard against rust, abrasion, and mechanical wear, extending engine life and maintaining optimal efficiency.' },
      { _type: 'object', _key: 'b3', title: 'Engine Cleanliness', desc: 'Advanced detergent additives help prevent deposit formation and keep internal engine components clean.' },
      { _type: 'object', _key: 'b4', title: 'Smooth Cold Start & Extended Oil Life', desc: 'Provides dependable cold-start lubrication while supporting longer oil service intervals.' },
    ],
    applicationText: 'BAGANI AMIHAN 4T GALE is specifically designed for modern four-stroke scooter engines and compatible motorcycles requiring a semi-synthetic lubricant.',
    approvalsText: 'This product meets the requirements of API Service Classification SL and complies with JASO T903 MB specifications, making it suitable for various Japanese and European motorcycle models.',
    availableSizes: ['200L DRUM', '20L PAIL', '12X800ML BOX'],
    typicalProperties: {
      grades: [],
      rows: [
        { _type: 'object', _key: 'r1', property: 'Specific Gravity @ 15.6°C', values: ['0.8674'] },
        { _type: 'object', _key: 'r2', property: 'Flash Point, °C', values: ['234'] },
        { _type: 'object', _key: 'r3', property: 'Pour Point, °C', values: ['-36'] },
        { _type: 'object', _key: 'r4', property: 'Viscosity @ 40°C, cSt', values: ['101'] },
        { _type: 'object', _key: 'r5', property: 'Viscosity @ 100°C, cSt', values: ['14.5'] },
        { _type: 'object', _key: 'r6', property: 'Viscosity Index', values: ['155'] },
        { _type: 'object', _key: 'r7', property: 'Color, ASTM', values: ['3.5'] },
        { _type: 'object', _key: 'r8', property: 'TBN, mgKOH/g', values: ['9.6'] },
      ],
    },
  },

  // ── 4. BAGANI AMIHAN 4T GUST ─────────────────────────────────────────────
  {
    _type: 'product',
    name: 'Bagani Amihan 4T Gust',
    slug: { _type: 'slug', current: 'bagani-amihan-4t-gust' },
    line: 'Amihan',
    category: 'amihan',
    spec: 'API SG | SAE 40 | JASO MA',
    shortDesc: 'High mileage motorcycle engine oil with enhanced wear protection and improved fuel efficiency.',
    description: 'BAGANI AMIHAN 4T GUST is a high-quality multi-grade engine oil developed for four-stroke motorcycle engines, including both air-cooled and water-cooled systems. Its advanced wear protection formulation helps maintain consistent engine protection, particularly in motorcycles operating under high power and demanding conditions.',
    benefits: [
      { _type: 'object', _key: 'b1', title: 'Enhanced Wear Protection', desc: 'Helps safeguard engine components against friction and premature wear.' },
      { _type: 'object', _key: 'b2', title: 'Lower Oil Consumption', desc: 'Supports reduced oil usage while helping maintain cleaner engine internals.' },
      { _type: 'object', _key: 'b3', title: 'Cost-Effective Maintenance', desc: 'Helps minimize engine deposits, contributing to reduced maintenance requirements.' },
      { _type: 'object', _key: 'b4', title: 'Improved Fuel Efficiency', desc: 'Promotes efficient engine performance and optimized fuel consumption.' },
    ],
    applicationText: 'BAGANI AMIHAN 4T GUST is suitable for modern Japanese and European motorcycles. It can also be used in small four-stroke gasoline-powered equipment such as generator sets, pumps, and garden machinery.',
    approvalsText: 'This product meets the requirements of API Service Classification SG/CD.',
    availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX', '60X200ML BOX'],
    typicalProperties: {
      grades: [],
      rows: [
        { _type: 'object', _key: 'r1', property: 'SAE Grade', values: ['40'] },
        { _type: 'object', _key: 'r2', property: 'Specific Gravity @ 15.6°C', values: ['0.8707'] },
        { _type: 'object', _key: 'r3', property: 'Flash Point, °C', values: ['237'] },
        { _type: 'object', _key: 'r4', property: 'Pour Point, °C', values: ['-11.5'] },
        { _type: 'object', _key: 'r5', property: 'Viscosity @ 40°C, cSt', values: ['147.39'] },
        { _type: 'object', _key: 'r6', property: 'Viscosity @ 100°C, cSt', values: ['15.8'] },
        { _type: 'object', _key: 'r7', property: 'Viscosity Index', values: ['112'] },
        { _type: 'object', _key: 'r8', property: 'Color, ASTM', values: ['3.0'] },
        { _type: 'object', _key: 'r9', property: 'TBN, mgKOH/g', values: ['6.0'] },
      ],
    },
  },

  // ── 5. BAGANI ANITUN DXIII ───────────────────────────────────────────────
  {
    _type: 'product',
    name: 'Bagani Anitun DXIII',
    slug: { _type: 'slug', current: 'bagani-anitun-dxiii' },
    line: 'Anitun',
    category: 'anitun',
    spec: 'ATF | GM Dexron III',
    shortDesc: 'High-performance automatic transmission fluid for off-highway equipment, power steering, and industrial systems.',
    description: 'BAGANI ANITUN DXIII is a high-performance automotive transmission fluid formulated from premium low-viscosity base oils and a complete additive package that includes viscosity index improvers, antioxidants, anti-wear agents, detergents, defoamants, and other specialized additives.',
    description2: 'NOTE: DO NOT USE DEXRON III ATF ON TRANSMISSIONS REQUIRING DEXRON IV/V & VI, ATF +2/+3/+4 AND MERCON V/VI.',
    benefits: [
      { _type: 'object', _key: 'b1', title: 'Oxidation Resistant', desc: 'Resistant to oxidation and thickening under high-temperature conditions.' },
      { _type: 'object', _key: 'b2', title: 'Seal Compatible', desc: 'Compatible with most commonly used sealing materials.' },
      { _type: 'object', _key: 'b3', title: 'Excellent Low-Temperature Flow', desc: 'Offers excellent low-temperature flow, anti-wear protection, and friction control.' },
    ],
    applicationText: 'This fluid is widely used in off-highway equipment and industrial systems, including power shift transmissions and hydraulic systems, where a Dexron III fluid is specified. It is also suitable for most power steering systems and Allison torque converters.',
    approvalsText: 'BAGANI ANITUN DXIII meets or exceeds: GM Dexron IIID / IIIG, Ford Mercon IV, Allison C4, Caterpillar TO-2 / TO-4, Hagglunds Denison HF-O.',
    availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX'],
    typicalProperties: {
      grades: [],
      rows: [
        { _type: 'object', _key: 'r1', property: 'Flash Point, °C', values: ['185'] },
        { _type: 'object', _key: 'r2', property: 'Pour Point, °C', values: ['-45'] },
        { _type: 'object', _key: 'r3', property: 'Base Oil Viscosity @ 40°C, cSt', values: ['37.59'] },
        { _type: 'object', _key: 'r4', property: 'Base Oil Viscosity @ 100°C, cSt', values: ['7.03'] },
        { _type: 'object', _key: 'r5', property: 'Viscosity Index', values: ['151'] },
        { _type: 'object', _key: 'r6', property: 'Density', values: ['0.8446'] },
      ],
    },
  },

  // ── 6. BAGANI HANAN RAZE 20W-50 ──────────────────────────────────────────
  {
    _type: 'product',
    name: 'Bagani Hanan Raze 20W-50',
    slug: { _type: 'slug', current: 'bagani-hanan-raze-20w-50' },
    line: 'Hanan',
    category: 'hanan',
    spec: 'SAE 20W-50 | API SL/CF',
    shortDesc: 'Premium multi-grade gasoline engine oil for year-round dependable performance and protection.',
    description: 'BAGANI HANAN RAZE 20W-50 is a premium multi-grade motor oil designed to deliver dependable performance in various driving conditions. It is blended from highly refined paraffinic base oils known for their strong stability and high viscosity index. The formulation includes a carefully balanced additive package featuring advanced detergents, dispersants, viscosity modifiers, and performance enhancers.',
    description2: 'Demonstrated strong performance in turbocharged and multi-valve engines and is also suitable for CRDi diesel engines meeting API CF specifications. Compliant with European standards including CCMC G5 and ACEA A3/B3.',
    benefits: [
      { _type: 'object', _key: 'b1', title: 'Enhanced Protection from Wear and Corrosion', desc: 'Helps safeguard engine components against rust formation and corrosive damage.' },
      { _type: 'object', _key: 'b2', title: 'Reliable Sludge Control', desc: 'Designed to resist sludge accumulation and maintain cleaner engine internals.' },
      { _type: 'object', _key: 'b3', title: 'High Resistance to Heat Breakdown', desc: 'Provides strong thermal stability to prevent oil degradation under high operating temperatures.' },
      { _type: 'object', _key: 'b4', title: 'Advanced Deposit Control', desc: 'Powerful cleaning agents minimize deposit buildup and promote smoother engine operation.' },
    ],
    applicationText: 'BAGANI HANAN RAZE 20W-50 is developed for year-round use in a wide range of vehicles. It delivers excellent engine cleanliness and dependable protection against wear, corrosion, deposits, and sludge under different driving environments. It has demonstrated strong performance in turbocharged and multi-valve engines and is also suitable for CRDi diesel engines meeting API CF specifications.',
    approvalsText: 'This product surpasses the warranty requirements of most passenger cars and light-duty trucks where API SL/CF performance levels are specified. It is also compliant with European standards including CCMC G5 and ACEA A3/B3.',
    availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX', '4X4L BOX'],
    typicalProperties: {
      grades: [],
      rows: [
        { _type: 'object', _key: 'r1', property: 'SAE Grade', values: ['20W-50'] },
        { _type: 'object', _key: 'r2', property: 'Specific Gravity @ 15.6°C', values: ['0.882'] },
        { _type: 'object', _key: 'r3', property: 'Flash Point, °C', values: ['230'] },
        { _type: 'object', _key: 'r4', property: 'Pour Point, °C', values: ['-20'] },
        { _type: 'object', _key: 'r5', property: 'Viscosity @ 40°C, cSt', values: ['176'] },
        { _type: 'object', _key: 'r6', property: 'Viscosity @ 100°C, cSt', values: ['18.8'] },
        { _type: 'object', _key: 'r7', property: 'Viscosity Index', values: ['125'] },
        { _type: 'object', _key: 'r8', property: 'Color, ASTM', values: ['3.5'] },
        { _type: 'object', _key: 'r9', property: 'TBN, mgKOH/g', values: ['10.0'] },
      ],
    },
  },

  // ── 7. BAGANI LAON BURST 15W-40 ──────────────────────────────────────────
  {
    _type: 'product',
    name: 'Bagani Laon Burst 15W-40',
    slug: { _type: 'slug', current: 'bagani-laon-burst-15w-40' },
    line: 'Laon',
    category: 'laon',
    spec: 'SAE 15W-40 | API CI-4/SL',
    shortDesc: 'Peak power top choice diesel engine oil for light and heavy-duty commercial vehicles and mixed-fleet operations.',
    description: 'BAGANI LAON BURST 15W-40 is a high-quality commercial multi-grade engine oil suitable for both light and heavy-duty diesel and gasoline engines. It is specifically formulated for the lubrication of commercial vehicle engines, including those operating on high-sulfur diesel fuels. This oil meets the performance requirements of modern low-emission diesel engines as well as high-performance gasoline engines, making it ideal for mixed-fleet operations.',
    description2: 'BAGANI LAON BURST 15W-40 is engineered to provide excellent thermal and oxidation stability, high levels of detergency and dispersancy, effective corrosion protection, and superior load-carrying capacity. The advanced additive package reduces wear on cylinder bores and piston rings, extending engine life.',
    benefits: [
      { _type: 'object', _key: 'b1', title: 'Thermal and Oxidation Stability', desc: 'Keeps engines clean under both high and low temperature conditions.' },
      { _type: 'object', _key: 'b2', title: 'High Detergency and Dispersancy', desc: 'Effectively manages contaminants and maintains engine cleanliness in commercial engines.' },
      { _type: 'object', _key: 'b3', title: 'Extended Engine Life', desc: 'Reduces wear on cylinder bores and piston rings, extending engine life.' },
      { _type: 'object', _key: 'b4', title: 'Mixed-Fleet Compatible', desc: 'Suitable for both diesel and gasoline engines under severe service conditions.' },
    ],
    applicationText: 'This multi-grade oil is designed for high-speed turbocharged or naturally aspirated diesel and gasoline engines operating under severe service conditions, such as those encountered in commercial transport and heavy construction equipment. Its versatility makes it suitable for mixed-fleet applications.',
    approvalsText: 'BAGANI LAON BURST 15W-40 meets the following industry standards:\n• API: CI-4 / CH-4 / CG-4 / SJ / SL\n• ACEA: E3-96 Issue 3, E5-99, B3-98, A3-98\n• Mercedes-Benz: 228.1 & 228.3\n• MAN: 3275\n• MACK: EO-M Plus\n• Volvo: VDS-2\n• RVI: RLD 99\n• Cummins: 20072, 20076, 20077',
    availableSizes: ['200L DRUM', '20L PAIL', '18L PAIL', '12X1L BOX', '4X4L BOX'],
    typicalProperties: {
      grades: [],
      rows: [
        { _type: 'object', _key: 'r1', property: 'SAE Grade', values: ['15W-40'] },
        { _type: 'object', _key: 'r2', property: 'Specific Gravity @ 15.6°C', values: ['0.880'] },
        { _type: 'object', _key: 'r3', property: 'Flash Point, °C', values: ['238'] },
        { _type: 'object', _key: 'r4', property: 'Viscosity @ 40°C, cSt', values: ['112'] },
        { _type: 'object', _key: 'r5', property: 'Viscosity @ 100°C, cSt', values: ['14.35'] },
        { _type: 'object', _key: 'r6', property: 'Viscosity Index', values: ['136'] },
        { _type: 'object', _key: 'r7', property: 'TBN, mgKOH/g', values: ['11'] },
      ],
    },
  },

  // ── 8. BAGANI LAON CORE ───────────────────────────────────────────────────
  {
    _type: 'product',
    name: 'Bagani Laon Core',
    slug: { _type: 'slug', current: 'bagani-laon-core' },
    line: 'Laon',
    category: 'laon',
    spec: 'API CF/SF | SAE 10/10W, 30, 40 & 50',
    shortDesc: 'Super heavy-duty engine oil for diesel and gasoline engines. Available in SAE 10/10W, 30, 40 & 50.',
    description: 'BAGANI LAON CORE is a high-performance motor oil designed to deliver premium protection for both diesel and gasoline engines. It is especially formulated for heavy-duty operation in diesel engines used in on-highway and off-highway vehicles and equipment.',
    description2: 'SAE 10W and SAE 30 grades meet GMC Allison C-3 requirements for hydraulic transmission fluids and can be used in automatic transmissions, torque converters, and hydraulic systems requiring this level of quality.',
    benefits: [
      { _type: 'object', _key: 'b1', title: 'Advanced Dispersant Technology', desc: 'Helps prevent oil thickening caused by incomplete combustion and soot formation.' },
      { _type: 'object', _key: 'b2', title: 'Sludge Reduction', desc: 'Reduces sludge buildup and keeps particles suspended, extending the life of oil filters.' },
      { _type: 'object', _key: 'b3', title: 'Mixed-Fleet Convenience', desc: 'Suitable for gasoline engines as well, providing mixed-fleet operators the convenience of using a single motor oil across all vehicles.' },
    ],
    applicationText: '• Recommended as a crankcase lubricant for diesel engines in automotive, industrial, and heavy construction equipment, whether naturally aspirated or turbocharged.\n• Ideal for fleet operations where grade simplification is preferred, also suitable for gasoline engines in passenger cars and trucks.\n• SAE 10W and SAE 30 grades meet GMC Allison C-3 requirements for hydraulic transmission fluids.',
    approvalsText: 'BAGANI LAON CORE meets the requirements of API CF / CF-2 / SF and is approved to meet the following standards: ACEA: E1-96, Mercedes-Benz: p.227.0, Caterpillar: TO2 & TO4 Friction Test, MIL: L-2104D, L-46152B, Allison: C-3 / C-4.',
    availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX'],
    typicalProperties: {
      grades: ['SAE 10/10W', 'SAE 30', 'SAE 40', 'SAE 50'],
      rows: [
        { _type: 'object', _key: 'r1', property: 'Specific Gravity @ 15.6°C', values: ['0.875', '0.890', '0.893', '0.895'] },
        { _type: 'object', _key: 'r2', property: 'Flash Point, °C', values: ['213', '230', '238', '240'] },
        { _type: 'object', _key: 'r3', property: 'Pour Point, °C', values: ['-12', '-12', '-12', '-12'] },
        { _type: 'object', _key: 'r4', property: 'Viscosity @ 40°C, cSt', values: ['44', '118', '147', '218'] },
        { _type: 'object', _key: 'r5', property: 'Viscosity @ 100°C, cSt', values: ['6.96', '11.9', '14.5', '19'] },
        { _type: 'object', _key: 'r6', property: 'Viscosity Index', values: ['115', '96', '99', '99'] },
        { _type: 'object', _key: 'r7', property: 'Color, ASTM', values: ['3', '3', '3.5', '4.0'] },
        { _type: 'object', _key: 'r8', property: 'TBN, mgKOH/g', values: ['9.0', '9.0', '9.0', '9.0'] },
      ],
    },
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
async function compressAndUploadImage(imageName) {
  const inputPath = path.join(IMAGES_DIR, imageName)
  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠️  Image not found: ${imageName}`)
    return null
  }
  const outputPath = path.join(COMPRESSED_DIR, imageName)
  const sizeMB = fs.statSync(inputPath).size / (1024 * 1024)
  if (sizeMB > 5) {
    console.log(`  Compressing (${sizeMB.toFixed(1)}MB)...`)
    await sharp(inputPath)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(outputPath)
  } else {
    fs.copyFileSync(inputPath, outputPath)
  }
  const buffer = fs.readFileSync(outputPath)
  const asset = await client.assets.upload('image', buffer, { filename: imageName, contentType: 'image/png' })
  console.log(`  Image uploaded: ${asset._id}`)
  return asset._id
}

// ── Step 1: Delete all existing products ────────────────────────────────────
async function deleteAllProducts() {
  console.log('\n🗑️  Deleting all existing products...')
  const allIds = await client.fetch(`*[_type == "product"]._id`)
  if (!allIds.length) { console.log('  No products to delete.'); return }

  for (const id of allIds) {
    try {
      await client.delete(id)
      console.log(`  Deleted: ${id}`)
    } catch (err) {
      console.log(`  Skipped (already gone): ${id}`)
    }
  }
  console.log(`  ✅ Done`)
}

// ── Step 2: Create products + upload images ──────────────────────────────────
async function importProducts() {
  if (!fs.existsSync(COMPRESSED_DIR)) fs.mkdirSync(COMPRESSED_DIR)

  for (const product of PRODUCTS) {
    console.log(`\n📦 Creating: ${product.name}`)

    // Upload image
    const imageName = IMAGE_MAP[product.slug.current]
    let imageRef = null
    if (imageName) {
      try {
        imageRef = await compressAndUploadImage(imageName)
      } catch (err) {
        console.log(`  ⚠️  Image skipped (corrupt or unreadable): ${err.message}`)
      }
    }

    // Build document
    const doc = { ...product }
    if (imageRef) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: imageRef } }
    }

    // Create in Sanity (as draft)
    const result = await client.create(doc)
    console.log(`  ✅ Created (ID: ${result._id})`)

    // Publish immediately
    const publishId = result._id.replace(/^drafts\./, '')
    await client
      .patch(result._id)
      .set({ _id: publishId })
      .commit()
      .catch(() => {})

    // Use createOrReplace to publish
    await client.createOrReplace({ ...doc, _id: publishId, image: doc.image })
    console.log(`  ✅ Published`)
  }

  // Cleanup compressed folder
  fs.rmSync(COMPRESSED_DIR, { recursive: true, force: true })
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN. Run:')
    console.error('   SANITY_API_TOKEN=your_token node scripts/reset-and-import-products.js')
    process.exit(1)
  }

  await deleteAllProducts()
  await importProducts()

  console.log('\n🎉 Done! All 8 products imported and published.')
  console.log('   Open https://baganioil.ph/products/ to verify.')
}

main().catch(err => { console.error('❌ Fatal error:', err.message); process.exit(1) })
