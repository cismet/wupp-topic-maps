import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Accordion, Panel } from 'react-bootstrap';
import { actions as UiStateActions } from '../redux/modules/uiState';
import { Icon } from 'react-fa';
import CismetFooterAcks from './commons/CismetFooterAcknowledgements';
import { INFO_DOC_DATEINAMEN_URL } from '../constants/bplaene';
function mapStateToProps(state) {
	return { uiState: state.uiState };
}
function mapDispatchToProps(dispatch) {
	return {
		uiActions: bindActionCreators(UiStateActions, dispatch)
	};
}

export class BPlanModalHelp_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.close = this.close.bind(this);
	}

	close() {
		this.props.uiActions.showApplicationMenu(false);
	}
	render() {
		let modalBodyStyle = {
			overflowY: 'auto',
			maxHeight: this.props.uiState.height - 200
		};

		return (
			<Modal
				style={{
					zIndex: 3000000000
				}}
				bsSize="large"
				show={this.props.uiState.applicationMenuVisible}
				onHide={this.close}
				keyboard={false}
			>
				<Modal.Header>
					<Modal.Title>
						<Icon name="info" />
						&nbsp;&nbsp;&nbsp;Kompaktanleitung B-Plan-Auskunft Wuppertal
					</Modal.Title>
				</Modal.Header>
				<Modal.Body style={modalBodyStyle}>
					Bitte w&auml;hlen Sie eine der folgenden farbigen Schaltfl&auml;chen, um sich weitere Informationen
					zu dem entsprechenden Thema anzeigen zu lassen:
					<br />
					<br />
					<Accordion>
						<Panel header="Hintergrundkarte" eventKey="1" bsStyle="warning">
							Die standardm&auml;&szlig;ig eingestellte Hintergrundkarte gibt eine &Uuml;bersicht
							&uuml;ber die Wuppertaler Bebauungspl&auml;ne (B-Pl&auml;ne).
							<br />
							Gr&uuml;ne Fl&auml;chen (&Uuml;bersichtsma&szlig;stab) bzw. Umringe stehen f&uuml;r
							rechtswirksame B-Plan-Verfahren, rote Fl&auml;chen / Umringe f&uuml;r laufende Verfahren.
						</Panel>
						<Panel header="Mein Standort" eventKey="1a" bsStyle="warning">
							<p>
								Mit der Funktion "<em>Mein Standort</em>" <Icon name="map-marker" /> können Sie ihren
								aktuellen Standort mit einem blauen Kreissymbol{' '}
								<img alt="Cluster" src="images/MeinStandpunktMarker.jpg" /> in der Karte anzeigen. Das
								Standortsymbol ist umgeben von einem zweiten Kreis mit transparenter, blauer Füllung,
								dessen Radius die Unsicherheit der Positionsbestimmung angibt{' '}
								<img alt="Cluster" src="images/MeinStandpunktMarkerDoppel.jpg" />. Die Richtigkeit der
								Positionsanzeige ist dabei nicht garantiert, ihre Genauigkeit hängt davon ab, mit
								welcher Methode Ihr Endgerät und der von Ihnen verwendete Browser die Position
								bestimmen. Smartphones und Tablet-PC's sind i. d. R. mit einer GPS-Antenne ausgestattet,
								so dass Sie bei diesen Geräten eine Positionsgenauigkeit in der Größenordnung von 10
								Metern erwarten können. Die Markierung Ihrer Position wird laufend automatisch
								aktualisiert. Ein weiterer Klick auf "<em>Mein Standort</em>" schaltet die Anzeige Ihrer
								Position wieder ab.
							</p>
						</Panel>

						<Panel header="B-Pl&auml;ne suchen" eventKey="2" bsStyle="success">
							F&uuml;r Detailinformation, Dokumentbetrachtung und Download m&uuml;ssen Sie zun&auml;chst
							nach B-Pl&auml;nen suchen. Die Treffer werden automatisch geladen und in der Karte als
							transparente farbige Fl&auml;chen mit der B-Plan-Nummer in jeder Teilfl&auml;che dargestellt
							(Geltungsbereiche der B-Pl&auml;ne).
							<br />
							Gr&uuml;ne Fl&auml;chen/Nummern stehen f&uuml;r rechtswirksame Verfahren, rote
							Fl&auml;chen/Nummern f&uuml;r laufende. Eine gr&uuml;ne Fl&auml;che mit roter Nummer
							bedeutet, dass es unter dieser Nummer ein rechtswirksames und ein laufendes Verfahren gibt,
							die genau dasselbe Gebiet abdecken.
						</Panel>
						<Panel header="Suche im Kartenausschnitt" eventKey="3" bsStyle="success">
							Durch Anklicken von&nbsp;
							<Icon name="search" />
							&nbsp;suchen Sie nach B-Pl&auml;nen, die zumindest teilweise im aktuellen Kartenausschnitt
							liegen.
							<br />
							Den Kartenausschnitt k&ouml;nnen Sie durch Ziehen mit der Maus verschieben. Mit den
							Werkzeugen&nbsp;
							<Icon name="plus" />
							&nbsp;und&nbsp;
							<Icon name="minus" />
							&nbsp;k&ouml;nnen Sie den Kartenma&szlig;stab vergr&ouml;&szlig;ern bzw. verkleinern.
							<br />
							Mit einem Doppelklick auf einen B-Plan in der Hintergrundkarte werden alle B-Pl&auml;ne
							geladen, die an dieser Stelle liegen - meistens genau einer, manchmal auch mehrere
							Pl&auml;ne. Ein Doppelklick auf die Hintergrundkarte <b>au&szlig;erhalb</b> der angezeigten
							B-Pl&auml;ne entfernt alle zuvor geladenen B-Pl&auml;ne (Zur&uuml;cksetzen der Suche).
						</Panel>
						<Panel header="Suche &uuml;ber B-Plan-Nummer" eventKey="4" bsStyle="success">
							Um ein B-Plan-Verfahren direkt anzusteuern, geben Sie den Anfang der B-Plan-Nummer im
							Eingabefeld rechts neben&nbsp;
							<Icon name="search" />
							&nbsp;ein (mindestens 2 Ziffern). Alle Verfahren, die mit diesen Ziffern beginnen, werden
							Ihnen in einer inkrementellen Auswahlliste angeboten. (Wenn Sie weitere Zeichen eingeben,
							wird der Inhalt der Auswahlliste angepasst.)
							<br />
							Nach Auswahl eines B-Plan-Verfahrens aus dieser Liste wird ausschlie&szlig;lich der
							zugeh&ouml;rige Plan geladen. Er wird vollst&auml;ndig und zentriert dargestellt. Das ist
							vor allem n&uuml;tzlich, um sich einen &Uuml;berblick &uuml;ber Pl&auml;ne mit einem
							komplizierten Geltungsbereich zu verschaffen. (Probieren Sie mal die Nummer 150.)
							<br />
							Klicken Sie auf&nbsp;
							<Icon name="search" />&nbsp;, um alle Pl&auml;ne hinzuzuladen, die im jetzt aktuellen
							Ausschnitt liegen. Damit stellen Sie auch sicher, dass Sie keinen Plan &uuml;bersehen, der
							sich mit dem zuvor gesuchten &uuml;berlappt.
						</Panel>
						<Panel header="Suche &uuml;ber Adresse oder POI" eventKey="5" bsStyle="success">
							Um die B-Plan-Situation an einem bestimmten Punkt des Stadtgebietes zu erkunden, geben Sie
							den Anfang eines Stra&szlig;ennamens oder eines interessanten Ortes (auch Point of Interest
							oder kurz POI genannt) im Eingabefeld ein (mindestens 2 Zeichen). In der inkrementellen
							Auswahlliste werden Ihnen passende Treffer angeboten. (Wenn sie weitere Zeichen eingeben,
							wird der Inhalt der Auswahlliste angepasst.)
							<br />
							Durch das vorangestellte Symbol erkennen Sie, ob es sich dabei um eine&nbsp;
							<Icon name="home" />
							&nbsp;Adresse, eine&nbsp;
							<Icon name="road" />
							&nbsp;Stra&szlig;e ohne zugeordnete Hausnummern, einen&nbsp;
							<Icon name="tag" />
							&nbsp;POI oder die&nbsp;
							<Icon name="tags" />
							&nbsp;alternative Bezeichnung eines POI handelt. (Probieren Sie es mal mit der Eingabe
							&bdquo;Sankt&ldquo;.)
							<br />
							Nach der Auswahl eines Eintrags wird die entsprechende Position in der Karte markiert.
							B-Plan-Verfahren werden hier allerdings in der Umgebung dieses Punktes gesucht, in einem
							Kartenausschnitt der Zoomstufe 14. Sie erhalten daher in der Regel mehrere Treffer.
						</Panel>
						<Panel header="Treffermengen durchmustern" eventKey="6" bsStyle="info">
							Der beste Treffer einer Suche erhält den Fokus (blaue Umrandung). In der Info-Box werden
							Ihnen immer die Detailinformationen und die Verknüpfung zur Dokumentbetrachtung für
							denjenigen B-Plan angeboten, der gerade den Fokus hat. Mit einem einfachen Klick auf eine
							andere B-Plan-Fläche aus der Treffermenge erhält der zugehörige B-Plan den Fokus. Mit einem
							weiteren Klick auf diese Fläche wird der Kartenausschnitt so angepasst, dass der zugehörige
							B-Plan vollständig und zentriert dargestellt wird.
							<br />
							Mit einem weiteren Klick wird der Kartenausschnitt so angepasst, dass dieser Plan
							vollst&auml;ndig und zentriert dargestellt wird. Alternativ k&ouml;nnen Sie die Treffermenge
							mit den Schaltfl&auml;chen <a>&gt;&gt;</a> (n&auml;chster Treffer) und &nbsp;
							<a>&lt;&lt;</a> (vorheriger Treffer) durchmustern. (Die Treffermenge ist geordnet nach
							zunehmendem Abstand des Plans vom Bezugspunkt ihrer Suche.)
							<br />
							Mit&nbsp;
							<a>alle Treffer anzeigen</a>
							&nbsp; k&ouml;nnen Sie den Kartenausschnitt zuvor so anpassen, dass alle Pl&auml;ne der
							Treffermenge vollst&auml;ndig angezeigt werden.
						</Panel>
						<Panel header="B-Plan-Dokumente betrachten" eventKey="7" bsStyle="info">
							<p>
								Durch Anklicken des Links "Dokumente" in der Info-Box oder des PDF-Symbols direkt
								darüber wird in einer neuen Registerkarte Ihres Browsers ein Dokumentenviewer geöffnet,
								in dem die Dokumente zu demjenigen B-Plan betrachtet werden können, der gerade den Fokus
								hat. Wenn zu dem B-Plan mehrere Dokumente verfügbar sind, werden diese in einer
								Navigationsleiste am linken Rand des Dokumentenviewers angeboten. Klicken Sie auf eines
								der Symbole in der Navigationsleiste, um das zugehörige Dokument in den Anzeigebereich
								des Dokumentenviewers zu laden. Mit den Werkzeugen <Icon name="chevron-left" />{' '}
								<i>"vorherige Seite"</i> und <Icon name="chevron-right" /> <i>"nächste Seite"</i> in der
								Werkzeugleiste am oberen Rand des Dokumentenviewers können Sie in mehrseitigen
								Dokumenten vor- und zurückblättern.
							</p>
							<p>
								Mehrere Dokumente werden angezeigt, wenn der B-Plan mehrere Planteile umfasst oder wenn
								die verfahrensbegleitenden Zusatzdokumente bereits in digitaler Form vorliegen. Die
								Bereitstellung dieser Dokumente ist ein laufendes Vorhaben der Stadtverwaltung
								Wuppertal, Stand 03/2019 sind sie für rund 60% der Wuppertaler B-Pläne verfügbar. Die
								Namenskonventionen für die vielfältigen Zusatzdateien sind im Dokument{' '}
								<a href="INFO_DOC_DATEINAMEN_URL" target="_info">
									Info Dateinamen
								</a>{' '}
								beschrieben, das in der Navigationsleiste als oberstes Zusatzdokument angeboten wird.
							</p>
							<p>
								Im Anzeigebereich können Sie das Dokument durch Ziehen mit der Maus verschieben. Mit den
								Werkzeugen <Icon name="plus" /> und <Icon name="minus" /> können Sie die Darstellung
								vergrößern bzw. verkleinern. Darüber hinaus finden Sie in der Werkzeugleiste mit{' '}
								<Icon name="arrows-h" /> <i>"an Fensterbreite anpassen"</i> und{' '}
								<span style={{ whiteSpace: 'nowrap' }}>
									<Icon name="arrows-v" /> <i>"an Fensterhöhe anpassen"</i>
								</span>{' '}
								zwei Möglichkeiten zur schnellen Optimierung der Dokumentdarstellung. Wenn Sie für
								weitere B-Pläne aus dem Kartenfenster zur Dokumentbetrachtung wechseln, wird eine ggf.
								bereits zuvor für den Dokumentenviewer geöffnete Registerkarte Ihres Browsers
								angesteuert.
							</p>
						</Panel>
						<Panel header="B-Pläne herunterladen" eventKey="8" bsStyle="info">
							<p>
								Das Herunterladen der Dokumente zu einem B-Plan-Verfahren erfolgt aus dem
								Dokumentenviewer. Dazu finden Sie in der Werkzeugleiste zwei Möglichkeiten. Mit dem
								immer verfügbaren Werkzeug <Icon name="download" />{' '}
								<i>"Dokument herunterladen (pdf)"</i>
								können Sie das aktuell im Anzeigebereich dargestellte Dokument als PDF-Datei
								herunterladen. Das zweite Werkzeug<Icon name="file-archive-o" />{' '}
								<i>"alles herunterladen (zip)"</i>dient zum Download eines zip-Archivs mit allen
								Planteilen und verfahrensbegleitenden Zusatzdokumenten einschließlich des Info-Dokuments
								zu den Namenskonventionen für die Zusatzdokumente. Es lässt sich nur aktivieren, wenn zu
								dem aktuell betrachteten B-Plan mehrere Dokumente verfügbar sind.
							</p>
							<p>
								Unten rechts im Anzeigebereich finden Sie stets den Dateinamen, unter dem das gerade
								dargestellte Dokument heruntergeladen wird. Diese Dateinamen sind etwas länger als die
								in der Navigationsleiste verwendeten Bezeichnungen, wo die für alle Dokumente eines
								B-Plans gleichen Namensbestandteile ausgeblendet werden.
							</p>
							<p>
								Ob eine heruntergeladene Datei nach dem Download sofort mit einem geeigneten Programm
								(PDF-Viewer oder Dateimanager) geöffnet wird, hängt von Ihren Betriebssystem- und/oder
								Browsereinstellungen ab.
							</p>
						</Panel>
					</Accordion>
				</Modal.Body>

				<Modal.Footer>
					<table
						style={{
							width: '100%'
						}}
					>
						<tbody>
							<tr>
								<td
									style={{
										textAlign: 'left',
										verticalAlign: 'top',
										paddingRight: '30px'
									}}
								>
									<span
										style={{
											fontSize: '11px'
										}}
									>
										<b>Hintergrundkarte</b>: in Detailma&szlig;st&auml;ben&nbsp;
										<a>Amtliche Basiskarte (ABK) der Stadt Wuppertal</a>, in
										&Uuml;bersichtsma&szlig;st&auml;ben&nbsp;
										<a>WebAtlasDE &copy; GeoBasis-DE / BKG 2017</a>, jeweils &uuml;berlagert mit
										Geltungsbereichen der Wuppertaler Bebauungspl&auml;ne.
										<br />
										<CismetFooterAcks />
									</span>
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

const BPlanModalHelp = connect(mapStateToProps, mapDispatchToProps)(BPlanModalHelp_);
export default BPlanModalHelp;

BPlanModalHelp_.propTypes = {
	uiActions: PropTypes.object,
	uiState: PropTypes.object
};
