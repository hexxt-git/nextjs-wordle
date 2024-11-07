"use client";
import { useEffect, useState, useRef } from "react";
import words from "./words.json";

// TODO: implement server side checking through api and less fucked
const secret = words[Math.floor(Math.random() * words.length)];

export default function GameBoard() {
  enum KeyState {
    Green = "green",
    Yellow = "yellow",
    Gray = "gray",
    None = "none",
  }

  const backgroundMap: Map<KeyState, string> = new Map([
    [KeyState.Green, "#538d4e"],
    [KeyState.Yellow, "#b5a62b"],
    [KeyState.Gray, "#303032"],
    [KeyState.None, "transparent"],
  ]);

  interface Key {
    key: string;
    state: KeyState;
  }

  const [grid, setGrid]: [Array<Array<Key | null>>, any] = useState([]);
  const [currentLine, setCurrentLine]: [Array<Key | null>, any] = useState([]);

  const [keyboard, setKeyboard] = useState({
    rows: ["QWERTYUIOP".split(""), "ASDFGHJKL".split(""), "ZXCVBNM".split("")],
  });

  const containerRef = useRef<any>(null);
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  console.log({ grid, currentLine });
  console.log({ secret });
  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center">
      <h1 className="text-3xl uppercase font-semibold mb-6 tracking-widest">
        Next.js Wordle
      </h1>
      <div
        className="grid gap-2 text-xl outline-none"
        onKeyDown={({ key }) => {
          if (key === "Enter") {
            if (currentLine.length < 5) return;
            if (
              !words.includes(
                currentLine.map((keyObj) => keyObj?.key ?? "").join("")
              )
            )
              return;
            setGrid((prevGrid: Array<Array<Key | null>>) => [
              ...prevGrid,
              currentLine.map((key, index) => {
                if (!key) key = { key: "a", state: KeyState.None };

                key.state =
                  secret[index] === key.key
                    ? KeyState.Green
                    : [...secret].some(
                        (character, index) =>
                          character == key.key &&
                          secret[index] !== currentLine[index]?.key
                      )
                    ? KeyState.Yellow
                    : KeyState.Gray;

                return key;
              }),
            ]);
            setCurrentLine(() => []);
          } else if (key === "Backspace") {
            setCurrentLine((prev: Array<Key | null>) => prev.slice(0, -1));
          } else if (
            key.trim().length == 1 &&
            currentLine.length < 5 &&
            grid.length < 6
          ) {
            setCurrentLine((prev: Array<Key | null>) => [
              ...prev,
              { key, state: KeyState.None },
            ]);
          }
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
        {keyboard.rows.map((row) => (
          <div className="flex gap-2 justify-center mt-2" key={row.join("")}>
            {row.map((key, index) => (
              <button
                key={index}
                className="border-2 border-gray-200/20 rounded-lg min-w-12 h-12 flex items-center justify-center"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
