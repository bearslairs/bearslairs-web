import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Thermometer from 'react-thermometer-component'
import Cookies from 'universal-cookie';
//import Nav from './Nav';
import * as qs from 'query-string';
import GoogleMapReact from 'google-map-react';

const querystring = qs.parse(window.location.search);
const cookies = new Cookies();
const CopyApi = 'https://raw.githubusercontent.com/bearslairs/bearslairs-data/master/copy';
const UbiBotApi = 'https://api.ubibot.io/channels/13604?api_key=609210eb2306427a88d662d48ddb578d';
const languages = ['bg', 'en', 'ru'];

class App extends React.Component {
  state = {
    language: 'en',
    copy: {
      carousel: [],
      blurbs: [],
      cards: []
    },
    temperature: {
      value: 0,
      created_at: '2020-01-01T00:00:01Z'
    },
    humidity: {
      value: 0,
      created_at: '2020-01-01T00:00:01Z'
    }
  };

  componentDidMount() {
    let language = languages.includes(querystring.lang) // if the querystring lang is set, use that
      ? querystring.lang
      : languages.includes(cookies.get('lang')) // else if the cookies contain a lang, use that
        ? cookies.get('lang')
        : this.state.language; // fall back to a default
    this.setState(prevState => ({ 
      language: language,
      copy: prevState.copy
    }));
    cookies.set('lang', language, { path: '/' });
    fetch(CopyApi + '/' + language + '/home.json')
    .then(responseCopyApi => responseCopyApi.json())
    .then((copy) => {
      this.setState(prevState => ({
        language: prevState.language,
        copy: copy
      }));
    })
    .catch(console.log);
    fetch(UbiBotApi)
    .then(responseUbiBotApi => responseUbiBotApi.json())
    .then((container) => {
      if (container.result === 'success') {
        let lastValues = JSON.parse(container.channel.last_values);
        this.setState(prevState => ({
          temperature: lastValues.field1,
          humidity: lastValues.field2
        }));
      }
    })
    .catch(console.log);
  }

  render() {
    return (
    <>
      <Container id="container-logo">
        <Row>
          <Image src="logo.png" className="m-auto" />
        </Row>
      </Container>
      <Navbar id="container-nav">
        <Nav className="m-auto">
          <Nav.Link href="#about">about</Nav.Link>
          <Nav.Link href="#prices">prices</Nav.Link>
          <Nav.Link href="#location">location</Nav.Link>
        </Nav>
      </Navbar>
      <Container id="container-header" fluid style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <h2>
          secure self storage in bansko<br />
          with access at your convenience
        </h2>
      </Container>
      <Container id="container-environment">
        <h3>
          real-time environment monitoring
        </h3>
        <p>
          we monitor temperature, humidity and light within the facility and publish those readings at
          &nbsp;
          <a href="https://space.ubibot.io/space/user/device/channel-id/13604">
            ubibot.io/bearslairs-bansko
          </a>,
          <br />
          so our customers can stay informed of the environmetal conditions of their self-storage.
          The latest readings taken were:
        </p>
        <Row className="justify-content-xl-center justify-content-md-center">
          <Col xl="auto" md="auto">
            <Thermometer
              theme="dark"
              value={(Math.round(this.state.temperature.value * 10) / 10)}
              max={(this.state.temperature.value * 1.3)}
              steps="3"
              format="°C"
              size="large"
              height="200"
            />
          </Col>
          <Col xl="auto" md="auto">
            <h4>temperature</h4>
            {
              new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZone: 'Europe/Sofia'
              }).format(new Date(this.state.temperature.created_at))
            }:&nbsp;
            <strong>{(Math.round(this.state.temperature.value * 10) / 10)}°C</strong>

            <h4>humidity</h4>
            {
              new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZone: 'Europe/Sofia'
              }).format(new Date(this.state.humidity.created_at))
            }:&nbsp;
            <strong>{this.state.humidity.value}%</strong>
          </Col>
        </Row>
      </Container>
      <Container fluid>
      </Container>
    </>
    );
  }
}

export default App;
