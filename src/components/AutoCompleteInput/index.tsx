import React, { useState, useRef, useEffect } from "react";

import { Container, Input, InputPlaceholder } from "./styles";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  suggestions?: string[];
}

export const AutoCompleteInput: React.FC<Props> = ({
  suggestions = [],
  placeholder = "",
  ...rest
}) => {
  const [text, setText] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [extraSuggestions, setExtraSuggestions] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = String(event.target.value);
    setText(value);
  }

  function tab(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (suggestion.length > 0) {
      setText(suggestion);
      setSuggestion("");
    }
  }

  function enter() {
    setExtraSuggestions((state) => {
      if (
        !state.find((s) => s.trim() === text.trim()) &&
        !suggestions.find((s) => s.trim() === text.trim())
      ) {
        return [...state, text.trim()];
      }
      return state;
    });
    setText("");
    setSuggestion("");
  }

  function suggest(word: string) {
    setSuggestion(word);
  }

  function handleChooseSuggestion() {
    const searchSuggestionList = [...extraSuggestions, ...suggestions];

    function findStarting() {
      const starting: string[] = [];
      for (const suggestion of searchSuggestionList) {
        const suggestionString = suggestion.trim().toLowerCase();
        const searchString = text.trim().toLowerCase();

        if (suggestionString.startsWith(searchString)) {
          starting.push(suggestionString);
        }
      }
      return starting;
    }

    function findMissingLess() {
      type ML = { total: number; word: string };
      const starting = findStarting();

      let missingLess: ML | null = null;

      for (const word of starting) {
        const missing = word.replace(text, "").length;

        if (missingLess === null) {
          missingLess = { word, total: missing };
        } else {
          if (missing < missingLess.total) {
            missingLess.total = missing;
            missingLess.word = word;
          }
        }
      }

      return missingLess?.word;
    }

    const betterWord = findMissingLess();

    if (!betterWord) {
      return suggest("");
    } else {
      if (text.length === 0) {
        return suggest(placeholder);
      }
      return suggest(betterWord);
    }
  }

  function eventHandlerKeyUp(
    event: React.KeyboardEvent<HTMLInputElement>
  ): any {
    const key = String(event.key).toLowerCase();

    switch (key) {
      default:
        return handleChooseSuggestion();
    }
  }

  function eventHandlerKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ): any {
    const key = String(event.key).toLowerCase();

    switch (key) {
      case "tab":
        return tab(event);
      case "enter":
        return enter();
      default:
        return handleChooseSuggestion();
    }
  }

  useEffect(() => {
    if (text.length === 0) {
      setSuggestion(placeholder);
    }
  }, [text, placeholder]);

  return (
    <Container>
      <InputPlaceholder value={suggestion} readOnly />
      <Input
        {...rest}
        ref={input}
        value={text}
        onKeyDown={eventHandlerKeyDown}
        onChange={onChange}
        onKeyUp={eventHandlerKeyUp}
      />
    </Container>
  );
};
