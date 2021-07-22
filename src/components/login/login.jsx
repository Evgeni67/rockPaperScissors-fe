import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Container, Col } from "react-bootstrap";
import "./login.css";
import io from "socket.io-client";
import logo from "./chatImg.jpg";
import loader from "./loader2.gif";
const connOpt = {
  transports: ["websocket"], // socket connectin options
};

let socket = io("https://chatio-backend.herokuapp.com/", connOpt); //socket instance
class Login extends Component {
  state = {
    logged: false,
    name: "",
    password: "",
    registering: false,
    showLoginBtn: true,
    imageUploaded: false,
    image: "",
    id : ""
  };
  saveTokensLocally = (data1) => {
    console.log(data1);
    const data = data1[0];
    console.log("TOKENS", data);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", this.state.name);
    this.setState({ logged: true });
    socket.emit("login", data1[1]);
    window.location = "/chat";
  };
  login = async () => {
    console.log(process.env.REACT_APP_URL);
    const url = process.env.REACT_APP_URL + "/profiles/login";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        password: this.state.password,
      }),
    };
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => this.saveTokensLocally(data));
  };
  hideLoginBtn = () => {
    this.setState({ showLoginBtn: false });
    if (this.state.imageUploaded) {
      this.register();
    }
  };
  addPicToUser = async () => {
    let post = new FormData();
    post.append("postPic", this.state.image);
    const url = process.env.REACT_APP_URL + "/profiles/addPictureToProfile/" + this.state.id;
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: post,
    };
    await fetch(url, requestOptions).then((response) => console.log(response.json()));
    this.setState({showLoginBtn:false})
  };
  register = async () => {
    this.setState({ registering: true });
    this.setState({imageUploaded:false})
    const url = process.env.REACT_APP_URL + "/profiles/register";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        password: this.state.password,
        online: false,
        profilePic: "1"
      }),
    };
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({ id: data }));
      this.addPicToUser()
      console.log(this.state.id)
    const that = this;
    setTimeout(function () {
      that.setState({ registering: false });
    }, 1100);
  };
  render() {
    return (
      <>
        <Container className="modalLogin" show={this.state.show}>
          <Row className="logoRow d-flex justify-content-center mb-1">
            <img src={logo} />
          </Row>{" "}
          {this.state.registering ? (
            <>
              <Row className="loaderRow d-flex justify-content-center ">
                {" "}
                <img src={loader} />{" "}
              </Row>
              <Row className="logoRow d-flex justify-content-center mb-4">
                Registering...
              </Row>
            </>
          ) : (
            <>
              <Row className=" d-flex justify-content-center"> Name</Row>
              <Row className=" d-flex justify-content-center">
                <input
                  className="loginTextArea name"
                  onChange={(e) =>
                    this.setState({ name: e.currentTarget.value })
                  }
                />
              </Row>{" "}
              <Row className=" d-flex justify-content-center mt-3">
                {" "}
                Password
              </Row>
              <Row className=" d-flex justify-content-center ">
                <input
                  className="loginTextArea name"
                  type="password"
                  onChange={(e) =>
                    this.setState({ password: e.currentTarget.value })
                  }
                />
              </Row>{" "}
              {!this.state.showLoginBtn ? (
                <>
                  <label class="form-label" for="postImage">
                    <svg
                      stroke="currentColor"
                      fill="rgba(0, 0, 0, 0.7)"
                      stroke-width="0"
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      className="pic"
                    ></svg>
                  </label>
                  {!this.state.imageUploaded ? (
                    <Row className=" picOfYou d-flex justify-content-center mb-3">
                      {" "}
                      Picture of you
                    </Row>
                  ) : null}
                  {this.state.imageUploaded ? (
                    <Row className="d-flex justify-content-center mt-2 mb-4">
                      <img
                        className="picPreview"
                        src={URL.createObjectURL(
                          document.querySelector("#postImage").files[0]
                        )}
                      />{" "}
                    </Row>
                  ) : null}
                  {!this.state.imageUploaded ? (
                    <Row className="d-flex justify-content-center mb-3">
                      <Col className="d-flex justify-content-center">
                        <input
                          accept="image/*"
                          type="file"
                          id="postImage"
                          onChange={(e) =>
                            this.setState({
                              image: e.target.files[0],
                              imageUploaded: true,
                            })
                          }
                          class=" form-control-file"
                          className="inputFile"
                        ></input>
                      </Col>
                    </Row>
                  ) : null}
                </>
              ) : null}
            </>
          )}
          <Row
            className={
              this.state.showLoginBtn
                ? "answerRow d-flex justify-content-center mb-2 mt-5"
                : "visually-hidden"
            }
          >
            <h className="applyBtn" onClick={() => this.login()}>
              Login{" "}
            </h>
          </Row>
          <Row
            className={
              this.state.showLoginBtn
                ? "d-flex justify-content-center mb-2"
                : "visually-hidden"
            }
          >
            <h className="d-flex justify-content-center">Or</h>
          </Row>
          <Row className="answerRow d-flex justify-content-center mb-4">
            <h className="applyBtn" onClick={() => this.hideLoginBtn()}>
              Register{" "}
            </h>
          </Row>
          <Row className="question1 d-flex justify-content-center ">
            {" "}
            <h className=" d-flex justify-content-center">
              {" "}
              * If you do not have an account first click on register and then
              on login{" "}
            </h>
          </Row>
        </Container>
      </>
    );
  }
}
export default Login;
