const WIDTH = 1200;
const HEIGHT = 800;
const PAGE_SIZE = 65536;

function allocateMemory() {
  const initial = Math.floor((WIDTH * HEIGHT * 4) / PAGE_SIZE) + 1;
  return new WebAssembly.Memory({ initial });
}

const imports = {
  env: {
    memoryBase: 0,
    memory: allocateMemory(),
    abort: () => {},
  },
};

const res = await fetch("./src/mandelbrot/mandelbrot.wasm");
const buffer = await res.arrayBuffer();
const module = await WebAssembly.instantiate(buffer, imports);
const { mandelbrot, getDataBuffer, memory } = module.instance.exports;
let imgData = null;

// Adapted from Colin Eberhardt
export const wasmMandelbrot = (ctx, { iterations, x, y, d }) => {
  mandelbrot(iterations, x, y, d);

  if (!imgData) imgData = ctx.createImageData(WIDTH, HEIGHT);
  const offset = getDataBuffer();
  const linearMemory = new Uint8Array(
    memory.buffer,
    offset,
    WIDTH * HEIGHT * 4
  );
  imgData.data.set(linearMemory);
  ctx.putImageData(imgData, 0, 0);
};
