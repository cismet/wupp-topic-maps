import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Modal, Button, Accordion, Panel  } from 'react-bootstrap';
import { actions as UiStateActions } from '../redux/modules/uiState';
import {Icon} from 'react-fa'

function mapStateToProps(state) {
  return {
    uiState: state.uiState
  };
}
function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(UiStateActions, dispatch),
  };
}

export class EhrenamtModalApplicationMenu_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.close = this.close.bind(this);
  }

  close() {
    this.props.uiActions.showHelpComponent(false);
  }
  render() {
    let modalBodyStyle= {
      "overflowY":"auto",
      "maxHeight":this.props.uiState.height-200
    }

    let zgCB=[]
    for (let zg of this.props.zielgruppen) {
      let cb=(
        <div key={"zielgruppenfilter.div."+zg}>
          <input key={"zielgruppenfilter.input."+zg} onChange={ ()=>this.props.zielgruppenFilterChanged(zg)} type="checkbox" name={zg} checked={this.props.filter.zielgruppen.indexOf(zg)>-1} value={zg} /> &nbsp; {zg}
        </div>
      );
      zgCB.push(cb);
    }



    return (
      <Modal style={{zIndex: 3000000000}} bsSize="large" show={this.props.uiState.helpTextVisible} onHide={this.close} keyboard={false} >
        <Modal.Header  >
          <Modal.Title><Icon name="info"/>&nbsp;&nbsp;&nbsp;Kompaktanleitung und Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>

 				Bitte w&auml;hlen Sie eine der folgenden farbigen Schaltfl&auml;chen, um sich weitere Informationen zu dem entsprechenden Thema anzeigen zu lassen:<br /><br />

			<Accordion >
			    <Panel header="Hintergrundkarte" eventKey="1" bsStyle="warning">
			    						   Die standardm&auml;&szlig;ig eingestellte Hintergrundkarte gibt eine &Uuml;bersicht &uuml;ber die Wuppertaler Bebauungspl&auml;ne (B-Pl&auml;ne).<br />
											   Gr&uuml;ne Fl&auml;chen (&Uuml;bersichtsma&szlig;stab) bzw. Umringe stehen f&uuml;r rechtswirksame B-Plan-Verfahren, rote Fl&auml;chen / Umringe f&uuml;r laufende Verfahren.
					</Panel>
			    <Panel header="Filtern" eventKey="2" bsStyle="success">
                <form>
                  {zgCB}
                </form>

					</Panel>

			    <Panel header="Treffermengen durchmustern" eventKey="6" bsStyle="info">
					              Der beste Treffer einer Suche erh&auml;lt den Fokus (blaue Umrandung). In der Info-Box werden Ihnen immer die Detailinformationen und Downloadlinks f&uuml;r denjenigen B-Plan angeboten, der gerade den Fokus hat. Mit einem einfachen Klick auf eine andere B-Plan-Fl&auml;che aus der Treffermenge (nicht auf die B-Plan-Nummer!) erh&auml;lt dieser Plan den Fokus.<br/>
					              Mit einem weiteren Klick wird der Kartenausschnitt so angepasst, dass dieser Plan vollst&auml;ndig und zentriert dargestellt wird. Alternativ k&ouml;nnen Sie die Treffermenge mit den Schaltfl&auml;chen &gt;&gt; (n&auml;chster Treffer) und &lt;&lt; (vorheriger Treffer) durchmustern. (Die Treffermenge ist geordnet nach zunehmendem Abstand des Plans vom Bezugspunkt ihrer Suche.)<br />Mit <strong>alle Treffer anzeigen</strong> k&ouml;nnen Sie den Kartenausschnitt zuvor so anpassen, dass alle Pl&auml;ne der Treffermenge vollst&auml;ndig angezeigt werden.
					</Panel>
			    <Panel header="Angebote merken und herunterladen" eventKey="7" bsStyle="info">
			                  Zum Download einer PDF-Datei des Plans, der gerade den Fokus hat, klicken Sie auf den Link <strong>Plan</strong>.<br />
			                  Umfasst der B-Plan mehrere Planteile, werden diese als mehrseitiges PDF-Dokument (multi-page PDF) bereitgestellt. (Der Link lautet dann <strong>Pl&auml;ne</strong>.)<br />
			                  Wenn zu einem B-Plan-Verfahren weitere verfahrensbegleitende Dokumente verf&uuml;gbar sind, wird zus&auml;tzlich der Link <strong>alles</strong> zum Download eines zip-Archivs mit allen Planteilen und allen verfahrensbegleitenden Dokumenten angeboten.<br />
			                  Ob die heruntergeladene Datei nach dem Download sofort mit einem geeigneten Programm (PDF-Viewer oder Dateimanager) ge&ouml;ffnet wird, h&auml;ngt von Ihren Betriebssystem- und/oder Browsereinstellungen ab.
					</Panel>
			  </Accordion>

        </Modal.Body>

        <Modal.Footer>
					<table style={{ width: '100%' }}>
						<tr>
							<td style={{ textAlign: 'left', verticalAlign: 'top',paddingRight: "30px"  }}>
								<span style={{ fontSize:"11px" }}><b>Hintergrundkarte</b>: in Detailma&szlig;st&auml;ben <a>Amtliche Basiskarte (ABK) der Stadt Wuppertal</a>,
								in &Uuml;bersichtsma&szlig;st&auml;ben <a>WebAtlasDE &copy; GeoBasis-DE / BKG 2017</a>, jeweils &uuml;berlagert mit Geltungsbereichen
								der Wuppertaler Bebauungspl&auml;ne.</span>
							</td>
							<td>
							  <Button bsStyle="primary" type="submit" onClick={this.close}>Ok</Button>
							</td>
						</tr>
					</table>
        </Modal.Footer>

      </Modal>
    );
  }
}



const EhrenamtModalApplicationMenu = connect(mapStateToProps, mapDispatchToProps)(EhrenamtModalApplicationMenu_);
export default EhrenamtModalApplicationMenu;

EhrenamtModalApplicationMenu_.propTypes = {
  uiActions: PropTypes.object,
  uiState: PropTypes.object
};
