// Upload product TDS PDFs to Sanity and link to the correct products
// Run: SANITY_API_TOKEN=<token> node scripts/upload-pdfs.js

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.SANITY_API_TOKEN;
if (!TOKEN) { console.error('Missing SANITY_API_TOKEN'); process.exit(1); }

const client = createClient({
  projectId: 'c7mgn6k7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
});

const PDF_DIR = 'C:/Users/vince/Downloads/PRODUCTS';

// Map: keyword to match in product name (lowercase) → PDF filename
const PDF_MAP = [
  { match: 'tempest',      file: 'BAGANI 4T TEMPEST TDS.pdf' },
  { match: 'aman deep',    file: 'BAGANI AMAN DEEP TDS.pdf' },
  { match: 'gale',         file: 'BAGANI AMIHAN 4T GALE TDS.pdf' },
  { match: 'gust',         file: 'BAGANI AMIHAN 4T GUST TDS.pdf' },
  { match: 'anitun',       file: 'BAGANI ANITUN DXIII TDS.pdf' },
  { match: 'hanan raze',   file: 'BAGANI HANAN RAZE 20W-50 TDS.pdf' },
  { match: 'laon burst',   file: 'BAGANI LAON BURST 15W-40 TDS.pdf' },
  { match: 'laon core',    file: 'BAGANI LAON CORE TDS.pdf' },
];

async function run() {
  console.log('Fetching products from Sanity...');
  const products = await client.fetch('*[_type == "product"]{ _id, name }');
  console.log(`Found ${products.length} products\n`);

  for (const { match, file } of PDF_MAP) {
    const filePath = path.join(PDF_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`  SKIP — file not found: ${file}`);
      continue;
    }

    const product = products.find(p => p.name.toLowerCase().includes(match));
    if (!product) {
      console.warn(`  SKIP — no product matched "${match}"`);
      continue;
    }

    console.log(`Uploading "${file}" → ${product.name} (${product._id})`);
    try {
      const buffer = fs.readFileSync(filePath);
      const asset = await client.assets.upload('file', buffer, {
        filename: file,
        contentType: 'application/pdf',
      });
      console.log(`  Uploaded asset: ${asset._id}`);

      await client.patch(product._id).set({
        pdfFile: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
      }).commit();
      console.log(`  Linked to product ✓\n`);
    } catch (err) {
      console.error(`  ERROR: ${err.message}\n`);
    }
  }

  console.log('Done.');
}

run();
