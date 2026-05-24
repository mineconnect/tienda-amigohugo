// Polyfills mínimos para Jest + Next 14 en jsdom

const utils = require("util") as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder };

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = utils.TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = utils.TextDecoder;
}

// localStorage en jsdom ya existe, pero limpiamos entre tests
afterEach(() => {
  try {
    window.localStorage.clear();
  } catch {
    /* ignore */
  }
});
