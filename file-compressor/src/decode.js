const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  throw new Error('Missing arguments');
}

const { uncompress } = require('./compressor');

uncompress(inputPath, outputPath);
