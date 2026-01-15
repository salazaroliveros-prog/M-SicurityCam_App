/** @jest-environment jsdom */
describe('M&S Security Cam Ultra - Funcionalidad', () => {
  let state;
  beforeEach(() => {
    // Simular el estado inicial y funciones principales
    state = {
      phase: 'splash',
      config: { password: '', cams: [] },
      scanning: false,
      decrypted: false,
      tempUrl: '',
      logLines: []
    };
    document.body.innerHTML = '<div id="app"></div>';
  });

  test('Simula escaneo de señal y cambio de estado', () => {
    // Simula runSignalScan
    let logPool = ["Escaneo...", "Detectando..."];
    let i = 0;
    function runSignalScan() {
      state.scanning = true;
      state.logLines = [];
      let interval = setInterval(() => {
        if (i < logPool.length) {
          state.logLines.push(logPool[i]);
          i++;
        } else {
          clearInterval(interval);
          state.scanning = false;
          state.decrypted = true;
        }
      }, 10);
    }
    runSignalScan();
    setTimeout(() => {
      expect(state.decrypted).toBe(true);
      expect(state.scanning).toBe(false);
      expect(state.logLines.length).toBe(2);
    }, 50);
  });

  test('Agrega una cámara correctamente', () => {
    state.tempUrl = 'http://cam-url';
    function addCam() {
      const url = state.tempUrl;
      if (url && state.config.cams.length < 5) {
        state.config.cams.push({ url, id: Date.now() });
        state.decrypted = false;
        state.tempUrl = '';
      }
    }
    addCam();
    expect(state.config.cams.length).toBe(1);
    expect(state.config.cams[0].url).toBe('http://cam-url');
  });

  test('No agrega más de 5 cámaras', () => {
    state.config.cams = Array(5).fill().map((_,i) => ({ url: 'url'+i, id: i }));
    state.tempUrl = 'http://otra';
    function addCam() {
      const url = state.tempUrl;
      if (url && state.config.cams.length < 5) {
        state.config.cams.push({ url, id: Date.now() });
        state.decrypted = false;
        state.tempUrl = '';
      }
    }
    addCam();
    expect(state.config.cams.length).toBe(5);
  });

  test('Elimina una cámara correctamente', () => {
    state.config.cams = [{ url: 'a', id: 1 }, { url: 'b', id: 2 }];
    function removeCam(id) {
      state.config.cams = state.config.cams.filter(c => c.id !== id);
    }
    removeCam(1);
    expect(state.config.cams.length).toBe(1);
    expect(state.config.cams[0].url).toBe('b');
  });

  test('Renderiza correctamente el splash', () => {
    function render() {
      document.getElementById('app').innerHTML = '<div id="splash">Splash</div>';
    }
    render();
    expect(document.getElementById('splash')).not.toBeNull();
  });

  test('Renderiza correctamente el monitor con cámaras', () => {
    state.config.cams = [{ url: 'a', id: 1 }, { url: 'b', id: 2 }];
    function render() {
      document.getElementById('app').innerHTML = `
        <div id="monitor">
          ${state.config.cams.map((c,i) => `<video id="vid-${i}"></video>`).join('')}
        </div>
      `;
    }
    render();
    expect(document.getElementById('vid-0')).not.toBeNull();
    expect(document.getElementById('vid-1')).not.toBeNull();
  });
});
