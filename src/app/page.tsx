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
    keys: "qwertyuiopasdfghjklzxcvbnm"
      .split("")
      .map((key) => ({ key, state: KeyState.None })),
  });

  const containerRef = useRef<any>(null);
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  function press(key: string) {
    if (key === "Enter") {
      if (currentLine.length < 5) return;
      if (
        !words.includes(currentLine.map((keyObj) => keyObj?.key ?? "").join(""))
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

          const keyboardKey = keyboard.keys.find((x) => x.key == key.key);
          if (keyboardKey) {
            if (key.state === KeyState.Green)
              keyboardKey.state = KeyState.Green;
            else if (
              key.state === KeyState.Yellow &&
              keyboardKey.state !== KeyState.Green
            )
              keyboardKey.state = KeyState.Yellow;
            else keyboardKey.state = KeyState.Gray;
          } else {
            console.error("used illegal key");
          }

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
      key = key.toLowerCase();
      setCurrentLine((prev: Array<Key | null>) => [
        ...prev,
        { key, state: KeyState.None },
      ]);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center">
      <h1 className="text-3xl uppercase font-semibold mb-6 tracking-widest">
        Next.js Wordle
      </h1>
      <div
        className="grid gap-2 text-xl outline-none"
        onKeyDown={({ key }) => press(key)}
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
        {[
          keyboard.keys.slice(0, 10),
          keyboard.keys.slice(10, 19),
          keyboard.keys.slice(19, 26),
        ].map((row) => (
          <div className="flex gap-2 justify-center mt-2" key={row.join("")}>
            {row.map((key, index) => (
              <button
                key={index}
                className="border-2 border-gray-200/20 rounded-lg min-w-12 h-12 flex items-center justify-center uppercase"
                style={{
                  background: backgroundMap.get(
                    key?.state ?? ("none" as KeyState.None)
                  ),
                }}
                onClick={() => press(key.key)}
              >
                {key.key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
