import React, { useState } from "react";

import { AutoCompleteInput } from "../../components/AutoCompleteInput";

import "./styles.css";

export const Ex1: React.FC = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <AutoCompleteInput
        initialValue={value}
        onChangeText={setValue}
        clearOnEnter
        placeholder="search..."
      />
      <p>{value}</p>
    </>
  );
};
