"use client";
import { useState, useEffect, useCallback } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

export default function Sandbox() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [displayDimensions, setDisplayDimensions] = useState(dimensions);
  const [maxDimensions, setMaxDimensions] = useState({ width: 0, height: 0 });
  const [showSection1, setShowSection1] = useState(false);
  const [breakpoints, setBreakpoints] = useState<
    { id: number; type: string; width: number; height: number }[]
  >([]);
  const [count, setCount] = useState<number>(1);
  const [sandboxCode, setSandboxCode] = useState<string>(`<html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-violet-100 flex justify-center items-center h-screen">
      <div class="p-6 max-w-sm bg-white shadow-lg rounded-lg">
        <h1 class="text-2xl font-bold text-violet-500">Paste in your code!</h1>
        <button class="mt-4 px-4 py-2 bg-violet-500 text-white rounded" onClick={alert("made_by_james_li")}>Click Me</button>
      </div>
    </body>
  </html>`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      setMaxDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setDisplayDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleResizeStart = useCallback((e: any, data: any) => {
    // Only update state after resize is complete to avoid performance hits during resizing
    setDimensions({
      width: data.size.width,
      height: data.size.height,
    });
  }, []);

  const handleResize = useCallback((e: any, data: any) => {
    // Only update state after resize is complete to avoid performance hits during resizing
    setDisplayDimensions({
      width: data.size.width,
      height: data.size.height,
    });
  }, []);

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

  return (
    <div className="relative font-open overflow-hidden">
      <div className="w-screen h-screen max-w-screen max-h-screen bg-linear-to-b from-violet-200 via-fuchsia-100 to-white shadow-[10px_0_10px_-5px_rgba(0,0,0,0.5),-10px_0_10px_-5px_rgba(0,0,0,0.5)] backdrop-blur-lg">
        <div className="flex flex-row h-full">
          <button
            onClick={() => setShowSection1(!showSection1)}
            className={`absolute ${
              showSection1 == true ? "left-110" : "left-2"
            } top-100 bg-violet-400/5 p-2 rounded-full shadow-md hover:bg-violet-300/10 transition-all delay-50 duration-200 ease-out z-20`}
          >
            {showSection1 ? "◀" : "▶"}
          </button>

          <div
            className={`fixed top-0 h-screen bg-violet-100/90 ${
              showSection1 ? "left-0 w-1/3" : "-left-full w-0"
            } transition-all delay-50 duration-300 ease-out overflow-hidden z-10`}
          >
            <h1 className="p-5 font-semibold text-2xl text-transparent bg-clip-text bg-linear-to-r from-violet-700/20 via-fuchsia-800/60 to-fuchsia-800/60 animate-gradient-x">
              Querify
            </h1>
            {showSection1 && (
              <div className="flex h-full w-full p-2 sticky z-10">
                <div className="w-full rounded-lg shadow-lg p-3">
                  <h2 className="text-xl font-bold m-1">Code</h2>
                  <textarea
                    className="editor h-[70%] w-full bg-white/30 rounded-lg p-3 text-sm overflow-auto resize-none focus:outline-violet-400/50"
                    value={sandboxCode}
                    onChange={(e) => setSandboxCode(e.target.value)}
                    placeholder="enter code here"
                    spellCheck="false"
                  />

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
            )}
          </div>

          <div className="relative flex flex-col w-full">
            <h2 className="fixed top-3 left-1/2 -translate-x-1/2 text-lg font-bold text-black/60 z-10">
              Live Preview
            </h2>
            <h2 className="fixed top-3 left-1/2 -translate-x-1/2 translate-y-6 text-md font-bold text-black/60 z-10">
              {displayDimensions.width}px x {displayDimensions.height}px
            </h2>

            <div className="w-full">
              <ResizableBox
                width={dimensions.width - 5}
                height={dimensions.height - 5}
                minConstraints={[100, 100]}
                maxConstraints={[maxDimensions.width, maxDimensions.height]}
                axis="both"
                className="rounded-lg overflow-hidden"
                onResizeStart={handleResizeStart}
                onResize={handleResize}
              >
                <iframe
                  title="preview"
                  className="w-full h-full rounded-lg"
                  srcDoc={sandboxCode}
                  loading="lazy"
                />
              </ResizableBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
