// Função para capturar os parametros digitados no terminal
const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  throw new Error('Missing arguments');
}

const { compress } = require('./compressor');

compress(inputPath, outputPath);
