/**
 * Gera versões WebP das fotografias pesadas.
 *
 *   node scripts/optimize-images.mjs
 *
 * As originais em PNG continuam versionadas e servem de fallback para
 * navegadores sem WebP — o <picture> escolhe sozinho.
 */
import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'src/assets/website-images';

/** Cada entrada: origem e as larguras que queremos servir. */
const ALVOS = [
  {
    origem: `${BASE}/images-home/navio-frente-1920x1080.png`,
    saida: `${BASE}/images-home/navio-frente`,
    larguras: [1024, 1440, 1920],
  },
];

const kb = (bytes) => (bytes / 1024).toFixed(0) + ' KB';

for (const alvo of ALVOS) {
  const original = await stat(alvo.origem);
  console.log(`\n${path.basename(alvo.origem)} — ${kb(original.size)}`);

  let total = 0;
  for (const largura of alvo.larguras) {
    const destino = `${alvo.saida}-${largura}.webp`;
    await sharp(alvo.origem)
      .resize({ width: largura, withoutEnlargement: true })
      // effort 6 = compressão mais lenta e mais apertada; roda uma vez só.
      .webp({ quality: 78, effort: 6 })
      .toFile(destino);

    const gerado = await stat(destino);
    total += gerado.size;
    console.log(`  ${largura}w -> ${kb(gerado.size)}  ${path.basename(destino)}`);
  }

  const maior = await stat(`${alvo.saida}-${alvo.larguras.at(-1)}.webp`);
  const reducao = (1 - maior.size / original.size) * 100;
  console.log(`  a maior WebP é ${reducao.toFixed(0)}% menor que o PNG original`);
}
