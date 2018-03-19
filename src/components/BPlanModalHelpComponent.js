import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import {Modal, Button, Accordion, Panel} from 'react-bootstrap';
import {actions as UiStateActions} from '../redux/modules/uiState';
import {Icon} from 'react-fa'

function mapStateToProps(state) {
    return {uiState: state.uiState};
}
function mapDispatchToProps(dispatch) {
    return {
        uiActions: bindActionCreators(UiStateActions, dispatch)
    };
}

export class BPlanModalHelp_ extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.close = this
            .close
            .bind(this);
    }

    close() {
        this
            .props
            .uiActions
            .showApplicationMenu(false);
    }
    render() {
        let modalBodyStyle = {
            "overflowY": "auto",
            "maxHeight": this.props.uiState.height - 200
        }

        return (
            <Modal
                style={{
                zIndex: 3000000000
            }}
                bsSize="large"
                show={this.props.uiState.applicationMenuVisible}
                onHide={this.close}
                keyboard={false}>
                <Modal.Header >
                    <Modal.Title><Icon name="info"/>&nbsp;&nbsp;&nbsp;Kompaktanleitung B-Plan-Auskunft Wuppertal</Modal.Title>
                </Modal.Header>
                <Modal.Body style={modalBodyStyle}>

                    Bitte w&auml;hlen Sie eine der folgenden farbigen Schaltfl&auml;chen, um sich
                    weitere Informationen zu dem entsprechenden Thema anzeigen zu lassen:<br/><br/>

                    <Accordion>
                        <Panel header="Hintergrundkarte" eventKey="1" bsStyle="warning">
                            Die standardm&auml;&szlig;ig eingestellte Hintergrundkarte gibt eine
                            &Uuml;bersicht &uuml;ber die Wuppertaler Bebauungspl&auml;ne (B-Pl&auml;ne).<br/>
                            Gr&uuml;ne Fl&auml;chen (&Uuml;bersichtsma&szlig;stab) bzw. Umringe stehen
                            f&uuml;r rechtswirksame B-Plan-Verfahren, rote Fl&auml;chen / Umringe f&uuml;r
                            laufende Verfahren.
                        </Panel>
                        <Panel header="B-Pl&auml;ne suchen" eventKey="2" bsStyle="success">
                            F&uuml;r Detailinformation und Download m&uuml;ssen Sie zun&auml;chst nach
                            B-Pl&auml;nen suchen. Die Treffer werden automatisch geladen und in der Karte
                            als transparente farbige Fl&auml;chen mit der B-Plan-Nummer in jeder
                            Teilfl&auml;che dargestellt (Geltungsbereiche der B-Pl&auml;ne).<br/>
                            Gr&uuml;ne Fl&auml;chen/Nummern stehen f&uuml;r rechtswirksame Verfahren, rote
                            Fl&auml;chen/Nummern f&uuml;r laufende. Eine gr&uuml;ne Fl&auml;che mit roter
                            Nummer bedeutet, dass es unter dieser Nummer ein rechtswirksames und ein
                            laufendes Verfahren gibt, die genau dasselbe Gebiet abdecken.
                        </Panel>
                        <Panel header="Suche im Kartenausschnitt" eventKey="3" bsStyle="success">
                            Durch Anklicken von&nbsp;<Icon name="search"/>&nbsp;suchen Sie nach
                                B-Pl&auml;nen, die zumindest teilweise im aktuellen Kartenausschnitt liegen.<br/>
                            Den Kartenausschnitt k&ouml;nnen Sie durch Ziehen mit der Maus verschieben. Mit
                            den Werkzeugen&nbsp;<Icon name="plus"/>&nbsp;und&nbsp;<Icon name="minus"/>&nbsp;k&ouml;nnen
                                Sie den Kartenma&szlig;stab vergr&ouml;&szlig;ern bzw. verkleinern.<br/>
                            Mit einem Doppelklick auf einen B-Plan in der Hintergrundkarte werden alle
                            B-Pl&auml;ne geladen, die an dieser Stelle liegen - meistens genau einer,
                            manchmal auch mehrere Pl&auml;ne. Ein Doppelklick auf die Hintergrundkarte <b>au&szlig;erhalb</b> der
                            angezeigten B-Pl&auml;ne entfernt alle zuvor geladenen B-Pl&auml;ne (Zur&uuml;cksetzen der
                            Suche).
                        </Panel>
                        <Panel header="Suche &uuml;ber B-Plan-Nummer" eventKey="4" bsStyle="success">
                            Um ein B-Plan-Verfahren direkt anzusteuern, geben Sie den Anfang der
                            B-Plan-Nummer im Eingabefeld rechts neben&nbsp;<Icon name="search"/>&nbsp;ein
                                (mindestens 2 Ziffern). Alle Verfahren, die mit diesen Ziffern beginnen, werden
                                Ihnen in einer inkrementellen Auswahlliste angeboten. (Wenn Sie weitere Zeichen
                                eingeben, wird der Inhalt der Auswahlliste angepasst.)<br/>
                            Nach Auswahl eines B-Plan-Verfahrens aus dieser Liste wird ausschlie&szlig;lich
                            der zugeh&ouml;rige Plan geladen. Er wird vollst&auml;ndig und zentriert
                            dargestellt. Das ist vor allem n&uuml;tzlich, um sich einen &Uuml;berblick
                            &uuml;ber Pl&auml;ne mit einem komplizierten Geltungsbereich zu verschaffen.
                            (Probieren Sie mal die Nummer 150.)<br/>
                            Klicken Sie auf&nbsp;<Icon name="search"/>&nbsp;, um alle Pl&auml;ne
                                hinzuzuladen, die im jetzt aktuellen Ausschnitt liegen. Damit stellen Sie auch
                                sicher, dass Sie keinen Plan &uuml;bersehen, der sich mit dem zuvor gesuchten
                                &uuml;berlappt.
                        </Panel>
                        <Panel header="Suche &uuml;ber Adresse oder POI" eventKey="5" bsStyle="success">
                            Um die B-Plan-Situation an einem bestimmten Punkt des Stadtgebietes zu erkunden,
                            geben Sie den Anfang einer Stra&szlig;ennamens oder eines interessanten Ortes
                            (auch Point of Interest oder kurz POI genannt) im Eingabefeld ein (mindestens 2
                            Zeichen). In der inkrementellen Auswahlliste werden Ihnen passende Treffer
                            angeboten. (Wenn sie weitere Zeichen eingeben, wird der Inhalt der Auswahlliste
                            angepasst.)<br/>
                            Durch das vorangestellte Symbol erkennen Sie, ob es sich dabei um eine&nbsp;
                            <Icon name="home"/>&nbsp;Adresse, eine&nbsp;<Icon name="road"/>&nbsp;Stra&szlig;e ohne zugeordnete Hausnummern, 
                            einen&nbsp;<Icon name="tag"/>&nbsp;POI oder die&nbsp;<Icon name="tags"/>&nbsp;alternative
                                Bezeichnung eines POI handelt. (Probieren Sie es mal mit der Eingabe
                                &bdquo;Sankt&ldquo;.)<br/>
                            Nach der Auswahl eines Eintrags wird die entsprechende Position in der Karte
                            markiert. B-Plan-Verfahren werden hier allerdings in der Umgebung dieses Punktes
                            gesucht, in einem Kartenausschnitt der Zoomstufe 14. Sie erhalten daher in der
                            Regel mehrere Treffer.
                        </Panel>
                        <Panel header="Treffermengen durchmustern" eventKey="6" bsStyle="info">
                            Der beste Treffer einer Suche erh&auml;lt den Fokus (blaue Umrandung). In der
                            Info-Box werden Ihnen immer die Detailinformationen und Downloadlinks f&uuml;r
                            denjenigen B-Plan angeboten, der gerade den Fokus hat. Mit einem einfachen Klick
                            auf eine andere B-Plan-Fl&auml;che aus der Treffermenge (nicht auf die
                            B-Plan-Nummer!) erh&auml;lt dieser Plan den Fokus.<br/>
                            Mit einem weiteren Klick wird der Kartenausschnitt so angepasst, dass dieser
                            Plan vollst&auml;ndig und zentriert dargestellt wird. Alternativ k&ouml;nnen Sie
                            die Treffermenge mit den Schaltfl&auml;chen <a>&gt;&gt;</a> (n&auml;chster Treffer) und
                            &nbsp;<a>&lt;&lt;</a> (vorheriger Treffer) durchmustern. (Die Treffermenge ist geordnet nach
                            zunehmendem Abstand des Plans vom Bezugspunkt ihrer Suche.)<br/>Mit&nbsp;
                            <a>alle Treffer anzeigen</a>&nbsp;
                            k&ouml;nnen Sie den Kartenausschnitt zuvor so anpassen, dass alle Pl&auml;ne der
                            Treffermenge vollst&auml;ndig angezeigt werden.
                        </Panel>
                        <Panel header="B-Pl&auml;ne herunterladen" eventKey="7" bsStyle="info">
                            Zum Download einer PDF-Datei des Plans, der gerade den Fokus hat, klicken Sie
                            auf den Link&nbsp;
                            <a>Plan</a>.<br/>
                            Umfasst der B-Plan mehrere Planteile, werden diese als mehrseitiges PDF-Dokument
                            (multi-page PDF) bereitgestellt. (Der Link lautet dann&nbsp;
                            <a>Pl&auml;ne</a>.)<br/>
                            Wenn zu einem B-Plan-Verfahren weitere verfahrensbegleitende Dokumente
                            verf&uuml;gbar sind, wird zus&auml;tzlich der Link&nbsp;
                            <a>alles</a>&nbsp;zum Download eines zip-Archivs mit allen Planteilen und allen
                            verfahrensbegleitenden Dokumenten angeboten.<br/>
                            Ob die heruntergeladene Datei nach dem Download sofort mit einem geeigneten
                            Programm (PDF-Viewer oder Dateimanager) ge&ouml;ffnet wird, h&auml;ngt von Ihren
                            Betriebssystem- und/oder Browsereinstellungen ab.
                        </Panel>
                    </Accordion>

                </Modal.Body>

                <Modal.Footer>
                    <table style={{
                        width: '100%'
                    }}><tbody>
                        <tr>
                            <td
                                style={{
                                textAlign: 'left',
                                verticalAlign: 'top',
                                paddingRight: "30px"
                            }}>
                                <span
                                    style={{
                                    fontSize: "11px"
                                }}>
                                    <b>Hintergrundkarte</b>: in Detailma&szlig;st&auml;ben&nbsp;
                                    <a>Amtliche Basiskarte (ABK) der Stadt Wuppertal</a>, in &Uuml;bersichtsma&szlig;st&auml;ben&nbsp;
                                    <a>WebAtlasDE &copy; GeoBasis-DE / BKG 2017</a>, jeweils &uuml;berlagert mit
                                    Geltungsbereichen der Wuppertaler Bebauungspl&auml;ne.<br/>
                                    <b>Technische Realisierung</b>: <a href="https://cismet.de/" target="_cismet">cismet GmbH</a> auf Basis von <a  href="http://leafletjs.com/" target="_leaflet">Leaflet</a> und <a href="https://cismet.de/#refs" target="_cismet">cids | WuNDa</a><br/>
                                    </span>
                            </td>
                            <td>
                                <Button bsStyle="primary" type="submit" onClick={this.close}>Ok</Button>
                            </td>
                        </tr>
                        </tbody></table>
                </Modal.Footer>

            </Modal>
        );
    }
}

const BPlanModalHelp = connect(mapStateToProps, mapDispatchToProps)(BPlanModalHelp_);
export default BPlanModalHelp;

BPlanModalHelp_.propTypes = {
    uiActions: PropTypes.object,
    uiState: PropTypes.object
};
