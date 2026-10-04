import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

/** Read the immutable original ZIP without a diagram or ZIP dependency. */
export function visioPageXml() {
  const zip = readFileSync('sources/iPPM_Prozess-Projektabwicklung.vsdx');
  let end = zip.length - 22;
  while (end >= 0 && zip.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error('ZIP directory missing');
  let position = zip.readUInt32LE(end + 16);
  const count = zip.readUInt16LE(end + 10);
  for (let i = 0; i < count; i++) {
    const size = zip.readUInt32LE(position + 20);
    const nameLength = zip.readUInt16LE(position + 28);
    const extraLength = zip.readUInt16LE(position + 30);
    const commentLength = zip.readUInt16LE(position + 32);
    const name = zip.subarray(position + 46, position + 46 + nameLength).toString();
    if (name === 'visio/pages/page1.xml') {
      const local = zip.readUInt32LE(position + 42);
      const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
      const compressed = zip.subarray(start, start + size);
      const method = zip.readUInt16LE(position + 10);
      if (method === 0) return compressed.toString();
      if (method === 8) return inflateRawSync(compressed).toString();
      throw new Error('Unsupported ZIP compression');
    }
    position += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error('Visio page missing');
}
