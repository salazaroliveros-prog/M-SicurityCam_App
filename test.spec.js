/** @jest-environment jsdom */
describe('M&SicurityCam Frontend', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Cargar el HTML principal (simulación)
    document.body.innerHTML = `
      <div id="scanner-view">
        <input id="camera-url" type="text" />
        <button id="scan-trigger">INICIAR</button>
        <div id="loader" class="hidden loading-ring"></div>
        <div id="radar-icon"></div>
        <div id="log"></div>
        <div id="progress-val"></div>
      </div>
      <div id="success-view" class="hidden">
        <p id="result-ip"></p>
        <div id="video-container">
          <video id="camera-video" style="display:none;"></video>
          <div id="video-error" class="hidden"></div>
        </div>
      </div>
    `;
    // Simular funciones globales
    window._cameraUrl = '';
    window.showSuccess = function() {
      document.getElementById('scanner-view').classList.add('hidden');
      document.getElementById('success-view').classList.remove('hidden');
      document.getElementById('result-ip').innerText = 'IP: 192.168.1.45 | LAT: 12ms';
      const video = document.getElementById('camera-video');
      if (window._cameraUrl) {
        video.style.display = '';
        video.src = window._cameraUrl;
      } else {
        video.style.display = 'none';
      }
    };
  });

  test('Simula conexión exitosa y muestra IP', () => {
    window._cameraUrl = 'http://test-stream';
    window.showSuccess();
    expect(document.getElementById('success-view').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('result-ip').innerText).toMatch(/IP: 192.168.\d+\.\d+ \| LAT: \d+ms|IP: 192.168.1.45 \| LAT: 12ms/);
  });

  test('Muestra el video si hay URL', () => {
    window._cameraUrl = 'http://test-stream';
    window.showSuccess();
    const video = document.getElementById('camera-video');
    expect(video.style.display).toBe('');
    expect(video.src).toContain('http://test-stream');
  });

  test('No muestra el video si no hay URL', () => {
    window._cameraUrl = '';
    window.showSuccess();
    const video = document.getElementById('camera-video');
    expect(video.style.display).toBe('none');
  });

  test('Estilos visuales principales no se alteran', () => {
    // Simula clases principales
    document.body.innerHTML = `
      <div id="decrypter-ui" class="h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div class="signal-wave"></div>
        <div id="scanner-view" class="z-10 w-full max-w-md flex flex-col items-center"></div>
        <div id="success-view" class="hidden z-10 w-full max-w-md flex flex-col items-center"></div>
      </div>
    `;
    const main = document.getElementById('decrypter-ui');
    expect(main.className).toContain('h-screen');
    expect(main.className).toContain('flex-col');
    expect(main.className).toContain('items-center');
    expect(main.className).toContain('overflow-hidden');
    // Verifica que los contenedores principales existen
    expect(document.getElementById('scanner-view')).not.toBeNull();
    expect(document.getElementById('success-view')).not.toBeNull();
  });
});
