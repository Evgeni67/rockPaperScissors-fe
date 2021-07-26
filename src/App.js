import "./App.css";
import Login from "./components/login/login";
import Chat from "./components/chat/chat";
import BattleGround from "./components/battleGround/battleGround";
import BattleGroundAI from "./components/battleGroundAI/battleGroundAI";
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
class App extends Component {
  componentDidMount = () => 
  {
    if(window.location.href === "https://chatio-frontend.herokuapp.com/"){
      window.location.href = "https://chatio-frontend.herokuapp.com/login"
    }
  }
  render() {
    return (
      <div className="ChatApp">
        <Router>
          <Route path="/login">
            {" "}
            <Login />{" "}
          </Route>
          <Route path="/chat">
            {" "}
            <Chat />{" "}
          </Route>
          <Route path="/battleGround">
            {" "}
            <BattleGround />{" "}
          </Route>
          <Route path="/battleGroundAI">
            {" "}
            <BattleGroundAI />{" "}
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;
