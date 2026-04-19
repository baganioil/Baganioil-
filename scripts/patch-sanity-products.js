// Sanity Product Patch Script — Updates existing products with new TDS fields
// Run: SANITY_API_TOKEN=<write_token> node scripts/patch-sanity-products.js
// Get your write token from: https://sanity.io/manage → project c7mgn6k7 → API → Tokens

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'c7mgn6k7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function mkKey(prefix, i) { return prefix + i }

function benefits(arr) {
  return arr.map((b, i) => ({ _type: 'object', _key: mkKey('b', i + 1), title: b.title || '', desc: b.desc || '' }))
}

function faqs(arr) {
  return arr.map((f, i) => ({ _type: 'object', _key: mkKey('faq', i + 1), q: f.q, a: f.a }))
}

function typicalProperties(tp) {
  return {
    grades: tp.grades || [],
    rows: (tp.rows || []).map((r, i) => ({
      _type: 'object',
      _key: mkKey('row', i + 1),
      property: r.property,
      values: r.values,
    })),
  }
}

const patches = [
  {
    name: 'Bagani Amihan 4T Gale',
    data: {
      slug: { _type: 'slug', current: 'bagani-amihan-4t-gale' },
      category: 'amihan motorcycle-scooter v10w40',
      spec: 'SAE 10W-40 | Semi-Synthetic | JASO MB',
      shortDesc: 'Best performance semi-synthetic motorcycle engine oil. Specially made for scooters.',
      benefits: benefits([
        { title: 'Performance Enhancement', desc: 'Designed to support stronger engine performance and smoother acceleration for an improved riding experience.' },
        { title: 'Reliable Engine Protection', desc: 'Helps guard against rust, abrasion, and mechanical wear, extending engine life and maintaining optimal efficiency.' },
        { title: 'Engine Cleanliness', desc: 'Advanced detergent additives help prevent deposit formation and keep internal engine components clean.' },
        { title: 'Smooth Cold Start & Extended Oil Life', desc: 'Provides dependable cold-start lubrication while supporting longer oil service intervals.' },
      ]),
      applicationText: 'BAGANI AMIHAN 4T GALE is specifically designed for modern four-stroke scooter engines and compatible motorcycles requiring a semi-synthetic lubricant.',
      approvalsText: 'This product meets the requirements of API Service Classification SL and complies with JASO T903 MB specifications, making it suitable for various Japanese and European motorcycle models.',
      availableSizes: ['200L DRUM', '20L PAIL', '12X800ML BOX'],
      typicalProperties: typicalProperties({
        grades: [],
        rows: [
          { property: 'Specific Gravity @ 15.6 °C', values: ['0.8674'] },
          { property: 'Flash Point, °C', values: ['234'] },
          { property: 'Pour Point, °C', values: ['-36'] },
          { property: 'Viscosity @ 40 °C, cSt', values: ['101'] },
          { property: 'Viscosity @ 100 °C, cSt', values: ['14.5'] },
          { property: 'Viscosity Index', values: ['155'] },
          { property: 'Color, ASTM', values: ['3.5'] },
          { property: 'TBN, mgKOH/g', values: ['9.6'] },
        ],
      }),
      faqs: faqs([
        { q: 'Is Bagani Amihan 4T Gale good for my scooter?', a: 'Yes! The Amihan 4T Gale is JASO MB certified and specifically designed for scooters and CVT-equipped motorcycles.' },
        { q: 'What does JASO MB mean?', a: 'JASO MB is a Japanese standard optimized for scooters and motorcycles with CVT transmissions, where reduced friction between the clutch plates is needed.' },
        { q: 'What makes this oil semi-synthetic?', a: 'It is blended from high-quality synthetic and mineral base oils, offering better protection and performance than conventional mineral oils at a more accessible price than full synthetics.' },
      ]),
    },
  },
  {
    name: 'Bagani Amihan 4T Gust',
    data: {
      slug: { _type: 'slug', current: 'bagani-amihan-4t-gust' },
      category: 'amihan motorcycle-scooter vsae40',
      spec: 'SAE 40 | JASO MA | SG/CD',
      shortDesc: 'High mileage motorcycle engine oil for daily riders. Reliable protection for 4-stroke engines.',
      benefits: benefits([
        { title: 'Enhanced Wear Protection', desc: 'Helps safeguard engine components against friction and premature wear.' },
        { title: 'Lower Oil Consumption', desc: 'Supports reduced oil usage while helping maintain cleaner engine internals.' },
        { title: 'Cost-Effective Maintenance', desc: 'Helps minimize engine deposits, contributing to reduced maintenance requirements.' },
        { title: 'Improved Fuel Efficiency', desc: 'Promotes efficient engine performance and optimized fuel consumption.' },
      ]),
      applicationText: 'BAGANI AMIHAN 4T GUST is suitable for modern Japanese and European motorcycles. It can also be used in small four-stroke gasoline-powered equipment such as generator sets, pumps, and garden machinery.',
      approvalsText: 'This product meets the requirements of API Service Classification SG/CD.',
      availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX', '60X200ML BOX'],
      typicalProperties: typicalProperties({
        grades: [],
        rows: [
          { property: 'SAE Grade', values: ['40'] },
          { property: 'Specific Gravity @ 15.6 °C', values: ['0.8707'] },
          { property: 'Flash Point, °C', values: ['237'] },
          { property: 'Pour Point, °C', values: ['-11.5'] },
          { property: 'Viscosity @ 40 °C, cSt', values: ['147.39'] },
          { property: 'Viscosity @ 100 °C, cSt', values: ['15.8'] },
          { property: 'Viscosity Index', values: ['112'] },
          { property: 'Color, ASTM', values: ['3.0'] },
          { property: 'TBN, mgKOH/g', values: ['6.0'] },
        ],
      }),
      faqs: faqs([
        { q: 'Is Amihan 4T Gust good for daily commuting?', a: 'Yes, the Amihan 4T Gust is formulated for reliable daily performance. SAE 40 viscosity provides consistent protection across a wide range of riding conditions.' },
        { q: 'How often should I change the oil?', a: 'We recommend every 2,000–3,000 km under normal conditions, or every 1,500 km for heavy-duty use.' },
        { q: 'Can I use this for my generator or water pump?', a: 'Yes. The Amihan 4T Gust is suitable for small 4-stroke gasoline-powered equipment such as generator sets, pumps, and garden machinery.' },
      ]),
    },
  },
  {
    name: 'Bagani Amihan 4T Tempest',
    data: {
      slug: { _type: 'slug', current: 'bagani-amihan-4t-tempest' },
      category: 'amihan motorcycle-scooter v20w50 v20w40',
      spec: 'SAE 20W-50 / 20W-40 | JASO MA-2 | SL',
      shortDesc: 'High speed top choice motorcycle engine oil. Superior protection for high-power 4-stroke engines.',
      benefits: benefits([
        { title: 'Excellent Wear Protection', desc: 'Helps reduce friction and protects critical engine components from premature wear.' },
        { title: 'Engine Cleanliness', desc: 'Formulated with effective detergent and dispersant additives to help keep internal engine parts clean and free from harmful deposits.' },
        { title: 'Deposit and Sludge Control', desc: 'Helps minimize sludge formation, manage soot accumulation, and reduce the risk of piston ring sticking.' },
        { title: 'Stable Viscosity Performance', desc: 'A high viscosity index combined with strong TBN reserves helps ensure reliable lubrication during cold starts and maintains protection at elevated operating temperatures.' },
        { title: 'Reduced Oil Consumption', desc: 'Supports controlled oil usage while helping extend oil service intervals.' },
        { title: 'Component Protection', desc: 'Maintains oil stability to protect critical parts such as the engine, clutch, and gear system.' },
      ]),
      applicationText: 'BAGANI 4T TEMPEST is recommended for modern four-stroke motorcycle engines, suitable for both on-road motorcycles and off-road dirt bikes. It is also appropriate for use in selected farm machinery and portable generator sets requiring similar lubricant specifications.',
      approvalsText: 'This product meets the requirements of API Service Classification SL and complies with JASO T903 MA-2 specifications, making it suitable for many modern Japanese and European motorcycle models.',
      availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX', '12X800ML BOX', '60X200ML BOX'],
      typicalProperties: typicalProperties({
        grades: ['BAGANI 4T TEMPEST 20W-50', 'BAGANI 4T TEMPEST 20W-40'],
        rows: [
          { property: 'Specific Gravity @ 15.6 °C', values: ['0.884', '0.871'] },
          { property: 'Flash Point, °C', values: ['234', '234'] },
          { property: 'Pour Point, °C', values: ['-18.5', '-18.5'] },
          { property: 'Viscosity @ 40 °C, cSt', values: ['173', '120'] },
          { property: 'Viscosity @ 100 °C, cSt', values: ['18.6', '15.0'] },
          { property: 'Viscosity Index', values: ['122', '128'] },
          { property: 'Color, ASTM', values: ['3.5', '3.5'] },
          { property: 'TBN, mgKOH/g', values: ['10.0', '10.0'] },
        ],
      }),
      faqs: faqs([
        { q: 'What is the difference between 20W-50 and 20W-40?', a: 'The 20W-50 is thicker at operating temperature, better for high-heat or high-load conditions. The 20W-40 offers slightly better flow in moderate climates. Both provide excellent protection for high-power motorcycles.' },
        { q: 'What does JASO MA-2 mean?', a: 'JASO MA-2 is the highest JASO friction standard for wet clutch motorcycles. It ensures the oil provides the right friction characteristics to prevent clutch slippage in high-performance bikes.' },
        { q: 'Is this suitable for my dirt bike?', a: 'Yes, the Amihan 4T Tempest is suitable for both on-road motorcycles and off-road dirt bikes requiring API SL / JASO MA-2 performance.' },
      ]),
    },
  },
  {
    name: 'Bagani Aman Deep',
    data: {
      slug: { _type: 'slug', current: 'bagani-aman-deep' },
      category: 'aman gear-oil vsae90',
      spec: 'SAE 90 / 140 | API GL-4 | Gear Oil',
      shortDesc: 'Multi-purpose automotive gear lubricant. Superior load-carrying capacity for manual transmissions and differentials.',
      benefits: benefits([
        { title: '', desc: 'Specifically designed for API GL-4 service requirements.' },
        { title: '', desc: 'High thermal stability helps maintain proper viscosity across a wide temperature range.' },
        { title: '', desc: 'Extreme pressure and anti-wear additives help reduce direct metal-to-metal contact between gear components.' },
      ]),
      applicationText: 'BAGANI AMAN DEEP is recommended for use in manual transmissions, axles, differentials, steering gear units, and other gear housings found in passenger cars, jeeps, trucks, and various utility vehicles.',
      approvalsText: 'BAGANI AMAN DEEP complies with the following standards: MIL-L-2105, Ford M2C 83A, Ford M2C 85A, Mercedes-Benz DB 235.1, ZF TE-ML 02 | TE-ML 07 | TE-ML 08, API Classification GL-4.',
      availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX', '4X4L BOX'],
      typicalProperties: typicalProperties({
        grades: ['SAE 90', 'SAE 140'],
        rows: [
          { property: 'Specific Gravity @ 15.6 °C', values: ['0.899', '0.910'] },
          { property: 'Flash Point, °C', values: ['220', '231'] },
          { property: 'Pour Point, °C', values: ['-12', '-9'] },
          { property: 'Viscosity @ 40 °C, cSt', values: ['188', '438'] },
          { property: 'Viscosity @ 100 °C, cSt', values: ['17.4', '28.9'] },
          { property: 'Viscosity Index', values: ['93', '95'] },
        ],
      }),
      faqs: faqs([
        { q: 'What is API GL-4 and when do I need it?', a: 'API GL-4 is a gear oil service category suitable for manual transmissions, axles, and differentials operating under moderate to severe conditions. Check your vehicle owner\'s manual to confirm if GL-4 is required.' },
        { q: 'Can I use SAE 90 and SAE 140 interchangeably?', a: 'No. SAE 90 is for most standard applications. SAE 140 is thicker, intended for heavily loaded differentials operating at high temperatures. Always follow your vehicle\'s specifications.' },
        { q: 'Is Aman Deep suitable for my jeepney or truck?', a: 'Yes. Bagani Aman Deep GL-4 is formulated for passenger cars, jeeps, trucks, and utility vehicles with manual transmissions and axles requiring GL-4 performance.' },
      ]),
    },
  },
  {
    name: 'Bagani Anitun DXIII',
    data: {
      slug: { _type: 'slug', current: 'bagani-anitun-dxiii' },
      category: 'anitun transmission',
      spec: 'GM DEXRON III | Automatic Transmission Fluid',
      shortDesc: 'High-performance automatic transmission fluid. Excellent low-temperature flow, anti-wear protection, and friction control.',
      benefits: benefits([
        { title: '', desc: 'Resistant to oxidation and thickening under high-temperature conditions.' },
        { title: '', desc: 'Compatible with most commonly used sealing materials.' },
        { title: '', desc: 'Offers excellent low-temperature flow, anti-wear protection, and friction control.' },
      ]),
      applicationText: 'This fluid is widely used in off-highway equipment and industrial systems, including power shift transmissions and hydraulic systems, where a Dexron III fluid is specified. It is also suitable for most power steering systems and Allison torque converters.\n\nIMPORTANT: Do NOT use Dexron III ATF in transmissions requiring Dexron IV/V/VI, ATF +2/+3/+4, or Mercon V/VI.',
      approvalsText: 'BAGANI ANITUN DXIII meets or exceeds: GM Dexron IIID / IIIG, Ford Mercon IV, Allison C4, Caterpillar TO-2 / TO-4, Hagglunds Denison HF-O.',
      availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX'],
      typicalProperties: typicalProperties({
        grades: [],
        rows: [
          { property: 'Flash Point, °C', values: ['185'] },
          { property: 'Pour Point, °C', values: ['-45'] },
          { property: 'Base Oil Viscosity @ 40 °C, cSt', values: ['37.59'] },
          { property: 'Base Oil Viscosity @ 100 °C, cSt', values: ['7.03'] },
          { property: 'Viscosity Index', values: ['151'] },
          { property: 'Density', values: ['0.8446'] },
        ],
      }),
      faqs: faqs([
        { q: 'Can I use Anitun DXIII in my automatic transmission?', a: 'Yes, if your vehicle specifies Dexron III ATF. Always consult your owner\'s manual to confirm the correct ATF specification.' },
        { q: 'Is Dexron III compatible with Dexron VI?', a: 'No. Do NOT use Dexron III ATF in transmissions requiring Dexron IV/V/VI, ATF +2/+3/+4, or Mercon V/VI. Using the wrong fluid can damage your transmission.' },
        { q: 'Can this be used in power steering systems?', a: 'Yes, Bagani Anitun DXIII is suitable for most power steering systems that specify Dexron III ATF.' },
      ]),
    },
  },
  {
    name: 'Bagani Hanan Raze 20W-50',
    data: {
      slug: { _type: 'slug', current: 'bagani-hanan-raze' },
      category: 'hanan gasoline v20w50',
      spec: 'SAE 20W-50 | API SL/CF | Gasoline Engine Oil',
      shortDesc: 'High speed top choice premium gasoline engine oil. Dependable protection for passenger cars and light-duty trucks.',
      benefits: benefits([
        { title: 'Enhanced Protection from Wear and Corrosion', desc: 'Helps safeguard engine components against rust formation and corrosive damage.' },
        { title: 'Reliable Sludge Control', desc: 'Designed to resist sludge accumulation and maintain cleaner engine internals.' },
        { title: 'High Resistance to Heat Breakdown', desc: 'Provides strong thermal stability to prevent oil degradation under high operating temperatures.' },
        { title: 'Advanced Deposit Control', desc: 'Powerful cleaning agents minimize deposit buildup and promote smoother engine operation.' },
      ]),
      applicationText: 'BAGANI HANAN RAZE PRO 20W-50 is developed for year-round use in a wide range of vehicles. Made with high-quality mineral base oils and modern additive technology, it delivers excellent engine cleanliness and dependable protection against wear, corrosion, deposits, and sludge under different driving environments. It has demonstrated strong performance in turbocharged and multi-valve engines and is also suitable for CRDi diesel engines meeting API CF specifications.',
      approvalsText: 'This product surpasses the warranty requirements of most passenger cars and light-duty trucks where API SL/CF performance levels are specified. It is also compliant with European standards including CCMC G5 and ACEA A3/B3.',
      availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX', '4X4L BOX'],
      typicalProperties: typicalProperties({
        grades: ['BAGANI HANAN RAZE 20W-50'],
        rows: [
          { property: 'Specific Gravity @ 15.6 °C', values: ['0.882'] },
          { property: 'Flash Point, °C', values: ['230'] },
          { property: 'Pour Point, °C', values: ['-20'] },
          { property: 'Viscosity @ 40 °C, cSt', values: ['176'] },
          { property: 'Viscosity @ 100 °C, cSt', values: ['18.8'] },
          { property: 'Viscosity Index', values: ['125'] },
          { property: 'Color, ASTM', values: ['3.5'] },
          { property: 'TBN, mgKOH/g', values: ['10.0'] },
        ],
      }),
      faqs: faqs([
        { q: 'Can Hanan Raze be used in both gasoline and diesel engines?', a: 'Yes. The API SL/CF rating means it meets both gasoline (SL) and certain diesel (CF) engine requirements, though it is primarily formulated for gasoline engines.' },
        { q: 'Is this oil suitable for turbocharged engines?', a: 'Yes, Bagani Hanan Raze 20W-50 is suitable for turbocharged and multi-valve gasoline engines.' },
        { q: 'How often should I change engine oil?', a: 'Under normal driving conditions, every 5,000–7,500 km. For severe conditions (extreme heat, heavy loads, stop-and-go traffic), every 3,000–5,000 km. Always follow your vehicle manufacturer\'s recommendation.' },
      ]),
    },
  },
  {
    name: 'Bagani Laon Burst 15W-40',
    data: {
      slug: { _type: 'slug', current: 'bagani-laon-burst' },
      category: 'laon diesel gasoline v15w40',
      spec: 'SAE 15W-40 | API CI-4/SL | Heavy Duty',
      shortDesc: 'Peak power top choice diesel engine oil. For light and heavy-duty diesel and gasoline engines.',
      benefits: benefits([
        { title: '', desc: 'Engineered to provide excellent thermal and oxidation stability, high levels of detergency and dispersancy, effective corrosion protection, and superior load-carrying capacity.' },
        { title: '', desc: 'These properties help keep engines clean under both high and low temperature conditions.' },
        { title: '', desc: 'The advanced additive package also reduces wear on cylinder bores and piston rings, extending engine life.' },
      ]),
      applicationText: 'This multi-grade oil is designed for high-speed turbocharged or naturally aspirated diesel and gasoline engines operating under severe service conditions, such as those encountered in commercial transport and heavy construction equipment. Its versatility makes it suitable for mixed-fleet applications commonly used in these industries.',
      approvalsText: 'BAGANI LAON BURST 15W-40 meets the following industry standards: API CI-4 / CH-4 / CG-4 / SJ / SL; ACEA E3-96 Issue 3, E5-99, B3-98, A3-98; Mercedes-Benz 228.1 & 228.3; MAN 3275; MACK EO-M Plus; Volvo VDS-2; RVI RLD 99; Cummins 20072, 20076, 20077.',
      availableSizes: ['200L DRUM', '20L PAIL', '18L PAIL', '12X1L BOX', '4X4L BOX'],
      typicalProperties: typicalProperties({
        grades: ['BAGANI LAON BURST 15W-40'],
        rows: [
          { property: 'Specific Gravity @ 15.6 °C', values: ['0.880'] },
          { property: 'Flash Point, °C', values: ['238'] },
          { property: 'Viscosity @ 40 °C, cSt', values: ['112'] },
          { property: 'Viscosity @ 100 °C, cSt', values: ['14.35'] },
          { property: 'Viscosity Index', values: ['136'] },
          { property: 'TBN, mgKOH/g', values: ['11'] },
        ],
      }),
      faqs: faqs([
        { q: 'Can Laon Burst 15W-40 be used in both diesel and gasoline engines?', a: 'Yes. The API CI-4/SL rating makes it suitable for both heavy-duty diesel and gasoline engines, ideal for mixed-fleet operations.' },
        { q: 'Is this oil suitable for turbocharged trucks?', a: 'Yes, Bagani Laon Burst 15W-40 is specifically formulated for high-speed turbocharged and naturally aspirated diesel engines in commercial vehicles.' },
        { q: 'What is TBN and why does it matter?', a: 'TBN (Total Base Number) measures the oil\'s ability to neutralize acids. A TBN of 11 mgKOH/g means Laon Burst provides strong acid neutralization, protecting your engine from corrosion caused by combustion byproducts.' },
      ]),
    },
  },
  {
    name: 'Bagani Laon Core',
    data: {
      slug: { _type: 'slug', current: 'bagani-laon-core' },
      category: 'laon diesel gasoline',
      spec: 'SAE 10W / 30 / 40 / 50 | API CF/SF | Super Heavy Duty',
      shortDesc: 'Super heavy duty engine oil. Premium protection for diesel and gasoline engines in multiple grades.',
      benefits: benefits([
        { title: '', desc: 'Advanced dispersant technology helps prevent oil thickening caused by incomplete combustion and soot formation.' },
        { title: '', desc: 'Reduces sludge buildup and keeps particles suspended, extending the life of oil filters.' },
        { title: '', desc: 'Suitable for gasoline engines as well, providing mixed-fleet operators the convenience of using a single motor oil across all vehicles.' },
      ]),
      applicationText: 'Recommended as a crankcase lubricant for diesel engines in automotive, industrial, and heavy construction equipment, whether naturally aspirated or turbocharged.\n\nIdeal for fleet operations where grade simplification is preferred, also suitable for gasoline engines in passenger cars and trucks following manufacturer maintenance schedules.\n\nSAE 10W and SAE 30 grades meet GMC Allison C-3 requirements for hydraulic transmission fluids, and can be used in automatic transmissions, torque converters, and hydraulic systems requiring this level of quality.',
      approvalsText: 'BAGANI LAON CORE meets the requirements of API CF / CF-2 / SF and is approved to meet the following standards: ACEA E1-96; Mercedes-Benz p.227.0; Caterpillar TO2 & TO4 Friction Test; MIL L-2104D, L-46152B; Allison C-3 / C-4.',
      availableSizes: ['200L DRUM', '20L PAIL', '12X1L BOX'],
      typicalProperties: typicalProperties({
        grades: ['SAE 10/10W', 'SAE 30', 'SAE 40', 'SAE 50'],
        rows: [
          { property: 'Specific Gravity @ 15.6 °C', values: ['0.875', '0.890', '0.893', '0.895'] },
          { property: 'Flash Point, °C', values: ['213', '230', '238', '240'] },
          { property: 'Pour Point, °C', values: ['-12', '-12', '-12', '-12'] },
          { property: 'Viscosity @ 40 °C, cSt', values: ['44', '118', '147', '218'] },
          { property: 'Viscosity @ 100 °C, cSt', values: ['6.96', '11.9', '14.5', '19'] },
          { property: 'Viscosity Index', values: ['115', '96', '99', '99'] },
          { property: 'Color, ASTM', values: ['3', '3', '3.5', '4.0'] },
          { property: 'TBN, mgKOH/g', values: ['9.0', '9.0', '9.0', '9.0'] },
        ],
      }),
      faqs: faqs([
        { q: 'Which SAE grade of Laon Core should I use?', a: 'SAE 30 and 40 are most common for standard operating temperatures. SAE 10W is for colder climates or lighter viscosity needs. SAE 50 is for very high temperatures or heavily loaded engines. Always follow your engine manufacturer\'s recommendations.' },
        { q: 'Can Laon Core be used in automatic transmissions?', a: 'Yes. The SAE 10W and SAE 30 grades meet GMC Allison C-3 requirements and can be used in automatic transmissions, torque converters, and hydraulic systems where such specifications apply.' },
        { q: 'Is Laon Core suitable for heavy construction equipment?', a: 'Yes. Laon Core is designed for heavy-duty operation in both on-highway and off-highway vehicles and equipment, including construction machinery.' },
      ]),
    },
  },
]

async function patchProducts() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN. Get a write token from https://sanity.io/manage → project c7mgn6k7 → API → Tokens')
    process.exit(1)
  }

  console.log(`Patching ${patches.length} products in Sanity...\n`)

  for (const patch of patches) {
    try {
      const id = await client.fetch(
        `*[_type == "product" && name == $name && !(_id in path("drafts.**"))][0]._id`,
        { name: patch.name }
      )

      if (!id) {
        console.log(`⚠️  Not found in Sanity: "${patch.name}" — skipping`)
        continue
      }

      await client.patch(id).set(patch.data).commit()
      console.log(`✅ Patched: ${patch.name} (${id})`)
    } catch (err) {
      console.error(`❌ Failed: ${patch.name}:`, err.message)
    }
  }

  console.log('\nDone! All products patched. Changes are live immediately.')
}

patchProducts()
