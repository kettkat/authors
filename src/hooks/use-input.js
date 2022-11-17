import React, { useState } from "react";
//want to manage validity
//the value
//with validation logic passed in through props
//receives a function as a parameter
const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [valueTouched, setValueTouched] = useState(false);
  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && valueTouched;

  const valueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  const blurHandler = () => {
    setValueTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setValueTouched(false);
  };
  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    blurHandler,
    reset,
  };
};

export default useInput;
