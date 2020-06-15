import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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
const lairImages = ['/lair-baby.png', '/lair-mama.png', '/lair-papa.png'];
const bikeImages = ['/bike-rack.png', '/bike-small.png', '/bike-large.png'];

class App extends Component {
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
          <Image src={'/logo.png'} className="m-auto" />
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
      <Container id="container-about" fluid>
        {
          this.state.copy.blurbs.slice(0, 1).map((blurb, blurbIndex) => (
            <Container key={blurbIndex}>
              <h3>{blurb.title}</h3>
              <Row className="justify-content-xl-center justify-content-md-center">
              {
                blurb.copy.map((paragraph, paragraphIndex) => (
                  <Col xl={(12 / blurb.copy.length)} key={paragraphIndex}>
                    <Image src={paragraph.image} />
                    <p>{paragraph.text}</p>
                  </Col>
                ))
              }
              </Row>
            </Container>
          ))
        }
      </Container>
      <Container id="container-security" fluid>
        <Container>
          <Row className="justify-content-xl-center justify-content-md-center">
            {
              this.state.copy.blurbs.slice(1, 2).map((blurb, blurbIndex) => (
                <Col xl={7} key={blurbIndex}>
                  <h3>{blurb.title}</h3>
                  {
                    blurb.copy.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>
                        {paragraph}
                      </p>
                    ))
                  }
                  <LinkContainer to={'/book'}>
                    <Button size="sm">
                      book now
                    </Button>
                  </LinkContainer>
                </Col>
              ))
            }
          </Row>
        </Container>
      </Container>
      <Container id="container-lair">
        <h3>
          choose your lair
        </h3>
        <Row className="justify-content-xl-center justify-content-md-center">
          {
            this.state.copy.cards.slice(0, 3).map((card, cardIndex) => (
              <Col key={cardIndex}>
              <Card className="h-100">
                <Card.Header>
                  {card.title}
                </Card.Header>
                <Card.Img variant="top" src={lairImages[cardIndex]} alt={card.image.alt} rounded="true" />
                <Card.Body>
                  <Card.Title>
                    {card.description.join(' ')}
                  </Card.Title>
                  <hr />
                  <ul style={{lmargin: 0, padding: 0}}>
                    {
                      card.features.map((feature, featureIndex) => (
                        <li key={featureIndex} style={{fontWeight: 600, margin: 0, padding: 0}}>
                          {feature.text}
                          <ul style={{lmargin: 0, padding: 0}}>
                            {
                              feature.details.map((detail, detailIndex) => (
                                <li key={detailIndex} style={{listStyleType: 'none', fontWeight: 'normal', margin: 0, padding: 0}}>
                                  {detail}
                                </li>
                              ))
                            }
                          </ul>
                        </li>
                      ))
                    }
                  </ul>
                </Card.Body>
                <Card.Footer>
                  <LinkContainer to={card.button.link}>
                    <Button size="sm">
                      {card.button.text}
                    </Button>
                  </LinkContainer>
                </Card.Footer>
              </Card>
              </Col>
            ))
          }
        </Row>
      </Container>
      <Container id="container-adaptive" fluid>
        {
          this.state.copy.blurbs.slice(2, 3).map((blurb, blurbIndex) => (
            <Container key={blurbIndex}>
              <h3>{blurb.title}</h3>
              <Row className="justify-content-xl-center justify-content-md-center">
                <Col xl={7}>
                  <p>{blurb.copy[0]}</p>
                </Col>
              </Row>
              <blockquote className="blockquote">
                <p>{blurb.copy[1]}</p>
              </blockquote>
            </Container>
          ))
        }
      </Container>
      <Container id="container-bike" fluid>
        {
          this.state.copy.blurbs.slice(3, 4).map((blurb, blurbIndex) => (
            <Container key={blurbIndex}>
              <h3>{blurb.title}</h3>
              <Row className="justify-content-xl-center justify-content-md-center">
                <Col xl={8}>
                  <p>{blurb.copy[0]}</p>
                </Col>
              </Row>
            </Container>
          ))
        }
        <Container>
          <Row className="justify-content-xl-center justify-content-md-center">
            {
              this.state.copy.cards.slice(3, 6).map((card, cardIndex) => (
                <Col key={cardIndex}>
                <Card className="h-100">
                  <Card.Header>
                    {card.title}
                  </Card.Header>
                  <Card.Img variant="top" src={bikeImages[cardIndex]} alt={card.image.alt} rounded="true" />
                  <Card.Body>
                    <Card.Title>
                      {card.description.join(' ')}
                    </Card.Title>
                    <hr />
                    <ul style={{lmargin: 0, padding: 0}}>
                      {
                        card.features.map((feature, featureIndex) => (
                          <li key={featureIndex} style={{fontWeight: 600, margin: 0, padding: 0}}>
                            {feature.text}
                            <ul style={{margin: 0, padding: 0}}>
                              {
                                feature.details.map((detail, detailIndex) => (
                                  <li key={detailIndex} style={{listStyleType: 'none', fontWeight: 'normal', margin: 0, padding: 0}}>
                                    {detail}
                                  </li>
                                ))
                              }
                            </ul>
                          </li>
                        ))
                      }
                    </ul>
                  </Card.Body>
                  <Card.Footer>
                    <LinkContainer to={card.button.link}>
                      <Button size="sm">
                        {card.button.text}
                      </Button>
                    </LinkContainer>
                  </Card.Footer>
                </Card>
                </Col>
              ))
            }
          </Row>
        </Container>
      </Container>
      <Container id="container-facility" fluid>
        {
          this.state.copy.blurbs.slice(4, 5).map((blurb, blurbIndex) => (
            <Container key={blurbIndex}>
              <h3>{blurb.title}</h3>
              <Row className="justify-content-xl-center justify-content-md-center">
              {
                blurb.copy.map((paragraph, paragraphIndex) => (
                  <Col xl={(12 / blurb.copy.length)} key={paragraphIndex}>
                    <Image src={paragraph.image} />
                    <p>{paragraph.text}</p>
                  </Col>
                ))
              }
              </Row>
              <Row className="justify-content-xl-center justify-content-md-center">
                <Col xl="auto" md="auto">
                  <LinkContainer to={'/book'}>
                    <Button size="sm">
                      book now
                    </Button>
                  </LinkContainer>
                </Col>
              </Row>
            </Container>
          ))
        }
      </Container>
      <Container id="container-map" fluid>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCKw8by28pNI5tlimezyyjgtXz_Nvkq2-Y' }}
          defaultCenter={{ lat: 41.820582, lng: 23.478257 }}
          defaultZoom={ 14 }
          onGoogleApiLoaded={({map, maps}) => {
            let marker = new maps.Marker({
              position: { lat: 41.820582, lng: 23.478257 },
              map,
              title: 'Bears Lairs, Bansko',
              description: 'secure, self-storage in bansko with access at your convenience',
              link: {
                url: 'https://www.google.com/maps/place/Bears+Lairs/@41.8223813,23.4681867,15z/data=!4m5!3m4!1s0x0:0xadd4ea4c0b9a3216!8m2!3d41.820631!4d23.478215',
                text: 'maps.google.com/Bears+Lairs'
              }
            });
            let infoWindow = new maps.InfoWindow({
              content: '<h4><img src="favicon-32x32.png" style="margin-right: 6px;" class="rounded-circle" />' + marker.title + '</h4><p>' + marker.description + '<br /><a href="' + marker.link.url + '">' + marker.link.text + '</a></p>'
            });
            infoWindow.open(map, marker);
            marker.addListener('click', () => {
              map.setZoom(14);
              map.setCenter(marker.getPosition());
              infoWindow.open(map, marker);
            });
          }} />
      </Container>
      <Container id="container-footer" fluid>
        <Container>
          <Row className="justify-content-xl-center justify-content-md-center">
            <Col xl={6}>
              <a href="mailto:enquiries@bearslairs.eu">enquiries@bearslairs.eu</a>
              <hr />
              &copy; 2020, Bears Lairs EOOD, Bulgaria. All rights reserved
            </Col>
          </Row>
        </Container>
      </Container>
    </>
    );
  }
}

export default App;
