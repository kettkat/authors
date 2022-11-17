import React, { useState, useEffect } from "react";
import useInput from "../hooks/use-input";
import "../styles/form.css";

function AddAuthor() {
  const [authorList, setAuthorList] = useState([]);
  const [emailValid, setEmailValid] = useState(true)

  const {
    value: firstName,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    blurHandler: firstNameBlurHandler,
    reset: firstNameResetInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: lastName,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    blurHandler: lastNameBlurHandler,
    reset: lastNameResetInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
    reset: emailResetInput,
  } = useInput((value) => value.trim() !== "" && value.length < 25);

  let formIsValid = false;
  if (firstNameIsValid && emailIsValid && lastNameIsValid) {
    formIsValid = true;
  }

  let found = false;
  function checkEmailExists() {
    fetchAuthorsHandler()
    for (let i = 0; i < authorList.length; i++) {
        if (authorList[i].email === email) {
            found = true;
            setEmailValid(false)
            break;
        }
        setEmailValid(true)
    }
    console.log(found); // output: true or false  
  }

  async function addAuthorHandler(event) {
    event.preventDefault();
    checkEmailExists()

    if (!formIsValid || found === true) {
      return;
    }
        const author = {
            key: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
          };
          const response = await fetch(
            "https://react-bug-tracker-b64dd-default-rtdb.firebaseio.com/.json",
            {
              method: "POST",
              body: JSON.stringify(author),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          console.log(data);
    
          firstNameResetInput();
          lastNameResetInput();
          emailResetInput();
          fetchAuthorsHandler()
    
  }

  async function fetchAuthorsHandler() {
    const response = await fetch(
      "https://react-bug-tracker-b64dd-default-rtdb.firebaseio.com/.json"
    );
    const data = await response.json();
    const loadedAuthors = [];
    for (const key in data) {
      loadedAuthors.push({
        id: email,
        firstName: data[key].firstName,
        lastName: data[key].lastName,
        email: data[key].email,
      });
    }
    setAuthorList(loadedAuthors);
  }

  //output list of authors when page loads
  useEffect(() => {
    fetchAuthorsHandler();
  }, []);

  return (
    <div className="center">
      <h1>Post An Author Web App</h1>
      <form className="center">
        <div>
          <h2>Author Form</h2>
          <label>First Name</label>
          <br />
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={firstName}
            onBlur={firstNameBlurHandler}
            onChange={firstNameChangeHandler}
          ></input>
          {firstNameHasError && (
            <label className="error">Submission must have a first name</label>
          )}
          <br />
          <label>Last Name</label>
          <br />

          <input
            type="email"
            name="lastName"
            id="lastName"
            value={lastName}
            onBlur={lastNameBlurHandler}
            onChange={lastNameChangeHandler}
          ></input>
          {lastNameHasError && (
            <label className="error">Submission must have last name</label>
          )}
          <br />
          <label>Email</label>
          <br />
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onBlur={emailBlurHandler}
            onChange={emailChangeHandler}
          ></input>
          <br />
          {(emailHasError)&& (
            <label className="error">Email invalid</label>
          )}
          <button
            type="submit"
            onClick={addAuthorHandler}
            id="submit"
            disabled={!formIsValid}
          >
            Submit
          </button>
          {!emailValid && (
            <label className="error">Email Exists</label>
          )}
        </div>
      </form>
      <div className="center">
        <h3>First Name &nbsp;&nbsp;Last Name&nbsp;&nbsp;&nbsp; Email</h3>
        {authorList.map((authors) => (
          <>
            <p>
              {authors.firstName}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {authors.lastName}&nbsp;&nbsp;
              {authors.email}
            </p>
          </>
        ))}
      </div>
    </div>
  );
}

export default AddAuthor;
