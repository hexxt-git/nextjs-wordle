"use client";
import { useEffect, useState, useRef } from "react";

export default function GameBoard() {
  const secret = 'svelte'
  
  enum KeyState {
    Green = "green",
    Yellow = "yellow",
    Gray = "gray",
    None = "none",
  }

  const backgroundMap: Map<KeyState, string> = new Map([
    [KeyState.Green, "#538d4e"],
    [KeyState.Yellow, "#b59f3b"],
    [KeyState.Gray, "#3a3a3c"],
    [KeyState.None, "transparent"],
  ]);

  interface Key {
    key: string;
    state: KeyState;
  }

  const [grid, setGrid]: [Array<Array<Key | null>>, any] = useState([]);
  const [currentLine, setCurrentLine]: [Array<Key | null>, any] = useState([]);

  const [keyboard, setKeyboard] = useState({
    row1: "QWERTYUIOP".split(""),
    row2: "ASDFGHJKL".split(""),
    row3: "ZXCVBNM".split(""),
  });

  const containerRef = useRef<any>(null);
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center">
      <h1 className="text-3xl uppercase font-semibold mb-6 tracking-widest">
        Wordle
      </h1>
      <div
        className="grid gap-2 text-xl outline-none"
        onKeyDown={({ key }) => {
          if (key === "Enter") {
            if (currentLine.length < 5) return;
            setGrid((prevGrid) => [
              ...prevGrid,
              currentLine.map((key, index) => {
                if(!key) key = {key: 'a', state: KeyState.None}
                
                key.state = secret[index] === key.key ? KeyState.Green : secret.includes(key.key) ? KeyState.Yellow : KeyState.Gray;

                return key;
              }),
            ]);
            setCurrentLine(() => []);
          } else if (key === "Backspace") {
            setCurrentLine((prev) => prev.slice(0, -1));
          } else if (
            key.trim().length == 1 &&
            currentLine.length < 5 &&
            grid.length < 6
          ) {
            setCurrentLine((prev) => [...prev, { key, state: KeyState.None }]);
          }
          console.log({ grid, currentLine });
        }}
        tabIndex={0}
        ref={containerRef}
      >
        {[
          ...grid,
          grid.length <= 5 && [
            ...currentLine,
            ...Array(5 - currentLine.length).fill(null),
          ],
          grid.length < 5 && Array((5 - grid.length) * 5).fill(null),
        ].map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {row &&
              row.map((cell: Key | null, index: number) => (
                <div
                  key={index}
                  className="border-2 border-gray-200/20 rounded-lg w-16 h-16 flex items-center justify-center text-center"
                  style={{
                    background: backgroundMap.get(
                      cell?.state ?? ("none" as KeyState.None)
                    ),
                  }}
                >
                  {cell?.key}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="grid grid-rows-3 mt-8">
        <div className="flex gap-2 justify-center mt-2">
          {keyboard.row1.map((key, index) => (
            <button
              key={index}
              className="border-2 border-gray-200/20 rounded-lg min-w-12 h-12 flex items-center justify-center"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-center mt-2">
          {keyboard.row2.map((key, index) => (
            <button
              key={index}
              className="border-2 border-gray-200/20 rounded-lg min-w-12 h-12 flex items-center justify-center"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-center mt-2">
          {keyboard.row3.map((key, index) => (
            <button
              key={index}
              className="border-2 border-gray-200/20 rounded-lg min-w-12 h-12 flex items-center justify-center"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
