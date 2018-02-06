import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import {
    Modal,
    Button,
    Accordion,
    Panel,
    Grid,
    Row,
    Col,
    Well,
    ButtonGroup, ButtonToolbar
} from 'react-bootstrap';
import {actions as UiStateActions} from '../redux/modules/uiState';
import {constants as ehrenamtConstants, actions as EhrenamtActions} from '../redux/modules/ehrenamt';

import {Icon} from 'react-fa'
import Switch from 'react-bootstrap-switch';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';


import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import MultiToggleButton from './MultiToggleButton';


function mapStateToProps(state) {
    return {
        uiState: state.uiState,
        ehrenamtState: state.ehrenamt
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiActions: bindActionCreators(UiStateActions, dispatch),
        ehrenamtActions: bindActionCreators(EhrenamtActions, dispatch)
    };
}

export class EhrenamtModalApplicationMenu_ extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.close = this.close.bind(this);
        this.handlePosOnChange=this.handlePosOnChange.bind(this);
        this.handleNegOnChange=this.handleNegOnChange.bind(this);
        
       

       
            
    }

    close() {
        this
            .props
            .uiActions
            .showApplicationMenu(false);
    }

    handleSwitch(elem, state) {
        this
            .props
            .ehrenamtActions
            .toggleIgnoredFilterGroup(elem.props.name);
    }

    selectAll(fg) {
        this
            .props
            .ehrenamtActions
            .selectAll(fg);
    }
    selectNone(fg) {
        this
            .props
            .ehrenamtActions
            .selectNone(fg);

    }
    invertSelection(fg) {
        this
            .props
            .ehrenamtActions
            .invertSelection(fg);
    }
    handlePosOnChange(tags) {
        let newState={pos:tags,neg:this.state.neg};
        this.setState(newState);
        let positiv={
            globalbereiche: [],
            kenntnisse: [],
            zielgruppen: []
        };
        for (let tag of tags){
            positiv[tag.cat].push(tag.value);
        }
        let filterX= {
            filtermode: ehrenamtConstants.OR_FILTER,
            positiv,
            negativ: JSON.parse(JSON.stringify(this.props.ehrenamtState.filterX.negativ))
        };
        this.props.ehrenamtActions.setFilterAndApply(filterX);
    }



      handleNegOnChange(tags) {
          let newState={neg:tags,pos:this.state.pos};
        this.setState(newState);
        let negativ={
            globalbereiche: [],
            kenntnisse: [],
            zielgruppen: []
        };
        for (let tag of tags){
            negativ[tag.cat].push(tag.value);
        }
        let filterX= {
            filtermode: ehrenamtConstants.OR_FILTER,
            negativ,
            positiv: JSON.parse(JSON.stringify(this.props.ehrenamtState.filterX.positiv))
        };
        this.props.ehrenamtActions.setFilterAndApply(filterX);   
   
    }

    
    render() {
        let pos=[];
        let neg=[];
        
        for (let cat in this.props.ehrenamtState.filterX.positiv){
             for (let val of this.props.ehrenamtState.filterX.positiv[cat]){
                pos.push({
                     label:val,
                     value:val,
                     cat
                 });
             }
         }
         for (let cat in this.props.ehrenamtState.filterX.negativ){
            for (let val of this.props.ehrenamtState.filterX.negativ[cat]){
                neg.push({
                    label:val,
                    value:val,
                    cat
                });
            }
        }
        this.state = {pos,neg};

        let modalBodyStyle = {
            "overflowY": "auto",
            "overflowX": "hidden",
            "maxHeight": this.props.uiState.height - 200
        }

        

        let zgOptions=[];
        let ktOptions=[];
        let berOptions=[];

        for (let zg of this.props.zielgruppen){
            zgOptions.push({
                label:  zg,
                cat:"zielgruppen",
                value: zg
            });
        }

        for (let k of this.props.kenntnisse){
            ktOptions.push({
                label:  k,
                cat:"kenntnisse",
                value: k
            });        
        }

        for (let b of this.props.globalbereiche) {
            berOptions.push({
                label:  b,
                cat: "globalbereiche",
                value: b
            });        
        }

        let options=[{
            label:"Aufgabenfeld",
            cat:"group",
            options: berOptions
            
        },{
            label:"Tätigkeit",
            cat:"group",
            options: ktOptions
        },
            {
            label:"Zielgruppen",
            cat:"group",
            options: zgOptions
        },];

        let zgRows=[]

        for (let zg of this.props.zielgruppen) {             
            let buttonValue="two"; // neutral state

            if (this.props.filterX.positiv.zielgruppen.indexOf(zg)!==-1) {
                buttonValue="one";
            }
            else if (this.props.filterX.negativ.zielgruppen.indexOf(zg)!==-1){
                buttonValue="three";
            }



            let cb = (
                <tr>
                    <td
                        style={{
                        textAlign: 'left',
                        verticalAlign: 'top',
                        padding: '5px',
                        
                    }}>
                        {zg}
                    </td>
                    <td
                        style={{
                        textAlign: 'left',
                        verticalAlign: 'top',
                        padding: '5px'
                    }}>
                        <MultiToggleButton value={buttonValue} valueChanged={(selectedValue)=>{
                            if (selectedValue==="one") {
                                this.props.ehrenamtActions.toggleFilter("positiv","zielgruppen",zg)
                            }
                            else if (selectedValue==="three") {
                                this.props.ehrenamtActions.toggleFilter("negativ","zielgruppen",zg)
                            }
                            else {
                                //deselect existing selection
                                if (buttonValue==="one") {
                                    this.props.ehrenamtActions.toggleFilter("positiv","zielgruppen",zg)
                                }
                                else if (buttonValue==="three") {
                                    this.props.ehrenamtActions.toggleFilter("negativ","zielgruppen",zg)
                                }
                            }
                        }}/>
                    </td>
                </tr>
            ); 
            zgRows.push(cb);
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
                keyboard={false}>

                <Modal.Header >
                    <Modal.Title><Icon name="info"/>&nbsp;&nbsp;&nbsp;Kompaktanleitung und Filter</Modal.Title>
                </Modal.Header >
                <Modal.Body style={modalBodyStyle}>
                    <span>
                        Bitte w&auml;hlen Sie eine der folgenden farbigen Schaltfl&auml;chen, um sich
                        weitere Informationen zu dem entsprechenden Thema anzeigen zu lassen:<br/><br/>
                    </span>
                    <Accordion key={"Filter.ACC"}activeKey="filtertab">
                        <Panel height="auto" header={"Filtern ("+this.props.filteredOffersCount+" gefunden, davon "+this.props.featureCollectionCount+" in der Karte)"} eventKey="filtertab" bsStyle="primary">
                    <h4>Neigungen</h4>
                            <Select
                                id={"pos"}
                                key={"Filtercombo.pos."+JSON.stringify(this.props.filterX.positiv)}
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
                                valueRenderer={(option)=>{
                                    return (
                                        <div style={{}}>{option.label}</div>
                                    )
                                }}
                                optionRenderer={(option)=>{
                                    if (option.cat!=="group") {
                                        return <div style={{}}>{option.label}</div>
                                    }
                                    else {
                                        return <div>{option.label}</div>
                                    }
                                    
                                }}

            				/>  
                        <h4>Abneigungen</h4>
                        <Select
                                id={"neg"}
                                key={"Filtercombo.neg."+JSON.stringify(this.props.filterX.negativ)}
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
                                valueRenderer={(option)=>{
                                    return (
                                        <div>{option.label}</div>
                                    )
                                }}
                                optionRenderer={(option)=>{
                                    if (option.cat!=="group") {
                                        return <div >{option.label}</div>
                                    }
                                    else {
                                        return <div>{option.label}</div>
                                    }
                                    
                                }}
                                menuStyle={{height:"400px"}}

            				/>  
                        </Panel>
                        </Accordion>        
                    <Accordion key={"ACC"}activeKey={this.props.uiState.applicationMenuActiveKey}>
                    <Panel header="Welches Aufgabenfeld interessiert Sie?" eventKey="bereiche_adv_filter" bsStyle="warning">
                    Die standardm&auml;&szlig;ig eingestellte Hintergrundkarte gibt eine
                    &Uuml;bersicht &uuml;ber die Wuppertaler Bebauungspl&auml;ne (B-Pl&auml;ne).<br/>
                    Gr&uuml;ne Fl&auml;chen (&Uuml;bersichtsma&szlig;stab) bzw. Umringe stehen
                    f&uuml;r rechtswirksame B-Plan-Verfahren, rote Fl&auml;chen / Umringe f&uuml;r
                    laufende Verfahren.
                    </Panel>
                    <Panel header="Was wollen Sie beitragen?" eventKey="kenntnisse_adv_filter" bsStyle="info">
                    Die standardm&auml;&szlig;ig eingestellte Hintergrundkarte gibt eine
                    &Uuml;bersicht &uuml;ber die Wuppertaler Bebauungspl&auml;ne (B-Pl&auml;ne).<br/>
                    Gr&uuml;ne Fl&auml;chen (&Uuml;bersichtsma&szlig;stab) bzw. Umringe stehen
                    f&uuml;r rechtswirksame B-Plan-Verfahren, rote Fl&auml;chen / Umringe f&uuml;r
                    laufende Verfahren.
                    </Panel>
                    <Panel header=" Wen wollen Sie unterstützen?" eventKey="zielgruppen_adv_filter" bsStyle="success">
                    <table border={0} styleX={{ width: '100%' }}>
                    <tbody>
                      {zgRows}
                    </tbody>
                    </table>
                    </Panel>
                    
                    
                <Panel header="Hintergrundkarte" eventKey="1" bsStyle="default">
                            Die standardm&auml;&szlig;ig eingestellte Hintergrundkarte gibt eine
                            &Uuml;bersicht &uuml;ber die Wuppertaler Bebauungspl&auml;ne (B-Pl&auml;ne).<br/>
                            Gr&uuml;ne Fl&auml;chen (&Uuml;bersichtsma&szlig;stab) bzw. Umringe stehen
                            f&uuml;r rechtswirksame B-Plan-Verfahren, rote Fl&auml;chen / Umringe f&uuml;r
                            laufende Verfahren.
                        </Panel>
                        <Panel header="Treffermengen durchmustern" eventKey="6" bsStyle="default">
                            Der beste Treffer einer Suche erh&auml;lt den Fokus (blaue Umrandung). In der
                            Info-Box werden Ihnen immer die Detailinformationen und Downloadlinks f&uuml;r
                            denjenigen B-Plan angeboten, der gerade den Fokus hat. Mit einem einfachen Klick
                            auf eine andere B-Plan-Fl&auml;che aus der Treffermenge (nicht auf die
                            B-Plan-Nummer!) erh&auml;lt dieser Plan den Fokus.<br/>
                            Mit einem weiteren Klick wird der Kartenausschnitt so angepasst, dass dieser
                            Plan vollst&auml;ndig und zentriert dargestellt wird. Alternativ k&ouml;nnen Sie
                            die Treffermenge mit den Schaltfl&auml;chen &gt;&gt; (n&auml;chster Treffer) und
                            &lt;&lt; (vorheriger Treffer) durchmustern. (Die Treffermenge ist geordnet nach
                            zunehmendem Abstand des Plans vom Bezugspunkt ihrer Suche.)<br/>Mit
                            <strong>alle Treffer anzeigen</strong>
                            k&ouml;nnen Sie den Kartenausschnitt zuvor so anpassen, dass alle Pl&auml;ne der
                            Treffermenge vollst&auml;ndig angezeigt werden.
                        </Panel>
                        <Panel header="Angebote merken und herunterladen" eventKey="7" bsStyle="default">
                            Zum Download einer PDF-Datei des Plans, der gerade den Fokus hat, klicken Sie
                            auf den Link
                            <strong>Plan</strong>.<br/>
                            Umfasst der B-Plan mehrere Planteile, werden diese als mehrseitiges PDF-Dokument
                            (multi-page PDF) bereitgestellt. (Der Link lautet dann
                            <strong>Pl&auml;ne</strong>.)<br/>
                            Wenn zu einem B-Plan-Verfahren weitere verfahrensbegleitende Dokumente
                            verf&uuml;gbar sind, wird zus&auml;tzlich der Link
                            <strong>alles</strong>
                            zum Download eines zip-Archivs mit allen Planteilen und allen
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
                    }}>
                    <tbody>
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
                                    <a>Amtliche Basiskarte (ABK) der Stadt Wuppertal</a>, jeweils &uuml;berlagert mit
                                    dem Wuppertaler Orthofoto.<br/>
                                    <b>Angebotsdaten</b>: {this.props.offersMD5}</span>
                                    
                            </td>
                            <td>
                                <Button bsStyle="primary" type="submit" onClick={this.close}>Ok</Button>
                            </td>
                        </tr>
                        </tbody>
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
    uiState: PropTypes.object,
    ehrenamtState: PropTypes.object
}