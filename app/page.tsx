"use client";
import { useState, useEffect, useCallback } from "react";
import { ResizableBox } from "react-resizable";
import { Rnd } from "react-rnd";
import "react-resizable/css/styles.css";
import Image from "next/image";

export default function Sandbox() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [displayDimensions, setDisplayDimensions] = useState(dimensions);
  const [maxDimensions, setMaxDimensions] = useState({ width: 0, height: 0 });
  const [showSection, setShowSection] = useState(false);
  const [breakpoints, setBreakpoints] = useState<
    { id: number; type: string; width: number; height: number }[]
  >([]);
  const [count, setCount] = useState<number>(1);
  const [sandboxCode, setSandboxCode] = useState<string>(`<head>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');
  </style>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-violet-100 flex justify-center items-center h-screen">
      <div class="p-6 max-w-sm bg-white/20 shadow-lg rounded-lg flex items-center flex-col">
        <h1 class="text-2xl font-bold text-violet-500">Paste in your code!</h1>
        <button class="mt-4 px-4 py-2 bg-violet-500 text-white rounded" onClick={alert("made_by_james_li")}>Click Me</button>
      </div> 
    </body>`);
  const [sandboxOutput, setSandboxOutput] = useState<string>(
    `<style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');
  </style>
  <script src="https://cdn.tailwindcss.com"></script> 
  <h4 class="text-sm p-3 text-black/45" style="font-family: 'Open Sans', sans-serif;">
    Output for Code Compilation
  </h4>`
  );
  const [userCode, setUserCode] = useState("");

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

  // RESIZE

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

  function compileSandboxCode() {
    setSandboxOutput("hello");
  }

  // BREAKPOINTS

  function addWidthBreakpoint() {
    setBreakpoints([
      ...breakpoints,
      { id: count, type: "width", width: 25, height: 0 },
    ]);
    setCount(count + 1);
  }

  function addHeightBreakpoint() {
    setBreakpoints([
      ...breakpoints,
      { id: count, type: "height", width: 0, height: 25 },
    ]);
    setCount(count + 1);
  }

  return (
    <div className="relative font-open overflow-hidden">
      <div className="w-screen h-screen max-w-screen max-h-screen bg-linear-to-b from-violet-200 via-fuchsia-100 to-white shadow-[10px_0_10px_-5px_rgba(0,0,0,0.5),-10px_0_10px_-5px_rgba(0,0,0,0.5)] backdrop-blur-lg">
        {/* sidebar section */}
        <div className="flex flex-row h-full">
          <button
            onClick={() => setShowSection(!showSection)}
            className={`absolute ${
              // need to align this right
              showSection ? "right-115" : "right-2"
            } top-100 bg-violet-400/5 p-2 rounded-md shadow-md hover:bg-violet-300/10 transition-all delay-50 duration-200 ease-out z-30 cursor-pointer`}
          >
            {showSection ? "▶" : "◀"}
          </button>

          <div
            className={`fixed top-0 h-screen bg-violet-100/90 ${
              showSection ? "right-0 w-1/3" : "-right-full w-0"
            } transition-all delay-50 duration-300 ease-out overflow-hidden z-30`}
          >
            <div className="w-full flex justify-start items-center my-1">
              <Image
                src="/querify.png"
                alt="Querify  "
                width={50}
                height={50}
                className="mx-3"
              />
              <h1 className="flex items-center justify-start pr-3 font-semibold text-2xl text-transparent bg-clip-text bg-linear-to-r from-violet-300/20 via-violet-300/80 to-violet-800/50 animate-gradient-x">
                Querify
              </h1>
              <div className="w-full flex justify-end">
                <button
                  className="p-2 px-5 mx-2 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-200/20 transition ease-in-out delay-100 duration-300"
                  onClick={() => setShowSection(!showSection)}
                >
                  x
                </button>
              </div>
            </div>
            {showSection && (
              <div className="flex h-full w-full px-2 pt-2 sticky z-1">
                <div className="w-full rounded-lg shadow-lg px-3 py-1">
                  <div className="md:h-[40%] pb-10">
                    <div className="w-full flex items-center justify-center">
                      <h2 className="text-lg font-bold mx-1 mb-1">
                        Tailwind Code
                      </h2>
                    </div>
                    <textarea
                      className="h-full w-full bg-white/30 rounded-lg p-3 text-sm overflow-auto resize-none focus:outline-violet-400/50"
                      value={sandboxCode}
                      onChange={(e) => setSandboxCode(e.target.value)}
                      placeholder="enter code here"
                      spellCheck="false"
                    />
                  </div>

                  <div className="flex flex-row w-full">
                    <div className="flex flex-col md:h-[20%] w-1/2">
                      <div className="w-full flex items-center justify-center">
                        <h2 className="text-lg font-bold m-1 mb-2">
                          Breakpoints
                        </h2>
                      </div>
                      <button
                        className="mt-4 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-3 transition ease-in delay-100"
                        onClick={addWidthBreakpoint}
                      >
                        + Width Breakpoint
                      </button>
                      <button
                        className="mt-4 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-3 transition ease-in delay-100"
                        onClick={addHeightBreakpoint}
                      >
                        + Height Breakpoint
                      </button>
                    </div>

                    <div className="flex flex-col md:h-[20%] w-1/2">
                      <div className="w-full flex items-center justify-center">
                        <h2 className="text-lg font-bold m-1 mb-2">Toolkit</h2>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <button className="w-2/3 my-1 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-2 transition ease-in delay-100 text-sm">
                          Copy Tailwind Script
                        </button>
                        <button className="w-2/3 my-1 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-2 transition ease-in delay-100 text-sm">
                          Copy Boiler Query
                        </button>
                        <button
                          onClick={compileSandboxCode}
                          className="w-2/3 my-1 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-2 transition ease-in delay-100 text-sm"
                        >
                          Compile Query Code
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row w-full md:h-[30%]">
                    <div className="w-1/2 h-full rounded-lg p-3">
                      <div className="w-full flex items-center justify-center">
                        <h2 className="text-lg font-bold m-1">Query Code</h2>
                      </div>
                      <textarea
                        className="h-full w-full bg-white/30 rounded-lg p-3 text-sm overflow-auto resize-none focus:outline-violet-400/50"
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="refer to breakpoints as h#num and then hit compile!"
                      />
                    </div>
                    <div className="w-1/2 h-full rounded-lg p-3">
                      <div className="w-full flex items-center justify-center">
                        <h2 className="text-lg font-bold m-1">Compiled Code</h2>
                      </div>
                      <iframe
                        title="output"
                        className="w-full h-full rounded-lg overflow-auto"
                        srcDoc={sandboxOutput}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* preview section */}
          <div className="flex flex-col w-full">
            <h2 className="fixed top-3 left-1/2 -translate-x-1/2 text-lg font-bold text-black/60 z-10">
              Live Preview
            </h2>
            <h2 className="fixed top-3 left-1/2 -translate-x-1/2 translate-y-6 text-md font-bold text-black/60 z-10">
              {displayDimensions.width}px x {displayDimensions.height}px
            </h2>

            {breakpoints.map((breakpoint) => (
              <Rnd
                key={breakpoint.id}
                default={{
                  x:
                    breakpoint.type === "width"
                      ? breakpoint.width
                      : 0,
                  y:
                    breakpoint.type === "height"
                      ? breakpoint.height
                      : 0,
                  width: breakpoint.type === "width" ? 3 : "100vw",
                  height: breakpoint.type === "height" ? 3 : "100vh",
                }}
                enableResizing={false}
                disableDragging={false} 
                bounds="window"
                className="bg-purple-300/75 z-20 fixed pointer-events-auto"
                onDragStop={(e, d) => {
                  setBreakpoints((prev) =>
                    prev.map((bp) =>
                      bp.id === breakpoint.id
                        ? {
                            ...bp,
                            width: breakpoint.type === "width" ? d.x : bp.width,
                            height:
                              breakpoint.type === "height" ? d.y : bp.height,
                          }
                        : bp
                    )
                  );
                }}
              >
                <h1 className="p-1 text-sm absolute text-white bg-black/50">
                  b{breakpoint.id}{" "}
                  {breakpoint.type === "height"
                    ? breakpoint.height
                    : breakpoint.width}
                  px
                </h1>
              </Rnd>
            ))}

            <div className="w-full h-full flex">
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
