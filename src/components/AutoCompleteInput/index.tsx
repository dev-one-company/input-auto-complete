import React, { useRef, useState } from "react";

interface Props {
  placeholder?: string;
  initialValue?: string;
  style?: React.CSSProperties;
  initialSuggestions?: string[];
  onEnterPressed?: (event: React.KeyboardEvent<HTMLInputElement>) => any;
  onChangeText?: (text: string) => any;
  clearOnEnter?: boolean;
}

export const AutoCompleteInput: React.FC<Props> = ({
  initialSuggestions = [],
  onEnterPressed,
  onChangeText,
  initialValue,
  clearOnEnter,
  ...rest
}) => {
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [text, setText] = useState<string>(initialValue || "");

  const input = useRef<HTMLInputElement>(null);

  function isLetterOrNumber(letter: string) {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const all = [...letters.split(""), ...numbers.split("")];

    if (all.includes(letter.toLowerCase())) {
      return true;
    }

    return false;
  }

  function getWordBasedOnSideSpaces(string: string, currentPos: number) {
    let right = "";
    let left = "";
    let i = currentPos;

    while (true) {
      if (string[i] && string[i] !== " " && isLetterOrNumber(string[i])) {
        right += string[i];
      } else {
        break;
      }
      i++;
    }
    i = currentPos - 1;
    while (true) {
      if (
        i >= 0 &&
        string[i] &&
        string[i] !== " " &&
        isLetterOrNumber(string[i])
      ) {
        left = string[i] + left;
      } else {
        break;
      }
      i--;
    }
    return left + right;
  }

  function findWordMatch(string: string) {
    for (const suggestion of suggestions) {
      if (
        suggestion
          .trimStart()
          .toLocaleLowerCase()
          .startsWith(string.trimStart().toLowerCase()) &&
        string.trimStart().toLowerCase().length > 0
      ) {
        return suggestion;
      }
    }

    return null;
  }

  function eventHandler(event: React.KeyboardEvent<HTMLInputElement>) {
    const { key } = event;
    if (key.toLowerCase() === "tab") {
      event.stopPropagation();
      event.preventDefault();
      if (input.current) {
        if (input.current.selectionStart !== input.current.selectionEnd) {
          input.current.setSelectionRange(
            input.current.value.length,
            input.current.value.length
          );
          if (onChangeText) {
            onChangeText(event.currentTarget.value);
          }
        }
      }
    } else if (key.toLowerCase() === "enter") {
      const words = text.split(/\W/g);
      const wordsToInsert: string[] = [];
      for (const word of words) {
        if (
          !suggestions.find((w) => w === word.toLowerCase().trim()) &&
          word.length > 0
        ) {
          wordsToInsert.push(word.toLowerCase().trim());
        }
      }

      setSuggestions((state) => [...state, ...wordsToInsert]);

      if (onEnterPressed) {
        onEnterPressed(event);
      }
      if (clearOnEnter) {
        setText("");
      }
    }
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    const carretPosition = event.currentTarget.selectionStart || 0;

    const wordTyping = getWordBasedOnSideSpaces(value, carretPosition);
    const wordMatch = findWordMatch(wordTyping);

    const inputType = (event.nativeEvent as any).inputType as string | null;

    if (onChangeText) {
      onChangeText(value);
    }

    if (wordMatch && inputType !== "deleteContentBackward") {
      const wordToInsert = wordMatch.replace(wordTyping, "");
      const textToInsert = value + wordToInsert;
      setText(textToInsert);
      setTimeout(() => {
        if (input.current) {
          input.current.setSelectionRange(value.length, textToInsert.length);
        }
      }, 10);
    } else {
      setText(value);
    }
  }

  return (
    <input
      {...rest}
      ref={input}
      type="text"
      value={text}
      onChange={onChange}
      onKeyDown={eventHandler}
    />
  );
};
