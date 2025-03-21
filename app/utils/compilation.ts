import { Breakpoint } from "./types";

export function compileCode(
  inputCode: string,
  count: number,
  breakpoints: Breakpoint[]
) {
  const text = inputCode.split(" ");

  const validPatterns = new Set(
    Array.from({ length: count - 1 }, (_, i) => `b${i + 1}`)
  );

  for (let w = 0; w < text.length; w++) {
    if (validPatterns.has(text[w])) {
      console.log(`Found match: ${text[w]} at index ${w}`);

      // retrieves number from breakpoint "b1" = 1
      const breakpointId = parseInt(text[w].substring(1));
    
      // find from breakpoint id (count variable)
      const matchingBreakpoint = breakpoints.find(
        (bp) => bp.id === breakpointId
      );

      if (matchingBreakpoint) {
        if (matchingBreakpoint.height.toString() === "0") {
          text[w] = matchingBreakpoint.width.toString();
        } else {
          text[w] = matchingBreakpoint.height.toString();
        }
      }
    }
  }

  return text.join(" ");
}
