"use client";
import { useState, useEffect } from "react";

interface IVirtualKeyboard {
  isVisible: boolean;
  onChange: (value: string) => void;
  focusedInput: string;
}

const VirtualKeyboard = ({
  isVisible,
  onChange,
  focusedInput,
}: IVirtualKeyboard) => {
  const [inputValue, setInputValue] = useState("");
  const [lastAccentKey, setLastAccentKey] = useState("");

  useEffect(() => {
    if (isVisible) {
      setInputValue("");
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
      cpf: 11,
      dob: 8,
      phone: 11,
    };

    if (
      focusedInput &&
      inputValue.length >= maxLengths[focusedInput] &&
      key !== "backspace"
    ) {
      return;
    }

    if (["´", "~"].includes(key)) {
      if (lastAccentKey) {
        setInputValue(inputValue + lastAccentKey);
        onChange(inputValue + lastAccentKey);
      }
      setLastAccentKey(key);
      return;
    }

    let newValue = inputValue;
    if (lastAccentKey) {
      const combinedChar = combineAccentWithChar(lastAccentKey, key);
      if (combinedChar !== key) {
        newValue = newValue + combinedChar;
      } else {
        newValue = newValue + lastAccentKey + key;
      }
      setLastAccentKey("");
    } else {
      switch (key) {
        case "backspace":
          newValue = inputValue.slice(0, -1);
          break;
        case "space":
          newValue += " ";
          break;
        default:
          newValue += key;
      }
    }

    const isValid = onChange(newValue);
    //@ts-ignore
    if (!isValid) {
      setInputValue("");
    } else {
      setInputValue(newValue);
    }
  };

  const keysRow1 = "1234567890-@";
  const keysRow2 = "qwertyuiop´";
  const keysRow3 = "asdfghjklç~";
  const keysRow4 = "zxcvbnm.,[]";

  if (!isVisible) return null;

  return (
    <div className=" fixed w-4/5 bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-200 p-6 rounded-t-lg shadow-lg">
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
              className=" mx-1 px-2 py-1 bg-white border border-gray-400 rounded shadow"
            >
              Backspace
            </button>
          )}
        </div>
      ))}
      <div className="flex justify-center my-1">
        <button
          onClick={() => handleKeyPress("space")}
          className=" w-full px-8 py-4 bg-white border border-gray-400 rounded shadow"
        >
          Espaço
        </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;