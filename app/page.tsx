"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Prism from "prismjs";
import { v4 as uuidv4 } from "uuid";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import { ResizableBox } from "react-resizable";
import { Rnd } from "react-rnd";
import { compileCode } from "./utils/compilation";
import { Breakpoint } from "./utils/types";
import "react-resizable/css/styles.css";

export default function Sandbox() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [displayDimensions, setDisplayDimensions] = useState(dimensions);
  const [maxDimensions, setMaxDimensions] = useState({ width: 0, height: 0 });
  const [showSection, setShowSection] = useState(false);
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [count, setCount] = useState<number>(1);
  const [sandboxCode, setSandboxCode] = useState<string>(`<head>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');
  
      // @media queries go here
  
      </style>
      <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-violet-100 flex justify-center items-center h-screen">
        <div class="p-6 max-w-sm bg-white/20 shadow-lg rounded-lg flex items-center flex-col justify-center text-center">
          <h1 class="text-2xl font-bold text-violet-500">Welcome to Querify</h1>
          <h1 class="text-xl font-bold text-violet-500 pt-3">NOT OPTIMIZED FOR NON PC SCREENS YET!</h1>
          <button class="mt-4 px-4 py-2 bg-violet-500 text-white rounded" onClick={alert("made_by_james_(&gpt):https://jame.li/")}>Credits</button>
          <h1 class="text-lg font-bold pt-5 text-violet-500">How to use:</h1>
          <br/>
          <h4 class="text-sm text-violet-500">paste in your react code (if you use tailwind you <span class="font-bold">must</span> have a script tag)</h4>
          <br/>
          <h4 class="text-sm text-violet-500">resize your project and add breakpoints, which are draggable along the axis</h4>
          <br/>
          <h4 class="text-sm text-violet-500">write your css media queries in the 'query code' section by refering to your custom breakpoints as 'b1', 'b2', etc </h4>
          <br/>
          <h4 class="text-sm text-violet-500">hit compile and it will update the <span class="font-bold">sandbox automatically</span> with your defined breakpoints</h4>
        </div> 
      </body>`);
  const [userCode, setUserCode] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [userId, setUserId] = useState("");

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

  useEffect(() => {
    // Check if userId exists in localStorage, else create one
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);

    // Fetch user's breakpoints from DB
    fetch(`/api/breakpoints?userId=${storedUserId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data) {
          setBreakpoints(data.breakpoints);
          setCount(data.count);
        }
      });
  }, []);

  // SYNTAX HIGHLIGHTING PRISMJS

  useEffect(() => {
    if (typeof window !== "undefined" && sandboxCode) {
      Prism.highlightAll();
    }
  }, [sandboxCode]);

  const updateText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSandboxCode(event.target.value);
  };

  // RESIZE
  const handleResizeStart = useCallback((e: any, data: any) => {
    // Only update state after resize is complete to avoid performance hits during resizing
    setDimensions({
      width: Math.round(data.size.width),
      height: Math.round(data.size.height),
    });
  }, []);

  const handleResize = useCallback((e: any, data: any) => {
    // Only update state after resize is complete to avoid performance hits during resizing
    setDisplayDimensions({
      width: Math.round(data.size.width),
      height: Math.round(data.size.height),
    });
  }, []);

  // BREAKPOINTS
  function addWidthBreakpoint() {
    setBreakpoints([
      ...breakpoints,
      {
        id: count,
        type: "width",
        width: 10,
        height: 0,
        displayWidth: 10,
        displayHeight: 0,
      },
    ]);
    setCount(count + 1);
  }

  function addHeightBreakpoint() {
    setBreakpoints([
      ...breakpoints,
      {
        id: count,
        type: "height",
        width: 0,
        height: 10,
        displayWidth: 0,
        displayHeight: 10,
      },
    ]);
    setCount(count + 1);
  }

  function insertIntoSandbox(inputCode: string) {
    console.log(inputCode);
    setSandboxCode(
      sandboxCode +
        `\n<style>
    ${inputCode}
    </style>`
    );
  }

  const saveBreakpoints = async () => {
    await fetch("api/breakpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, breakpoints, count }),
    });
  };

  return (
    <div className="relative font-open overflow-hidden">
      <div className="w-screen h-screen max-w-screen max-h-screen bg-linear-to-b from-violet-200 via-fuchsia-100 to-white shadow-[10px_0_10px_-5px_rgba(0,0,0,0.5),-10px_0_10px_-5px_rgba(0,0,0,0.5)] backdrop-blur-lg">
        {/* sidebar section */}
        <div className="flex flex-row overflow-auto">
          <button
            onClick={() => setShowSection(!showSection)}
            className={`absolute ${
              // need to align this right
              showSection ? "right-[calc(33%-2rem)]" : "right-2"
            } top-100 bg-violet-400/10 p-2 rounded-md shadow-md hover:bg-violet-300/30 transition-all delay-50 duration-200 ease-out z-40 cursor-pointer`}
          >
            {showSection ? "▶" : "◀"}
          </button>

          <div
            className={`fixed top-0 h-full bg-violet-100/90 ${
              showSection ? "right-0 w-1/3" : "-right-full w-0"
            } transition-all delay-50 duration-300 ease-out overflow-auto z-30`}
          >
            <div className="w-full flex justify-start items-center my-1">
              <Image
                src="/querify1.png"
                alt="Querify  "
                width={40}
                height={40}
                className="ml-3 mr-1"
              />
              <h1 className="flex items-center justify-start font-semibold text-2xl text-transparent bg-clip-text bg-linear-to-r from-violet-300/20 via-violet-300/80 to-violet-800/50 animate-gradient-x">
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
              <div className="flex h-[150vh] w-full px-2 pt-2 sticky z-1">
                <div className="w-full h-full rounded-lg shadow-lg px-3 py-1">
                  <div className="h-[20%] pb-5">
                    <div className="w-full flex items-center justify-center">
                      <h2 className="text-lg font-bold mx-1 mb-1">Sandbox</h2>
                    </div>
                    <textarea
                      className="h-full w-full bg-white/30 rounded-lg p-3 text-sm overflow-auto resize-none whitespace-nowrap cursor-text focus:outline-violet-400/50 placeholder:text-black/30"
                      value={sandboxCode}
                      onChange={updateText}
                      placeholder="enter code here"
                      spellCheck="false"
                    />
                  </div>

                  <div className="h-[20%] py-5">
                    <h1 className="flex w-full justify-center text-sm font-bold mx-1 mb-1">
                      [Syntax Highlighting]
                    </h1>
                    <div className="overflow-auto h-full w-full bg-white/30">
                      <pre
                        id="highlighting"
                        aria-hidden="true"
                        className="!text-xs !bg-white/30 p-3"
                      >
                        <code
                          className="language-html !text-xs !bg-white/30 p-3"
                          id="highlighting-content"
                        >
                          {sandboxCode}
                        </code>
                      </pre>
                    </div>
                  </div>

                  <div className="flex flex-row w-full mt-5 h-auto">
                    <div className="flex flex-col w-1/2">
                      <div className="w-full flex items-center justify-center">
                        <h2 className="text-lg font-bold mx-1 mb-2">
                          Breakpoints
                        </h2>
                      </div>
                      <button
                        className="toolBtns w-7/8 my-1 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-2 transition ease-in delay-100 text-xs md:text-sm"
                        onClick={addWidthBreakpoint}
                      >
                        + Width Breakpoint
                      </button>
                      <button
                        className="toolBtns w-7/8 my-1 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-2 transition ease-in delay-100 text-xs md:text-sm"
                        onClick={addHeightBreakpoint}
                      >
                        + Height Breakpoint
                      </button>
                      <button
                        className="toolBtns w-7/8 my-1 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-2 transition ease-in delay-100 text-xs md:text-sm"
                        onClick={saveBreakpoints}
                      >
                        Save Breakpoints to DB
                      </button>
                    </div>

                    <div className="flex flex-col w-1/2">
                      <div className="w-full flex items-center justify-center">
                        <h2 className="text-lg font-bold mx-1 mb-2">Toolkit</h2>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `<script src="https://cdn.tailwindcss.com"></script>`
                            );
                            setAlertVisible(true);
                            setTimeout(() => setAlertVisible(false), 2000);
                          }}
                          className="toolBtns w-7/8 my-1 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-2 transition ease-in delay-100 text-xs md:text-sm"
                        >
                          Copy Tailwind Script
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `@media (min-width: b1 px) and (max-height: b2 px) {}`
                            );
                            setAlertVisible(true);
                            setTimeout(() => setAlertVisible(false), 2500);
                          }}
                          className="toolBtns w-7/8 my-1 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-2 transition ease-in delay-100 text-xs md:text-sm"
                        >
                          Copy Boiler Query
                        </button>
                        <button
                          onClick={() => {
                            const newCode = compileCode(
                              userCode,
                              count,
                              breakpoints
                            );
                            console.log("after compilation", newCode);
                            insertIntoSandbox(newCode);
                          }}
                          className="toolBtns w-7/8 my-1 cursor-pointer bg-violet-300/20 rounded-md hover:bg-violet-300/10 p-2 transition ease-in delay-100 text-xs md:text-sm"
                        >
                          Compile Query Code
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row w-full h-[30%] mt-5">
                    <div className="w-full h-full rounded-lg">
                      <div className="w-full flex items-center justify-center">
                        <h2 className="text-lg font-bold m-1">Query Code</h2>
                      </div>
                      <textarea
                        className="h-full w-full bg-white/30 rounded-lg p-3 placeholder:text-black/30 text-sm overflow-auto resize-none whitespace-nowrap focus:outline-violet-400/50"
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="@media (min-width: b1px) {  body {    font-size: 1rem;  }}"
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
                  x: breakpoint.type === "width" ? breakpoint.width : 0,
                  y: breakpoint.type === "height" ? breakpoint.height : 0,
                  width: breakpoint.type === "width" ? 1 : "100vw",
                  height: breakpoint.type === "height" ? 1 : "100vh",
                }}
                enableResizing={false}
                bounds="parent"
                className="bg-purple-300/75 z-20 fixed pointer-events-auto"
                onDragStop={(e, d) => {
                  setBreakpoints((prev) =>
                    prev.map((bp) =>
                      bp.id === breakpoint.id
                        ? {
                            ...bp,
                            width:
                              breakpoint.type === "width"
                                ? Math.round(d.x)
                                : Math.round(bp.width),
                            height:
                              breakpoint.type === "height"
                                ? Math.round(d.y)
                                : Math.round(bp.height),
                          }
                        : bp
                    )
                  );
                }}
                onDrag={(e, d) => {
                  setBreakpoints((prev) =>
                    prev.map((bp) =>
                      bp.id === breakpoint.id
                        ? {
                            ...bp,
                            displayWidth:
                              breakpoint.type === "width"
                                ? Math.round(d.x)
                                : Math.round(bp.width),
                            displayHeight:
                              breakpoint.type === "height"
                                ? Math.round(d.y)
                                : Math.round(bp.height),
                          }
                        : bp
                    )
                  );
                }}
              >
                <h1 className="p-1 text-sm absolute text-white bg-black/50">
                  b{breakpoint.id}{" "}
                  {breakpoint.type === "height"
                    ? breakpoint.displayHeight
                    : breakpoint.displayWidth}
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

          {alertVisible && (
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 p-5 bg-white/30  text-black rounded-md">
              Text copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
