import { wasmMandelbrot } from "../mandelbrot/mandelbrot-asc.js";
import { javascriptMandelbrot } from "./algorithms/mandelbrot.js";

const WIDTH = 1200,
  HEIGHT = 800;

const config = {
  x: -0.743644786,
  y: 0.1318252536,
  d: 0.00029336,
  iterations: 1000,
};

let rNumber = 0;
let rRuntume = "";
let rExecTime = 0;

let button = document.querySelector("#generateMandelbrot");
let selectJs = document.querySelector("#js_radio");
let resultTable = document.querySelector("#resultTableBody");

let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
ctx.scale(2, 2);

button.addEventListener("click", () => {
  clearCanvas();
  let start = new Date();
  rNumber++;
  if (selectJs.checked) {
    rRuntume = "JavaScript";
    javascriptMandelbrot(ctx, config);
  } else {
    rRuntume = "WebAssembly";
    wasmMandelbrot(ctx, config);
  }
  let end = new Date();
  rExecTime = end.getTime() - start.getTime();
  appendResult();
});

const clearCanvas = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
};

const appendResult = () => {
  let current = resultTable.innerHTML;
  current += `<tr>
      <td>${rNumber}</td>
      <td>${rRuntume}</td>
      <td>${rExecTime}ms</td>
    </tr>`;
  resultTable.innerHTML = current;
};

let benchmarkJSLogs = document.querySelector("#benchmarkJSLogs");
var suiteTestWASM = new Benchmark.Suite("WASM Benchmark");

suiteTestWASM
  .add("Render#Mandelbrot#WASM", () => {
    wasmMandelbrot(ctx, config);
  })
  .on("cycle", (event) => {
    const benchmark = event.target;
    benchmarkJSLogs.innerHTML += `<span><b>${benchmark.toString()}</b> <br>Time: ${benchmark.times.cycle
      .toString()
      .replace(
        ".",
        ","
      )} Seconds</span><br><span>Elapsed: ${benchmark.times.elapsed
      .toString()
      .replace(".", ",")} Seconds</span><br><span>Timestamp: ${
      benchmark.times.timeStamp
    }</span><br><hr>`;
  });

document.querySelector("#benchmarkWasm").addEventListener("click", () => {
  suiteTestWASM.run({ async: true });
});

var suiteTestJS = new Benchmark.Suite("JS Benchmark");

suiteTestJS
  .add("Render#Mandelbrot#JS", () => {
    javascriptMandelbrot(ctx, config);
  })
  .on("cycle", (event) => {
    const benchmark = event.target;
    benchmarkJSLogs.innerHTML += `<span><b>${benchmark.toString()}</b> <br>Time: ${benchmark.times.cycle
      .toString()
      .replace(
        ".",
        ","
      )} Seconds</span><br><span>Elapsed: ${benchmark.times.elapsed
      .toString()
      .replace(".", ",")} Seconds</span><br><span>Timestamp: ${
      benchmark.times.timeStamp
    }</span><br><hr>`;
  });

document.querySelector("#benchmarkJs").addEventListener("click", () => {
  suiteTestJS.run({ async: true });
});
