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
class BattleGroundAI extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      myCard: "",
      whoWins: "",
      enemyCard: "",
    };
  }

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

  componentWillUnmount = async () => {
    await this.logOut();
  };

  sendCard = async (card) => {
    this.setState({ myCard: card });
    console.log(card);
    const randomNumber = Math.floor(Math.random() * 3);
    var enemyCard = ""
    if (randomNumber === 0) {
      this.setState({ enemyCard: "R" });
      enemyCard = "R"
      console.log(" is R " );
    } else if (randomNumber === 1) {
      this.setState({ enemyCard: "P" });
      enemyCard = "P"
      console.log(" is P" );
    } else {
      this.setState({ enemyCard: "S" });
      enemyCard = "S"
      console.log(" is S " );
    }
    console.log(card + " vs " + enemyCard);
    if (card === "R" && enemyCard === "S") {
    } else if (card=== "R" && enemyCard === "P") {
      this.setState({ whoWins: "You lose" });
    } else if (card === "S" &&enemyCard === "P") {
      this.setState({ whoWins: "You win" });
    } else if (card === "P" && enemyCard === "R") {
      this.setState({ whoWins: "You win" });
    } else if (card === "P" && enemyCard === "S") {
      this.setState({ whoWins: "You lose" });
    } else if (card === "S" && enemyCard === "R") {
      this.setState({ whoWins: "You lose" });
    } else {
      this.setState({ whoWins: "Tie" });
    }
  };

  componentDidMount = async () => {
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
                  A.I.
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
             
              </Container>
            </Col>
            <Col
              className="col-xs-6 order-xs-2 d-flex justify-content-center"
              sm={12}
            >
            </Col>{" "}
          </Row>
        </Container>
        <Modal
          show={this.state.whoWins !== "" ? true : false}
          backdrop="static"
          s
          keyboard={false}
        >
          <Modal.Body className="modalBody d-flex justify-content-center">
            <Row>
              <Col sm={3} className="finishText d-flex justify-content-center">
                {" "}
                <p>Your card</p>{" "}
              </Col>
              <Col sm={2} className="d-flex justify-content-center">
                {this.state.myCard === "R" ? (
                  <img
                    src="https://jowaynejosephs.github.io/Rock-Paper-Scissors/img/rock.png"
                    className="yourCard"
                  />
                ) : this.state.myCard === "P" ? (
                  <img
                    src="https://freepikpsd.com/media/2019/10/rock-paper-scissors-png-2-Transparent-Images.png"
                    className="yourCard"
                  />
                ) : (
                  <img
                    src="https://jowaynejosephs.github.io/Rock-Paper-Scissors/img/scissors.png"
                    className="yourCard"
                  />
                )}
              </Col>
              <Col sm={2} className="finishText d-flex justify-content-center">
                {this.state.whoWins}
              </Col>
              <Col sm={2} className="d-flex justify-content-center">
                {this.state.enemyCard === "R" ? (
                  <img
                    src="https://jowaynejosephs.github.io/Rock-Paper-Scissors/img/rock.png"
                    className="enemyCard"
                  />
                ) : this.state.enemyCard === "P" ? (
                  <img
                    src="https://freepikpsd.com/media/2019/10/rock-paper-scissors-png-2-Transparent-Images.png"
                    className="enemyCard"
                  />
                ) : (
                  <img
                    src="https://jowaynejosephs.github.io/Rock-Paper-Scissors/img/scissors.png"
                    className="enemyCard"
                  />
                )}
              </Col>
              <Col
                sm={3}
                className="finishTextEnemy d-flex justify-content-center"
              >
                {" "}
                <p>Enemy card</p>{" "}
              </Col>
              <Row>
                {" "}
                <Col sm={12} className=" ml-1 d-flex justify-content-center">
                  <button
                    className="goHomeBtn"
                    onClick={() => (window.location = "/chat")}
                  >
                    {" "}
                    Return to home{" "}
                  </button>
                </Col>
              </Row>
            </Row>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default BattleGroundAI;
