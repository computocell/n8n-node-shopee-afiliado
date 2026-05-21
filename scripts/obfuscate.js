// scripts/obfuscate.js
const fs = require('fs');
const path = require('path');
const { obfuscate } = require('javascript-obfuscator');

// Configurações de ofuscação – ajuste conforme necessidade
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
  debugProtection: false,
  debugProtectionInterval: false,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false,
};

/**
 * Recursively walks through a directory and returns an array with absolute file paths.
 * @param {string} dir
 * @returns {string[]}
 */
function walkSync(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkSync(fullPath));
    } else if (fullPath.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

// Diretório onde o TypeScript já gerou os arquivos JavaScript
const distDir = path.resolve(__dirname, '..', 'dist');

// Busca todos os .js dentro de dist/
const jsFiles = walkSync(distDir);

// Ofusca cada arquivo *in‑place*
jsFiles.forEach((filePath) => {
  const code = fs.readFileSync(filePath, 'utf8');
  const obfuscatedCode = obfuscate(code, obfuscationOptions).getObfuscatedCode();
  fs.writeFileSync(filePath, obfuscatedCode, 'utf8');
  console.log(`🔒  Ofuscado: ${path.relative(process.cwd(), filePath)}`);
});
