"use client";
import { useState } from "react";
// import Draggable from "react-draggable";

export default function Sandbox() {
  const [breakpoints, setBreakpoints] = useState<
    { id: number; type: string; width: number; height: number }[]
  >([]);
  const [count, setCount] = useState<number>(1);
  const [sandboxCode, setSandboxCode] = useState<string>( `
  <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 flex justify-center items-center h-screen">
      <div class="p-6 max-w-sm bg-white shadow-lg rounded-lg">
        <h1 class="text-2xl font-bold text-blue-500">Hello, Tailwind!</h1>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={alert("clicked!")}>Click Me</button>
      </div>
    </body>
  </html>
`);

  function addWidthBreakpoint() {
    setBreakpoints([
      ...breakpoints,
      { id: count, type: "width", width: 0, height: 50 },
    ]);
    setCount(count + 1);
  }

  function addHeightBreakpoint() {
    setBreakpoints([
      ...breakpoints,
      { id: count, type: "height", width: 0, height: 50 },
    ]);
    setCount(count + 1);
  }

  // function updateBreakpoint(id: number, type: string, value: string) {
  //   console.log(id, type, value);
  //   // draggable feature
  // }

  return (
    <div className="relative overflow-hidden">
      <div className="font-open w-screen h-screen max-w-screen max-h-screen bg-linear-to-b from-violet-200 via-fuchsia-100 to-white shadow-[10px_0_10px_-5px_rgba(0,0,0,0.5),-10px_0_10px_-5px_rgba(0,0,0,0.5)] backdrop-blur-lg">
        <div className="flex flex-row">
          <div className="w-1/3 h-screen">
            <h1 className="p-5 font-semibold text-2xl text-transparent bg-clip-text bg-linear-to-r from-violet-700/20 via-fuchsia-800/60 to-fuchsia-800/60 animate-gradient-x">
              Querify
            </h1>

            <div className="flex h-full w-full p-4 gap-4">
              <div className="w-full p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Code</h2>
                {/* {breakpoints.map((bp) => (
                <div key={bp.id} className="mb-2 p-2 border rounded">
                  <label className="block font-semibold">
                    {bp.type == "width" ? "Width:" : "Height:"}
                  </label>
                  <input
                    type="number"
                    value={bp.width}
                    onChange={(e) =>
                      updateBreakpoint(bp.id, "width", e.target.value)
                    }
                  />
                </div>
              ))} */}
                <textarea
                  className="editor h-[70%] w-full bg-white/20 rounded-lg p-3 text-sm overflow-auto resize-none"
                  value={sandboxCode}
                  onChange={(e) => {
                    setSandboxCode(e.target.value);
                  }}
                  placeholder="enter code here"
                ></textarea>

                <div className="flex flex-col">
                  <h4 className="text-lg font-bold mb-4">Breakpoints</h4>
                  <button className="mt-4" onClick={addWidthBreakpoint}>
                    + Width Breakpoint
                  </button>
                  <button className="mt-4" onClick={addHeightBreakpoint}>
                    + Height Breakpoint
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-full mt-5">
            <h2 className="text-xl font-bold mb-4">Live Preview</h2>
            <div className="h-full w-full">
              <iframe title="preview" className="w-full h-full rounded-lg" srcDoc={sandboxCode} ></iframe>
            </div>

            {/* {breakpoints.map((bp) => (
            <Draggable
              key={bp.id}
              axis={bp.type === "height" ? "y" : "x"}
              defaultPosition={{ x: 0, y: 0 }}
            >
              <iframe
                title="preview"
                style={{ width: "100%", height: "100%", border: "none" }}
                srcDoc={`<style>@media (min-width: ${bp.width}px) { body { background: red; } }</style><h1>Preview</h1>`}
              />
            </Draggable>
          ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}
