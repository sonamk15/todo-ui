import React, { useState, useEffect } from "react";
import TodoList from "./todoList";
import LoginForm from "./loginForm";
import "./App.css";
// const port = 8080

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(undefined);
  const [userName, setUserName] = useState(undefined);

  const getUserName = () => {
    return fetch('http://localhost:9999/userinfo', { credentials: "include"})
    .then(r => {
      if(r.ok) {
        return r.json();
      } else {
        setLoggedIn(false);
        setUserName(undefined);
        return { success: false };
      }
    }).then(r => {
      if(r.success !== false) {
        setLoggedIn(true);
        setUserName(r.userName);
      }
    });
  }

  useEffect(() => {
    getUserName();
  }, []);


  const signupHandler = (username, password) => {
    loginOrSignup('http://localhost:9999/signup', username, password);
  };
  const loginHandler = (username, password) => {
    loginOrSignup('http://localhost:9999/login', username, password);
  };

  const logoutHandler = () => {
    return fetch('http://localhost:9999/logout', { credentials: 'include'})
    .then(r => {
      if(r.ok) {
        setLoggedIn(false);
        setUserName(undefined);
      }
    })
  };


  const loginOrSignup = (url, username, password) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ userName: username, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include"
    })
      .then((r) => {
        if(r.ok) {
          return { success: true };
        } else {
          return r.json()
        }
      })
      .then((r) => {
        if(r.success === true) {
          return getUserName();
        } else {
          setError(r.err);
        }
      });
  }
  return loggedIn ? (
    <TodoList username={userName} logoutHandler={logoutHandler}/>
  ) : (
    <LoginForm
      signupHandler={signupHandler}
      loginHandler={loginHandler}
      error={error}
    />
  );
}
//App.listen(port, () => console.log(`App listening on port ${port}!`))
export default App;

