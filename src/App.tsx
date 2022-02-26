import React from "react";

import { AutoCompleteInput } from "./components/AutoCompleteInput";

export const App: React.FC = () => {
  return (
    <AutoCompleteInput
      placeholder="search..."
      clearOnEnter
      initialSuggestions={["autocomplete", "words", "test", "with space"]}
    />
  );
};
