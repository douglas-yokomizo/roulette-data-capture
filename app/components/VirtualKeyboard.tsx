"use client";
import { useState, useEffect } from "react";
import Draggable from "react-draggable";

interface IVirtualKeyboard {
  isVisible: boolean;
  onChange: (value: string) => void;
  focusedInput: string;
  inputValue: string;
}

const VirtualKeyboard = ({
  isVisible,
  onChange,
  inputValue,
  focusedInput,
}: IVirtualKeyboard) => {
  const [lastAccentKey, setLastAccentKey] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      setLastAccentKey("");
    }
  }, [isVisible, focusedInput]);

  const combineAccentWithChar = (accent: string, char: string): string => {
    const accentsMap: Record<string, Record<string, string>> = {
      "´": { a: "á", e: "é", i: "í", o: "ó", u: "ú" },
      "~": { a: "ã", o: "õ", n: "ñ" },
    };
    return accentsMap[accent]?.[char] || char;
  };

  const handleKeyPress = (key: string): void => {
    const maxLengths: Record<string, number> = {
      cpf: 14,
      dob: 10,
      phone: 15,
    };

    if (
      ["cpf", "dob", "phone"].includes(focusedInput) &&
      !/^\d$/.test(key) &&
      key !== "backspace" &&
      key !== "space"
    ) {
      return;
    }

    if (
      focusedInput &&
      inputValue.length >= maxLengths[focusedInput] &&
      key !== "backspace"
    ) {
      return;
    }

    if (key === "backspace") {
      onChange(inputValue.slice(0, -1));
      return;
    }

    if (key === "space") {
      onChange(inputValue + " ");
      return;
    }

    if (["´", "~"].includes(key)) {
      if (lastAccentKey) {
        const combinedChar = combineAccentWithChar(lastAccentKey, key);
        onChange(inputValue + combinedChar);
        setLastAccentKey(null);
      } else {
        setLastAccentKey(key);
      }
      return;
    }

    onChange(inputValue + key);
  };

  const keysRow1 = "1234567890-@_";
  const keysRow2 = "qwertyuiop´";
  const keysRow3 = "asdfghjklç~";
  const keysRow4 = "zxcvbnm.,[]";

  if (!isVisible) return null;

  return (
    <Draggable handle=".handle">
      <div className="fixed w-4/5 bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-200 p-6 rounded-t-lg shadow-lg">
        <div className="handle cursor-move bg-gray-300 p-2 rounded-t-lg text-center">
          Drag Me
        </div>
        {[keysRow1, keysRow2, keysRow3, keysRow4].map((row, index) => (
          <div key={index} className="flex justify-center my-1">
            {row.split("").map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="px-4 py-3 w-full bg-white border border-gray-400 rounded shadow mx-1"
              >
                {key}
              </button>
            ))}
            {index === 0 && (
              <button
                onClick={() => handleKeyPress("backspace")}
                className="mx-1 px-2 py-1 bg-white border border-gray-400 rounded shadow"
              >
                Backspace
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-center my-1">
          <button
            onClick={() => handleKeyPress("space")}
            className="w-full px-8 py-4 bg-white border border-gray-400 rounded shadow"
          >
            Espaço
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default VirtualKeyboard;
