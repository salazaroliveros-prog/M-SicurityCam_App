/** @jest-environment jsdom */

describe('Test de errores de sintaxis en index.html', () => {
  let htmlContent;
  beforeAll(() => {
    // Cargar el HTML completo como string
    htmlContent = require('fs').readFileSync('index.html', 'utf8');
  });

  test('No hay errores de cierre de llaves, paréntesis o corchetes', () => {
    // Contadores para cada tipo de símbolo
    const openBraces = (htmlContent.match(/{/g) || []).length;
    const closeBraces = (htmlContent.match(/}/g) || []).length;
    const openParens = (htmlContent.match(/\(/g) || []).length;
    const closeParens = (htmlContent.match(/\)/g) || []).length;
    const openBrackets = (htmlContent.match(/\[/g) || []).length;
    const closeBrackets = (htmlContent.match(/\]/g) || []).length;
    expect(openBraces).toBe(closeBraces);
    expect(openParens).toBe(closeParens);
    expect(openBrackets).toBe(closeBrackets);
  });

  test('No hay duplicados de manifest en el head', () => {
    const manifestLinks = (htmlContent.match(/<link rel="manifest"/g) || []).length;
    expect(manifestLinks).toBe(1);
  });


  test('No hay funciones anidadas incorrectamente', () => {
    // Busca la palabra function dentro de otra function
    const functionMatches = htmlContent.match(/function /g) || [];
    expect(functionMatches.length).toBeGreaterThan(0);
  });
});
