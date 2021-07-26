import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Container, Modal, Button } from "react-bootstrap";
import "./chat.css";
import logo from "./chatImg.jpg";
import io from "socket.io-client";
import { SiRiotgames } from "react-icons/si";
var uniqid = require("uniqid");
const connOpt = {
  transports: ["websocket"], // socket connectin options
};

let socket = io(process.env.REACT_APP_URL, connOpt); //socket instance
class Chat extends Component {
  constructor() {
    super();
    this.state = {
      onlineProfiles: [],
      msg: "",
      me: "",
      to: "",
      convo: [],
      showConvos: false,
      convoId: "",
      showInviteModal: false,
      currentChallange: {},
    };
  }

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
  handleDataUpdate = (data) => {
    console.log("id -----> ", data._id);
    this.setState({ convo: data.messages });
    this.setState({ convoId: data._id });
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
  sendLike = async (msgId) => {
    console.log("msgId ->" + msgId);
    const url =
      process.env.REACT_APP_URL +
      "/convos/sendLike/" +
      this.state.convoId +
      "/" +
      msgId;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) =>
        socket.emit("sendLike", {
          //emitting an event with a payload to send the message to all connected users
          like: "sent",
        })
      );
    this.loadPreviousConvo(this.state.to);
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
  handleAcceptChallange = async (challange) => {
    console.log("acceptedChallange");
    if (challange.from === localStorage.getItem("username")) {
      this.setState({ currentChallange: challange });
      this.setState({ showInviteModal: false });
      window.location = "/battleground";
    }
  };

  acceptChallange = async (challage) => {
    const url = process.env.REACT_APP_URL + "/battles/startBattle";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        player1: this.state.currentChallange.from,
        player1Card: "-",
        player2: "-",
        player2Card: "-",
        isFinished: false,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    socket.emit("acceptChallange", challage);

    window.location = "/battleground";
  };
  componentDidMount = async () => {
    socket.on("sendMsg", (msg) => this.loadPreviousConvo(this.state.to));
    socket.on("challange", (challange) => this.handleChallange(challange));
    socket.on("acceptChallange", (challange) =>
      this.handleAcceptChallange(challange)
    );
    socket.on("logOut", (name) =>
      this.setState({
        onlineProfiles: this.state.onlineProfiles.filter(
          (profile) => profile.name !== name
        ),
      })
    );
    socket.on("login", (user) =>
      this.setState({ onlineProfiles: this.state.onlineProfiles.concat(user) })
    );
    console.log(this.state.onlineProfiles);
    this.getOnlineProfiles();
  };
  sendChallange = async (to) => {
    var challange = { from: localStorage.getItem("username"), to: to };
    console.log(challange);
    socket.emit("challange", challange);
  };
  getOnlineProfiles = async () => {
    console.log(localStorage.getItem("username"));

    socket.emit("login", localStorage.getItem("username"));
    console.log("online profiles");
    const url = process.env.REACT_APP_URL + "/profiles/getOnlineProfiles";
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({ onlineProfiles: data }));
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
        <Container>
          <Row className="logoRow d-flex justify-content-center ">
            <img src={logo} />
          </Row>{" "}
          <h className="pplOnline d-flex justify-content-center">
            People Online{" "}
          </h>
          <Container className="onlineProfiles">
            {this.state.onlineProfiles
              .filter(
                (profile) => profile.name !== localStorage.getItem("username")
              )
              .map((profile) => (
                <Row
                  className="profileRow d-flex justify-content-center"
                  // onClick={() => this.loadPreviousConvo(profile.name)}
                >
                  <p className="onlineUser">
                    <h>{profile.name}</h>{" "}
                    <SiRiotgames
                      className="challangeIcon"
                      onClick={() => this.sendChallange(profile.name)}
                    />
                  </p>
                </Row>
              ))}
          </Container>
          <h className="chatHeading">
            {" "}
            {this.state.to === ""
              ? "Select someone to chat with"
              : "Your chat with " + this.state.to}{" "}
          </h>
          <Container className="chatContainer mt-3">
            {this.state.convo.map((msg) => (
              <Row onDoubleClick={() => this.sendLike(msg.uniqId)}>
                <p
                  className={
                    msg.from[1] === localStorage.getItem("username")
                      ? "msgRowMe"
                      : "visually-hidden"
                  }
                >
                  <h className="borderClass">{msg.message}</h>
                  <img src={msg.from[0]} className="profilePic1" />
                </p>
                <p
                  className={
                    msg.from[1] === localStorage.getItem("username")
                      ? "visually-hidden"
                      : " msgRow "
                  }
                >
                  <img src={msg.from[0]} className="profilePic2" />
                  <h className="borderClass2">{msg.message}</h>
                </p>
              </Row>
            ))}
            {this.state.to !== "" ? (
              <>
                <Row className="d-flex justify-content-center mt-3">
                  <input
                    className="msgInput"
                    onChange={(e) =>
                      this.setState({ msg: e.currentTarget.value })
                    }
                    placeholder="type here"
                  />
                </Row>
                <Row className="d-flex justify-content-center mt-1">
                  <h className="sendMsgBtn" onClick={() => this.sendMsg()}>
                    {" "}
                    Send{" "}
                  </h>
                </Row>
              </>
            ) : (
              <> </>
            )}
          </Container>
        </Container>
        <Modal
          show={this.state.showInviteModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body className="modalBody d-flex justify-content-center">
            <button
              className="denyBtn"
              onClick={() => this.setState({ showInviteModal: false })}
            >
              Reject
            </button>{" "}
            {this.state.currentChallange.from} Has invited you to play
            <button
              className="acceptButton"
              onClick={() => this.acceptChallange(this.state.currentChallange)}
            >
              Accept
            </button>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default Chat;
