import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Modal,
  Button,
  Accordion,
  Panel,
  ButtonGroup,
  Dropdown,
  MenuItem,
  OverlayTrigger,
  Tooltip,
  Alert,
  Label,
} from 'react-bootstrap';
import { actions as UiStateActions } from '../../redux/modules/uiState';
import {
  constants as ehrenamtConstants,
  actions as EhrenamtActions,
} from '../../redux/modules/ehrenamt';

import Icon from 'components/commons/Icon';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';

import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import MultiToggleButton from '../MultiToggleButton';

import { Link } from 'react-scroll';

import copy from 'copy-to-clipboard';
import GenericRVRStadtplanwerkMenuFooter from '../commons/GenericRVRStadtplanwerkMenuFooter';
/* eslint-disable jsx-a11y/anchor-is-valid */

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    ehrenamtState: state.ehrenamt,
    routing: state.routing,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(UiStateActions, dispatch),
    ehrenamtActions: bindActionCreators(EhrenamtActions, dispatch),
  };
}

export class EhrenamtModalApplicationMenu_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.close = this.close.bind(this);
    this.handlePosOnChange = this.handlePosOnChange.bind(this);
    this.handleNegOnChange = this.handleNegOnChange.bind(this);
  }

  close() {
    this.props.uiActions.showApplicationMenu(false);
  }

  handlePosOnChange(tags) {
    let newState = { pos: tags, neg: this.state.neg };
    this.setState(newState);
    let positiv = {
      globalbereiche: [],
      kenntnisse: [],
      zielgruppen: [],
    };
    for (let tag of tags) {
      positiv[tag.cat].push(tag.value);
    }
    let filterX = {
      filtermode: ehrenamtConstants.OR_FILTER,
      positiv,
      negativ: JSON.parse(JSON.stringify(this.props.ehrenamtState.filterX.negativ)),
    };
    this.props.ehrenamtActions.setFilterAndApply(filterX);
  }

  handleNegOnChange(tags) {
    let newState = { neg: tags, pos: this.state.pos };
    this.setState(newState);
    let negativ = {
      globalbereiche: [],
      kenntnisse: [],
      zielgruppen: [],
    };
    for (let tag of tags) {
      negativ[tag.cat].push(tag.value);
    }
    let filterX = {
      filtermode: ehrenamtConstants.OR_FILTER,
      negativ,
      positiv: JSON.parse(JSON.stringify(this.props.ehrenamtState.filterX.positiv)),
    };
    this.props.ehrenamtActions.setFilterAndApply(filterX);
  }

  createSectionRows(section) {
    let rows = [];
    for (let item of this.props[section]) {
      let buttonValue = 'two'; // neutral state

      if (this.props.filterX.positiv[section].indexOf(item) !== -1) {
        buttonValue = 'one';
      } else if (this.props.filterX.negativ[section].indexOf(item) !== -1) {
        buttonValue = 'three';
      }
      let cb = (
        <tr key={'tr.for.mtbutton.' + section + '.' + item}>
          <td
            key={'td1.for.mtbutton.' + section + '.' + item}
            style={{
              textAlign: 'left',
              verticalAlign: 'top',
              padding: '5px',
            }}
          >
            {item}
          </td>
          <td
            key={'td2.for.mtbutton.' + section + '.' + item}
            style={{
              textAlign: 'left',
              verticalAlign: 'top',
              padding: '5px',
            }}
          >
            <MultiToggleButton
              key={'mtbutton.' + section + '.' + item}
              value={buttonValue}
              valueChanged={(selectedValue) => {
                if (selectedValue === 'one') {
                  this.props.ehrenamtActions.toggleFilter('positiv', section, item);
                } else if (selectedValue === 'three') {
                  this.props.ehrenamtActions.toggleFilter('negativ', section, item);
                } else {
                  //deselect existing selection
                  if (buttonValue === 'one') {
                    this.props.ehrenamtActions.toggleFilter('positiv', section, item);
                  } else if (buttonValue === 'three') {
                    this.props.ehrenamtActions.toggleFilter('negativ', section, item);
                  }
                }
              }}
            />
          </td>
        </tr>
      );
      rows.push(cb);
    }
    return rows;
  }

  // componentWillMount() {
  //     let pos=[];
  //     let neg=[];

  //     for (let cat in this.props.ehrenamtState.filterX.positiv){
  //          for (let val of this.props.ehrenamtState.filterX.positiv[cat]){
  //             pos.push({
  //                  label:val,
  //                  value:val,
  //                  cat
  //              });
  //          }
  //      }
  //      for (let cat in this.props.ehrenamtState.filterX.negativ){
  //         for (let val of this.props.ehrenamtState.filterX.negativ[cat]){
  //             neg.push({
  //                 label:val,
  //                 value:val,
  //                 cat
  //             });
  //         }
  //     }
  //     let newState={pos,neg};
  //     this.setState(newState)
  // }
  render() {
    //This should be in componentWillMount()
    let pos = [];
    let neg = [];

    for (let cat in this.props.ehrenamtState.filterX.positiv) {
      for (let val of this.props.ehrenamtState.filterX.positiv[cat]) {
        pos.push({
          label: val,
          value: val,
          cat,
        });
      }
    }
    for (let cat in this.props.ehrenamtState.filterX.negativ) {
      for (let val of this.props.ehrenamtState.filterX.negativ[cat]) {
        neg.push({
          label: val,
          value: val,
          cat,
        });
      }
    }
    let newState = { pos, neg };
    // should be done with this.setState(newState) in componentWillMount()
    // but then > refresh problem
    // TODO / DANGER
    /*eslint-disable */
    this.state = newState;
    /*eslint-anable */

    let modalBodyStyle = {
      overflowY: 'auto',
      overflowX: 'hidden',
      maxHeight: this.props.uiState.height - 200,
    };

    let zgOptions = [];
    let ktOptions = [];
    let berOptions = [];

    for (let zg of this.props.zielgruppen) {
      zgOptions.push({
        label: zg,
        cat: 'zielgruppen',
        value: zg,
      });
    }

    for (let k of this.props.kenntnisse) {
      ktOptions.push({
        label: k,
        cat: 'kenntnisse',
        value: k,
      });
    }

    for (let b of this.props.globalbereiche) {
      berOptions.push({
        label: b,
        cat: 'globalbereiche',
        value: b,
      });
    }

    let options = [
      {
        label: 'Aufgabenfeld',
        cat: 'group',
        options: berOptions,
      },
      {
        label: 'Aufgabe',
        cat: 'group',
        options: ktOptions,
      },
      {
        label: 'Zielgruppe',
        cat: 'group',
        options: zgOptions,
      },
    ];

    let zgRows = this.createSectionRows('zielgruppen');
    let kenRows = this.createSectionRows('kenntnisse');
    let glbRows = this.createSectionRows('globalbereiche');

    let cartOffers = [];
    let mailCartOffer =
      'Sehr geehrte Damen und Herren,' +
      '%0D%0Dich habe in einer ersten Recherche folgende, für mich interessante Angebote entdeckt:%0D';

    for (let cartOffer of this.props.ehrenamtState.cart) {
      mailCartOffer += '%0D * Angebot Nr. ' + cartOffer.id;
      mailCartOffer += '%0D   ' + cartOffer.text;
      mailCartOffer += '%0D';

      let o = (
        <li key={'cart.li.' + cartOffer.id}>
          <h5>
            Angebot Nr. {cartOffer.id}
            &nbsp;&nbsp;&nbsp;
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip style={{ zIndex: 3000000000 }} id="showinmaptt">
                  in Karte anzeigen
                </Tooltip>
              }
            >
              <a
                style={{ color: 'black' }}
                onClick={() => {
                  this.props.centerOnPoint(cartOffer.geo_x, cartOffer.geo_y, 13);
                  //ugly winning: select offer doenst work when the map has to be moved
                  setTimeout(() => this.props.ehrenamtActions.selectOffer(cartOffer), 1000);
                  this.close();
                }}
              >
                <Icon name="map-marker" />
              </a>
            </OverlayTrigger>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip style={{ zIndex: 3000000000 }} id="removefromcarttt">
                  aus Merkliste entfernen
                </Tooltip>
              }
            >
              <a
                style={{ color: '#C33D17' }}
                onClick={() => {
                  this.props.ehrenamtActions.toggleCartFromOffer(cartOffer);
                }}
              >
                <Icon name="minus-square" />
              </a>
            </OverlayTrigger>
          </h5>
          <h6>{cartOffer.text}</h6>
        </li>
      );
      cartOffers.push(o);
    }

    mailCartOffer += '%0D';
    mailCartOffer += '%0D';
    mailCartOffer += '%0D';
    mailCartOffer += '%0DMit freundlichen Grüßen';
    mailCartOffer += '%0D';
    mailCartOffer += '%0D';
    mailCartOffer += '%0D';
    mailCartOffer += '%0D';
    mailCartOffer += '%0D';
    mailCartOffer += '%0D';
    mailCartOffer += '%0D';
    mailCartOffer += '%0D';
    mailCartOffer += '%0DLink zur Anwendung:%0D';
    let mailToHref =
      'mailto:post@zfgt.de?subject=Merkliste&body=' +
      mailCartOffer +
      encodeURI(window.location.href.replace(/&/g, '%26'));
    let angebotOrAngebote = 'Angebote';
    if (this.props.filteredOffersCount === 1) {
      angebotOrAngebote = 'Angebot';
    }
    return (
      <Modal
        style={{
          zIndex: 3000000000,
        }}
        height="100%"
        bsSize="large"
        show={this.props.uiState.applicationMenuVisible}
        onHide={this.close}
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>
            <Icon name="bars" />
            &nbsp;&nbsp;&nbsp;Filter, Merkliste und Kompaktanleitung
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={modalBodyStyle}
          id="myMenu"
          key={this.props.uiState.applicationMenuActiveKey}
        >
          <span>
            W&auml;hlen Sie Ihre Such- und Ausschlussbedingungen in den{' '}
            <Link
              to="filter"
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => this.props.uiActions.setApplicationMenuActiveKey('filtertab')}
            >
              Filtern
            </Link>{' '}
            aus, um die angezeigten Angebote an Ihre Interessen anzupassen (alternativ &uuml;ber die
            Einstellungen unter den darunter folgenden Leitfragen). Über{' '}
            <Link
              to="cart"
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => this.props.uiActions.setApplicationMenuActiveKey('cart')}
            >
              meine Merkliste
            </Link>{' '}
            erreichen Sie die Liste der Angebote, die Sie festgehalten haben. W&auml;hlen Sie{' '}
            <Link
              to="help"
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => this.props.uiActions.setApplicationMenuActiveKey('help')}
            >
              Kompaktanleitung
            </Link>{' '}
            f&uuml;r detailliertere Bedienungsinformationen.
          </span>
          <br />
          <br />
          <Accordion
            name="filter"
            key={'acc.filter.' + this.props.uiState.applicationMenuActiveKey}
            defaultActiveKey={this.props.uiState.applicationMenuActiveKey || 'filtertab'}
            onSelect={() => {
              if (this.props.uiState.applicationMenuActiveKey === 'filtertab') {
                this.props.uiActions.setApplicationMenuActiveKey('none');
              } else {
                this.props.uiActions.setApplicationMenuActiveKey('filtertab');
              }
            }}
          >
            <Panel
              height="auto"
              header={
                'Filtern (' +
                this.props.filteredOffersCount +
                ' ' +
                angebotOrAngebote +
                ' gefunden, davon ' +
                this.props.featureCollectionCount +
                ' in der Karte)'
              }
              eventKey="filtertab"
              bsStyle="primary"
            >
              <h4>Ich suche nach:</h4>
              <Select
                id={'pos'}
                key={'Filtercombo.pos.' + JSON.stringify(this.props.filterX.positiv)}
                className="pos-select"
                clearAllText="alle entfernen"
                noResultsText="keine Kategorien gefunden"
                searchPromptText="Kategorien auswählen ..."
                placeholder="Kategorien auswählen ..."
                multi={true}
                options={options}
                onChange={this.handlePosOnChange}
                value={this.state.pos}
                closeOnSelect={false}
                searchable={true}
                valueRenderer={(option) => {
                  return <div style={{}}>{option.label}</div>;
                }}
                optionRenderer={(option) => {
                  if (option.cat !== 'group') {
                    return <div style={{}}>{option.label}</div>;
                  } else {
                    return <div>{option.label}</div>;
                  }
                }}
              />
              <h4>Ich schlie&szlig;e aus:</h4>
              <Select
                id={'neg'}
                key={'Filtercombo.neg.' + JSON.stringify(this.props.filterX.negativ)}
                className="neg-select"
                clearAllText="alle entfernen"
                noResultsText="keine Kategorien gefunden"
                searchPromptText="Kategorien auswählen ..."
                placeholder="Kategorien auswählen ..."
                multi={true}
                options={options}
                onChange={this.handleNegOnChange}
                value={this.state.neg}
                closeOnSelect={false}
                searchable={true}
                valueRenderer={(option) => {
                  return <div>{option.label}</div>;
                }}
                optionRenderer={(option) => {
                  if (option.cat !== 'group') {
                    return <div>{option.label}</div>;
                  } else {
                    return <div>{option.label}</div>;
                  }
                }}
                menuStyle={{ height: '400px' }}
              />
            </Panel>
          </Accordion>

          <Accordion key={'ACC'} defaultActiveKey="none">
            {this.props.ehrenamtState.globalbereiche.length > 0 && (
              <Panel
                header="Welches Aufgabenfeld interessiert mich?"
                eventKey="bereiche_adv_filter"
                bsStyle="warning"
              >
                <table border={0}>
                  <tbody>{glbRows}</tbody>
                </table>
              </Panel>
            )}
            {this.props.ehrenamtState.kenntnisse.length > 0 && (
              <Panel header="Was will ich tun?" eventKey="kenntnisse_adv_filter" bsStyle="info">
                <table border={0}>
                  <tbody>{kenRows}</tbody>
                </table>
              </Panel>
            )}
            {this.props.ehrenamtState.zielgruppen.length > 0 && (
              <Panel
                header="Mit wem möchte ich arbeiten?"
                eventKey="Zielgruppen_adv_filter"
                bsStyle="success"
              >
                <table border={0}>
                  <tbody>{zgRows}</tbody>
                </table>
              </Panel>
            )}
          </Accordion>
          <Accordion
            name="cart"
            key={'cart' + this.props.uiState.applicationMenuActiveKey}
            defaultActiveKey={this.props.uiState.applicationMenuActiveKey}
            onSelect={() => {
              if (this.props.uiState.applicationMenuActiveKey === 'cart') {
                this.props.uiActions.setApplicationMenuActiveKey('none');
              } else {
                this.props.uiActions.setApplicationMenuActiveKey('cart');
              }
            }}
          >
            <Panel
              header={'meine Merkliste (' + this.props.ehrenamtState.cart.length + ')'}
              eventKey="cart"
              bsStyle="primary"
            >
              <table width="100%" border={0}>
                <tbody>
                  <tr>
                    <td>
                      <ul>
                        <span>{cartOffers}</span>
                      </ul>
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        verticalAlign: 'top',
                      }}
                    >
                      <ButtonGroup bsStyle="default">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip style={{ zIndex: 3000000000 }} id="clearcarttt">
                              Merkliste löschen
                            </Tooltip>
                          }
                        >
                          <Button onClick={this.props.ehrenamtActions.clearCart}>
                            <Icon name="trash" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip style={{ zIndex: 3000000000 }} id="cartfiltertt">
                              Merklistenfilter aktivieren
                            </Tooltip>
                          }
                        >
                          <Button
                            onClick={() => {
                              this.props.ehrenamtActions.setMode(ehrenamtConstants.CART_FILTER);
                              this.close();
                            }}
                          >
                            <Icon name="map" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip style={{ zIndex: 3000000000 }} id="sharecarttt">
                              Merkliste teilen
                            </Tooltip>
                          }
                        >
                          <Dropdown
                            bsStyle="default"
                            title="title"
                            key="DropdownButton"
                            id={'DropdownButton'}
                            icon="share"
                            pullRight
                          >
                            <Dropdown.Toggle>
                              <Icon name="share-square" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <MenuItem
                                eventKey="1"
                                onClick={() => {
                                  copy(window.location.href);
                                }}
                              >
                                <Icon name="copy" /> Link kopieren
                              </MenuItem>
                              <MenuItem eventKey="2" href={mailToHref}>
                                <Icon name="at" /> Merkliste per Mail senden
                              </MenuItem>
                              <MenuItem
                                disabled={true}
                                eventKey="3"
                                onClick={() => console.log('copy')}
                              >
                                <Icon name="print" /> Merkliste drucken
                              </MenuItem>
                            </Dropdown.Menu>
                          </Dropdown>
                        </OverlayTrigger>
                      </ButtonGroup>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Alert style={{ marginBottom: 0, marginTop: 5 }} bsStyle="warning">
                <div>
                  Haben Sie interessante Angebote gefunden? Dann treten Sie mit uns in Kontakt
                  (Telefon +49-(0)202-946-20445 oder E-Mail{' '}
                  <a href="mailto:post@zfgt.de">post@zfgt.de</a>
                  ). Wir werden Sie bei den weiteren Schritten beraten.
                </div>
              </Alert>
            </Panel>
          </Accordion>
          <Accordion
            name="help"
            key={'helptext' + this.props.uiState.applicationMenuActiveKey}
            defaultActiveKey={this.props.uiState.applicationMenuActiveKey}
            onSelect={() => {
              if (this.props.uiState.applicationMenuActiveKey === 'help') {
                this.props.uiActions.setApplicationMenuActiveKey('none');
              } else {
                this.props.uiActions.setApplicationMenuActiveKey('help');
              }
            }}
          >
            <Panel header="Kompaktanleitung" eventKey="help" bsStyle="default">
              <div>
                <Link to="Datengrundlage" containerId="myMenu" style={{ textDecoration: 'none' }}>
                  {' '}
                  <Label bsStyle="default">Datengrundlage</Label>{' '}
                </Link>
                <Link
                  to="Kartendarstellung"
                  containerId="myMenu"
                  style={{ textDecoration: 'none' }}
                >
                  {' '}
                  <Label bsStyle="success">Kartendarstellung der Angebote</Label>{' '}
                </Link>
                <Link to="positionieren" containerId="myMenu" style={{ textDecoration: 'none' }}>
                  {' '}
                  <Label bsStyle="success">In Karte positionieren</Label>{' '}
                </Link>
                <Link to="MeinStandort" containerId="myMenu" style={{ textDecoration: 'none' }}>
                  {' '}
                  <Label bsStyle="success">Mein Standort</Label>{' '}
                </Link>
                <Link to="selektieren" containerId="myMenu" style={{ textDecoration: 'none' }}>
                  {' '}
                  <Label bsStyle="info">Angebote selektieren</Label>{' '}
                </Link>
                <Link to="merken" containerId="myMenu" style={{ textDecoration: 'none' }}>
                  {' '}
                  <Label bsStyle="info">Angebote merken</Label>{' '}
                </Link>
                <Link to="Merkliste" containerId="myMenu" style={{ textDecoration: 'none' }}>
                  {' '}
                  <Label bsStyle="primary">Merkliste öffnen</Label>{' '}
                </Link>
                <Link
                  to="FunktionenMerkliste"
                  containerId="myMenu"
                  style={{ textDecoration: 'none' }}
                >
                  <Label bsStyle="primary">Funktionen der Merkliste</Label>{' '}
                </Link>
                <Link to="filtern" containerId="myMenu" style={{ textDecoration: 'none' }}>
                  {' '}
                  <Label bsStyle="warning">Angebote filtern</Label>{' '}
                </Link>
              </div>

              <div name="Datengrundlage">
                <br />
              </div>
              <h4>
                Datengrundlage{' '}
                <Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
                  <Icon name="arrow-circle-up" />
                </Link>
              </h4>
              <p>
                Diese Anwendung gibt Ihnen einen Überblick über die angebotenen Ehrenamtsstellen aus
                der Datenbank des Zentrums für gute Taten. Genau diese Daten werden vom Zentrum für
                gute Taten auch als Open-Data-Datensatz{' '}
                <a
                  target="_opendata"
                  href="https://offenedaten-wuppertal.de/dataset/ehrenamtsstellen-wuppertal"
                >
                  Ehrenamtsstellen Wuppertal
                </a>{' '}
                im Open-Data-Portal der Stadt Wuppertal publiziert. Die Darstellung der Einsatzorte
                als Karte macht es Ihnen dabei leicht, Ehrenamtsstellen in Ihrer Nähe zu finden.
                Einer Ehrenamtsstelle sind im Allgemeinfall mehrere <em>Aufgaben</em> und{' '}
                <em>Zielgruppen</em> zugeordnet.
              </p>

              <div name="Kartendarstellung">
                <br />
              </div>
              <h4>
                Hintergrundkarte der Angebote{' '}
                <Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
                  <Icon name="arrow-circle-up" />
                </Link>
              </h4>
              <p>
                Die in der Karte für die Punktdarstellungen der Angebote verwendeten Farben stehen
                jeweils für eine bestimmte Kombination der Kategorisierungen in den Bereichen{' '}
                <em>Aufgaben</em> und <em>Zielgruppen</em>.<br />
                Eng beieinander liegende Angebote werden maßstabsabhängig zu größeren Punkten
                zusammengefasst, mit der Anzahl der repräsentierten Angebote im Zentrum{' '}
                <img alt="Cluster" src="images/colorcircle_k.jpg" />.<br />
                Vergrößern Sie ein paar Mal durch direktes Anklicken eines solchen Punktes oder mit{' '}
                <Icon name="plus" /> die Darstellung, so werden die zusammengefassten Angebote
                Schritt für Schritt in die kleineren Punktdarstellungen für die konkreten
                Einzelangebote zerlegt. Nur Angebote, die sich auf denselben Standort beziehen,
                werden in jedem Maßstab als Zusammenfassung dargestellt. In diesen Fällen führt ein
                weiterer Klick ab einer bestimmten Maßstabsstufe (Zoomstufe 12) dazu, dass eine
                Explosionsgrafik der zusammengefassten Angebote angezeigt wird.
              </p>

              <div name="positionieren">
                <br />
              </div>
              <h4>
                In Karte positionieren{' '}
                <Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
                  <Icon name="arrow-circle-up" />
                </Link>
              </h4>
              <p>
                Um die angebotenen Ehrenamtsstellen an einer bestimmten Stelle des Stadtgebietes zu
                erkunden, geben Sie den Anfang eines Stadtteils (Stadtbezirk oder Quartier), einer
                Adresse, eines Straßennamens oder eines interessanten Ortes (auch Point of Interest
                oder kurz POI genannt) im Eingabefeld ein (mindestens 2 Zeichen). In der
                inkrementellen Auswahlliste werden Ihnen passende Treffer angeboten. (Wenn sie
                weitere Zeichen eingeben, wird der Inhalt der Auswahlliste angepasst.) Durch das
                vorangestellte Symbol erkennen Sie, ob es sich dabei um einen <Icon name="circle" />{' '}
                Stadtbezirk, ein <Icon name="pie-chart" /> Quartier, eine <Icon name="home" />{' '}
                Adresse, eine <Icon name="road" /> Straße ohne zugeordnete Hausnummern, einen{' '}
                <Icon name="tag" /> POI, die <Icon name="tags" /> alternative Bezeichnung eines POI
                oder eine <Icon name="graduation-cap" /> Schule handelt.
              </p>
              <p>
                Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die zugehörige
                Position zentriert. Bei Suchbegriffen mit Punktgeometrie (Adresse, Straße, POI) wird
                außerdem ein großer Maßstab (Zoomstufe 14) eingestellt und ein Marker{' '}
                <img alt="Cluster" src="images/AdressMarker.jpg" /> auf der Zielposition platziert.
                Bei Suchbegriffen mit Flächengeometrie (Stadtbezirk, Quartier) wird der Maßstab so
                eingestellt, dass die Fläche vollständig dargestellt werden kann. Zusätzlich wird
                der Bereich außerhalb dieser Fläche abgedunkelt (Spotlight-Effekt).
              </p>
              <p>
                Durch Anklicken des Werkzeugs <Icon name="times" /> links neben dem Eingabefeld
                können Sie die Suche zurücksetzen (Entfernung von Marker bzw. Abdunklung, Löschen
                des Textes im Eingabefeld).
              </p>

              <div name="MeinStandort">
                <br />
              </div>
              <h4>
                Mein Standort{' '}
                <Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
                  <Icon name="arrow-circle-up" />
                </Link>
              </h4>
              <p>
                Mit der Funktion "<em>Mein Standort</em>" <Icon name="map-marker" /> können Sie
                ihren aktuellen Standort mit einem blauen Kreissymbol{' '}
                <img alt="Cluster" src="images/MeinStandpunktMarker.jpg" /> in der Karte anzeigen.
                Das Standortsymbol ist umgeben von einem zweiten Kreis mit transparenter, blauer
                Füllung, dessen Radius die Unsicherheit der Positionsbestimmung angibt{' '}
                <img alt="Cluster" src="images/MeinStandpunktMarkerDoppel.jpg" />. Die Richtigkeit
                der Positionsanzeige ist dabei nicht garantiert, ihre Genauigkeit hängt davon ab,
                mit welcher Methode Ihr Endgerät und der von Ihnen verwendete Browser die Position
                bestimmen. Smartphones und Tablet-PC's sind i. d. R. mit einer GPS-Antenne
                ausgestattet, so dass Sie bei diesen Geräten eine Positionsgenauigkeit in der
                Größenordnung von 10 Metern erwarten können. Die Markierung Ihrer Position wird
                laufend automatisch aktualisiert. Ein weiterer Klick auf "<em>Mein Standort</em>"
                schaltet die Anzeige Ihrer Position wieder ab.
              </p>

              <div name="selektieren">
                <br />
              </div>
              <h4>
                Angebote selektieren{' '}
                <Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
                  <Icon name="arrow-circle-up" />
                </Link>
              </h4>
              <p>
                Bewegen Sie den Mauszeiger auf ein konkretes Angebot, um sich seine Bezeichnung
                anzeigen zu lassen. Ein Klick auf den farbigen Punkt setzt den Fokus auf dieses
                Angebot. Es wird dann blau hinterlegt und die zugehörigen Informationen
                (Angebotsnummer und Bezeichnung) werden in der Info-Box angezeigt. (Auf einem
                Tablet-PC wird der Fokus durch das erste Antippen des Angebots gesetzt, das zweite
                Antippen blendet die Bezeichnung ein.)
                <br />
                Wenn Sie den Fokus noch nicht aktiv auf ein bestimmtes Angebot im aktuellen
                Kartenausschnitt gesetzt haben, wird er automatisch auf das nördlichste Angebot
                gesetzt.
              </p>

              <div name="merken">
                <br />
              </div>
              <h4>
                Angebote merken{' '}
                <Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
                  <Icon name="arrow-circle-up" />
                </Link>
              </h4>
              <p>
                Mit dem Werkzeug <Icon name="plus-square" /> in der Info-Box rechts neben der
                Bezeichnung können Sie das Angebot, das gerade den Fokus hat, in Ihre Merkliste
                aufnehmen. Es wird dann in der Karte durch einen überlagerten Stern gekennzeichnet.
                <br />
                Auch die Zusammenfassungen werden mit einem überlagerten Stern gekennzeichnet, wenn
                sie mindestens ein Angebot umfassen, das Sie in Ihre Merkliste aufgenommen haben.
                <br />
                Wenn Sie den Fokus auf ein Angebot setzen, das sich bereits in Ihrer Merkliste
                befindet, verwandelt sind das Werkzeug <Icon name="plus-square" /> in{' '}
                <Icon name="check-square" />. Mit einem Klick hierauf entfernen Sie das Angebot aus
                Ihrer Merkliste.
              </p>

              <div name="Merkliste">
                <br />
              </div>
              <h4>
                Merkliste öffnen{' '}
                <Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
                  <Icon name="arrow-circle-up" />
                </Link>
              </h4>
              <p>
                Mit dem Werkzeug <Icon name="bookmark" /> in der Info-Box rechts neben der
                Angebotsnummer können Sie Ihre Merkliste öffnen. Es wird hellgrau ausgeprägt, wenn
                Ihre Merkliste leer ist und dunkelgrau, sobald sich mindestens ein Angebot in Ihrer
                Merkliste befindet. Alternativ erreichen Sie Ihre Merkliste auch durch Öffnen des
                Anwendungsmenüs mit dem Werkzeug <Icon name="bars" /> in der rechten oberen Ecke.
                <br />
                In Ihrer Merkliste finden Sie eine Auflistung aller Angebote, die Sie in die
                Merkliste eingestellt haben. Der Inhalt Ihrer Merkliste bleibt auch nach einem
                Neustart der Anwendung erhalten. (Es sei denn, Sie löschen den Browser-Verlauf
                einschließlich der gehosteten App-Daten.){' '}
              </p>

              <div name="FunktionenMerkliste">
                <br />
              </div>
              <h4>
                Funktionen der Merkliste{' '}
                <Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
                  <Icon name="arrow-circle-up" />
                </Link>
              </h4>
              <p>Rechts neben jedem Listeneintrag in der Merkliste finden Sie zwei Werkzeuge:</p>
              <ul>
                <li>
                  Mit <Icon name="map-marker" /> können Sie das zugehörige Angebot in der Karte
                  anzeigen. Es wird dann zentriert in einem großen Maßstab (Zoomstufe 13)
                  dargestellt, zusätzlich wird der Fokus auf dieses Angebot gesetzt. Wenn das
                  Angebot Bestandteil einer Zusammenfassung ist, wird dazu die Explosionsgraphik
                  angezeigt.
                </li>

                <li>
                  Mit{' '}
                  <font color="#C33D17">
                    <Icon name="minus-square" />
                  </font>{' '}
                  können Sie das zugehörige Angebot aus Ihrer Merkliste entfernen.
                </li>
              </ul>
              <p>
                In der rechten oberen Ecke Ihrer Merkliste finden Sie drei Werkzeuge, die sich auf
                den gesamten Inhalt der Merkliste auswirken:
              </p>
              <ul>
                <li>
                  Mit <Icon name="trash" /> können Sie Ihre Merkliste komplett löschen.
                </li>

                <li>
                  Mit <Icon name="map" /> aktivieren Sie einen Modus, in dem Ihnen in der Karte nur
                  die Angebote aus Ihrer Merkliste angezeigt werden. Dieser Modus wird Ihnen durch
                  ein rotes Banner <img alt="Merkliste" src="images/merkliste_akt.jpg" /> oben in
                  der Info-Box signalisiert. Dort können Sie den Merklistenfilter durch Klicken auf{' '}
                  <Icon name="times" /> auch wieder ausschalten.
                </li>

                <li>
                  Im Menü <Icon name="share-square" /> finden Sie Möglichkeiten, den Inhalt der
                  Merkliste mit anderen zu teilen.
                  <ul>
                    <li>
                      Zentrale Funktion ist dabei <Icon name="copy" /> Link kopieren: hiermit
                      kopieren sie einen Link in die Zwischenablage, der die Ehrenamtskarte mit dem
                      Inhalt Ihrer Merkliste öffnet. Der Inhalt Ihrer Merkliste wird als Liste über
                      den Parameter "cart" übergeben. Wenn ein Nutzer, der bereits eigene Angebote
                      in seiner Merkliste hat, diesen Link anklickt, werden die übergebenen Angebote
                      an seine Merkliste angehängt.
                    </li>
                    <li>
                      Mit <Icon name="at" /> Merkliste per Mail senden schicken Sie diesen Link zur
                      Vereinbarung eines Beratungstermins per E-Mail an das Zentrum für Gute Taten.
                    </li>
                    <li>
                      (Weitere Möglichkeiten zum Teilen Ihrer Merkliste sind in Vorbereitung.)
                    </li>
                  </ul>
                </li>
              </ul>

              <div name="filtern">
                <br />
              </div>
              <h4>
                Angebote filtern{' '}
                <Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
                  <Icon name="arrow-circle-up" />
                </Link>
              </h4>
              <p>
                Über das Anwendungsmenü <Icon name="bars" /> in der rechten oberen Ecke können Sie
                Filter einstellen, um die in der Karte angezeigten Angebote an Ihre Interessen
                anzupassen. Dazu werden Ihnen in der Auswahlliste "<em>Ich suche nach</em>" alle
                Kategorisierungen in den Bereichen <em>Aufgaben</em> und <em>Zielgruppen</em> zur
                Auswahl angeboten. Es werden alle Angebote gefunden, die vom Zentrum für Gute Taten
                mit mindestens einem der von Ihnen ausgewählten Begriffe kategorisiert worden sind
                (logisches "oder"). Die Treffermenge steigt dadurch bei mehreren Suchbegriffen
                schnell an.
              </p>
              <p>
                Als Gegengewicht dazu können Sie in der Liste "<em>Ich schließe aus</em>" auch
                Ausschlusskriterien definieren.
              </p>
              <p>
                Eine alternative Eingabemöglichkeit für Ihre Such- und Ausschlussbedingungen bieten
                Ihnen die zwei Leitfragen unterhalb der Auswahllisten. Durch Klicken auf die
                jeweilige Frage erhalten Sie eine Übersicht über alle zugehörigen Kategorien und
                können diese mit <Icon name="thumbs-up" /> oder <Icon name="thumbs-down" /> als
                Such- oder Ausschlussbegriffe markieren. Die Filter-Auswahllisten und Einstellungen
                unter den Leitfragen sind vollständig miteinander synchronisiert. Wenn Sie
                Filtereinstellungen festgelegt haben, wird Ihnen dies durch ein graues Banner{' '}
                <img alt="Filter-Banner" src="images/filter_akt.jpg" /> oben in der Info-Box
                signalisiert. Die in Klammern angezeigte Zahl ist die Anzahl der aktuell von Ihnen
                zur Filterung verwendeten Such- und Ausschlussbegriffe.
              </p>
              <p>
                Über das Banner können Sie die Filterung durch Klicken auf <Icon name="times" />{' '}
                wieder zurücksetzen.
              </p>
            </Panel>
          </Accordion>
        </Modal.Body>

        <Modal.Footer>
          <table
            style={{
              width: '100%',
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    textAlign: 'left',
                    verticalAlign: 'top',
                    paddingRight: '30px',
                  }}
                >
                  <GenericRVRStadtplanwerkMenuFooter />
                </td>
                <td>
                  <Button bsStyle="primary" type="submit" onClick={this.close}>
                    Ok
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Footer>
      </Modal>
    );
  }
}
const EhrenamtModalApplicationMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(EhrenamtModalApplicationMenu_);
export default EhrenamtModalApplicationMenu;
EhrenamtModalApplicationMenu_.propTypes = {
  uiActions: PropTypes.object,
  uiState: PropTypes.object,
  ehrenamtState: PropTypes.object,
};
