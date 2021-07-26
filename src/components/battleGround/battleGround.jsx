import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Container, Modal, Col, Button } from "react-bootstrap";
import "./battleGround.css";
import io from "socket.io-client";
import loader from "./loader2.gif";
import { SiRiotgames } from "react-icons/si";
import card from "./backOfACard.jpg";
var uniqid = require("uniqid");
const connOpt = {
  transports: ["websocket"], // socket connectin options
};

let socket = io(process.env.REACT_APP_URL, connOpt); //socket instance
class BattleGround extends Component {
  constructor() {
    super();
    this.state = {
      convo: [],
      convoId: "",
      currentChallange: {},
      loading: true,
      currentBattle: {},
      player1: false,
      currentCard: "",
      isEnemyReady: false,
    };
  }
  componentDidMount = async () => {
    socket.on("placeCard", (move) => console.log(move));
  };
  loadPreviousConvo = async (name) => {
    const url = process.env.REACT_APP_URL + "/convos/getConvo";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        to: name,
        message: this.state.msg,
      }),
    })
      .then((response) => response.json())
      .then((data) => this.handleDataUpdate(data));
    this.setState({ to: name });
  };

  logOut = async (id) => {
    console.log(process.env.REACT_APP_URL);
    const url = process.env.REACT_APP_URL + "/profiles/logOut";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    await fetch(url, requestOptions);
    socket.emit("logOut", localStorage.getItem("username"));
    window.location = "/login";
  };
  sendMsg = async () => {
    const url = process.env.REACT_APP_URL + "/convos/sendMsg";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        from: [this.state.me, localStorage.getItem("username")],
        to: this.state.to,
        message: this.state.msg,
        isLiked: false,
        uniqId: uniqid(),
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    socket.emit("sendMsg", {
      //emitting an event with a payload to send the message to all connected users
      from: [this.state.me, localStorage.getItem("username")],
      to: this.state.to,
      message: this.state.msg,
      isLiked: false,
      uniqId: uniqid(),
    });
    document.querySelector(".msgInput").value = "";
  };

  componentWillUnmount = async () => {
    await this.logOut();
  };

  handleChallange = async (challange) => {
    console.log("challange");
    if (challange.to === localStorage.getItem("username")) {
      this.setState({ currentChallange: challange });
      this.setState({ showInviteModal: true });
    }
  };
  sendCard = async (card) => {
        var move =  { to: this.state.currentBattle.player2 }
        socket.emit("placeCard", move);
    const url =
      process.env.REACT_APP_URL +
      "/battles/addCard/" +
      this.state.currentBattle._id;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        playerCard: card,
        isPlayer1: this.state.player1,
      }),
    })
      .then((response) => response.json())
      .then((data) => this.setState({ currentBattle: data }));

 
  };
  getBattle = async () => {
    const url = process.env.REACT_APP_URL + "/battles/getBattle";
    console.log("processing");
    await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => this.setState({ currentBattle: data }));
  };
  handlePlacedCard = async (move) => {
    if (move.to === localStorage.getItem("username")) {
      this.setState({ isEnemyReady: true });
      console.log("CARD PLACED");
    }
  };


  componentDidMount = async () => {
      socket.on("placeCard", (move) => this.handlePlacedCard(move))
    await this.getBattle();
    if (this.state.currentBattle.player1 === localStorage.getItem("username")) {
      this.setState({ player1: true });
    }
    const that = this;
    setTimeout(function () {
      that.setState({ loading: false });
    }, 1100);
  };
  render() {
    return (
      <>
        <h className="welcome d-flex justify-content-left">
          Welcome, {localStorage.getItem("username")}
        </h>
        <p className="welcome2" onClick={() => this.logOut()}>
          LogOut
        </p>
        <Row
          className={
            this.state.loading
              ? "d-flex justify-content-center"
              : "visually-hidden"
          }
        >
          {" "}
          <img src={loader} />
        </Row>
        <Container
          className={
            this.state.loading ? "visually-hidden" : "battleGroundContainer"
          }
        >
          <Row className="enemyRow">
            <Col sm={12} xs={12}></Col>
            <Col sm={12} xs={12}>
              {" "}
              <Container>
                <Row className="enemyName d-flex justify-content-center">
                  {this.state.player1
                    ? this.state.currentBattle.player2
                    : this.state.currentBattle.player1}
                </Row>
                <Row className="d-flex justify-content-center mt-3">
                  <Row className="d-flex justify-content-center">
                    <Col
                      xs={12}
                      sm={12}
                      lg={12}
                      className="enemyCard1 d-flex justify-content-center"
                    ></Col>
                    <Col
                      xs={4}
                      sm={4}
                      lg={4}
                      className="enemyCard2 d-flex justify-content-center"
                    ></Col>
                    <Col
                      xs={4}
                      sm={4}
                      lg={4}
                      className="enemyCard3 d-flex justify-content-center"
                    ></Col>
                  </Row>
                </Row>
              </Container>
            </Col>
            <Col sm={4} xs={12}></Col>{" "}
          </Row>

          <Row className="myRow mt-5">
            <Col
              sm={12}
              xs={12}
              lg={12}
              className=" d-flex justify-content-center"
            ></Col>
            <Col className="col-xs-12 order-xs-3" sm={12} xs={12}>
              <Container>
                <Row className="d-flex justify-content-center">
                  <Col
                    xs={4}
                    sm={4}
                    lg={4}
                    className="card1 d-flex justify-content-center"
                  >
                    <Row>
                      <img
                        src="https://jowaynejosephs.github.io/Rock-Paper-Scissors/img/rock.png"
                        className="gamePic"
                        onClick={() => this.sendCard("R")}
                      />
                    </Row>
                  </Col>
                  <Col
                    xs={4}
                    sm={4}
                    lg={4}
                    className="card2 d-flex justify-content-center"
                  >
                    <img
                      src="https://freepikpsd.com/media/2019/10/rock-paper-scissors-png-2-Transparent-Images.png"
                      className="gamePic"
                      onClick={() => this.sendCard("P")}
                    />
                  </Col>
                  <Col
                    xs={4}
                    sm={4}
                    lg={4}
                    className="card3 d-flex justify-content-center"
                  >
                    <img
                      src="https://jowaynejosephs.github.io/Rock-Paper-Scissors/img/scissors.png"
                      className="gamePic"
                      onClick={() => this.sendCard("S")}
                    />
                  </Col>
                </Row>
                <Row className="myName d-flex justify-content-center mt-3">
                  {this.state.player1
                    ? this.state.currentBattle.player1
                    : this.state.currentBattle.player2}
                </Row>
              </Container>
            </Col>
            <Col
              className="col-xs-6 order-xs-2 d-flex justify-content-center"
              sm={12}
            >
              timer
            </Col>{" "}
          </Row>
        </Container>
      </>
    );
  }
}
export default BattleGround;
