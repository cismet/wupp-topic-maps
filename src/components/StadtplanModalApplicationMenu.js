import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import {
    Modal,
    Button,
    Accordion,
    Panel,
    FormGroup, Checkbox, Radio, ControlLabel,
    Label
} from 'react-bootstrap';
import {actions as UiStateActions} from '../redux/modules/uiState';

import {getColorFromLebenslagenCombination} from '../utils/stadtplanHelper';

import {Icon} from 'react-fa'
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import queryString from 'query-string';

import MultiToggleButton from './MultiToggleButton';

import { Link } from 'react-scroll';

import ReactChartkick, { PieChart } from 'react-chartkick'
import Chart from 'chart.js'

import {removeQueryPart, modifyQueryPart} from '../utils/routingHelper'
import {routerActions} from 'react-router-redux'



ReactChartkick.addAdapter(Chart);

function mapStateToProps(state) {
    return {
        uiState: state.uiState,
        routing: state.routing,

    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiActions: bindActionCreators(UiStateActions, dispatch),        
        routingActions: bindActionCreators(routerActions, dispatch)
    };
}

export class StadtplanModalApplicationMenu_ extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.close = this.close.bind(this);
    }

    close() {
        this
            .props
            .uiActions
            .showApplicationMenu(false);
    }


    createOverviewRows() {
        let rows=[];
        for (let item of this.props.lebenslagen) {             
            let buttonValue="two"; // neutral state

            if (this.props.filter.positiv.indexOf(item)!==-1) {
                buttonValue="one";
            }
            else if (this.props.filter.negativ.indexOf(item)!==-1){
                buttonValue="three";
            }
            let cb = (
                <tr key={"tr.for.mtbutton.lebenslagen."+item}>
                    <td key={"td1.for.mtbutton.lebenslagen."+item}
                        style={{
                        textAlign: 'left',
                        verticalAlign: 'top',
                        padding: '5px',
                        
                    }}>
                        {item}
                    </td>
                    <td key={"td2.for.mtbutton.lebenslagen."+item}
                        style={{
                        textAlign: 'left',
                        verticalAlign: 'top',
                        padding: '5px'
                    }}>
                        <MultiToggleButton key={"mtbutton.lebenslagen."+item} value={buttonValue} valueChanged={(selectedValue)=>{
                            if (selectedValue==="one") {
                                this.props.stadtplanActions.toggleFilter("positiv",item)
                            }
                            else if (selectedValue==="three") {
                                this.props.stadtplanActions.toggleFilter("negativ",item)
                            }
                            else {
                                //deselect existing selection
                                if (buttonValue==="one") {
                                    this.props.stadtplanActions.toggleFilter("positiv",item)
                                }
                                else if (buttonValue==="three") {
                                    this.props.stadtplanActions.toggleFilter("negativ",item)
                                }
                            }
                        }}/>
                    </td>
                </tr>
            ); 
            rows.push(cb);
        }
        return rows;
    }
    
    render() {

        let modalBodyStyle = {
            "overflowY": "auto",
            "overflowX": "hidden",
            "maxHeight": this.props.uiState.height - 200
        }

        let clusteredPOIs=queryString.parse(this.props.routing.location.search).unclustered!==null;
        let customTitle=queryString.parse(this.props.routing.location.search).title;
        let titleDisplay=customTitle!==undefined;
        let namedMapStyle=queryString.parse(this.props.routing.location.search).mapStyle||"default";
        
        let llOptions=[];
     

        for (let ll of this.props.lebenslagen){
            llOptions.push({
                label:  ll,
                cat: "lebenslage",
                value: ll
            }); 
        }

        let overviewRows=this.createOverviewRows();        

        
        let stats={};
        let colormodel={};
        for (let poi of this.props.filteredPois){
            if (stats[poi.mainlocationtype.lebenslagen.join(", ")]===undefined) {
                const key=poi.mainlocationtype.lebenslagen.join(", ");
                stats[key]=1;
                colormodel[key]=getColorFromLebenslagenCombination(key);
            }
            else {
                stats[poi.mainlocationtype.lebenslagen.join(", ")]=stats[poi.mainlocationtype.lebenslagen.join(", ")]+1;
            }   
        }

        //console.log(JSON.stringify(colormodel, null, 2));
        let piechartData=[];
        let piechartColor=[];

        for (let key in stats){
            piechartData.push([key,stats[key]]);
            piechartColor.push(getColorFromLebenslagenCombination(key));

        }

        let width=this.props.uiState.width;

        let widePieChartPlaceholder=null;
        let narrowPieChartPlaceholder=null;
        let widePreviewPlaceholder=null;
        let narrowPreviewPlaceholder=null;



        let pieChart=(
             <PieChart  data={piechartData} donut={true} title="Verteilung" legend={false} colors={piechartColor}/>
        );


        let poiPreviewName="poi.preview.unclustered.png";
        if (clusteredPOIs){
            poiPreviewName="poi.preview.clustered.png";
        }

        let titlePreview=null;
        if (titleDisplay){
        titlePreview=(       
                <div style={{align:"center", width:"100%"}}>
                        <div style={{height:'10px'}}/>
                        <table style={{ 
                            // width: this.props.uiState.width-54-12-38-12+'px', 
                            width: '96%',
                            height: '30px',
                            margin: '0 auto',
                            //position: 'absolute',
                            // left: 54,
                            top: 12,
                            // zIndex: 999655
                            }}>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle',background: "#ffffff", color: "black", opacity:'0.9', paddingleft: '10px', }}>
                                    <b>Mein Themenstadtplan: </b> Religion ohne Erholung
                                </td>                              
                            </tr>
                        </tbody>
                    </table>   
                    </div> 
            );
        }

        let preview= (
            <div>
           <FormGroup>
                <ControlLabel>Vorschau:</ControlLabel><br/>
                <div style={
                    {
                        backgroundImage: "url('/images/"+poiPreviewName+"')"+
                                        ",url('/images/map.preview."+namedMapStyle+".png')" ,
                        width: "100%",
                        height:"250px",
                        backgroundPosition: "center",
                    }}>
                    {titlePreview}
                    </div>
            </FormGroup>
                </div>
        );

        if (width<995)  {
            narrowPieChartPlaceholder=(
                <div>
                    <br/>
                    {pieChart}
                </div>    
            );
            narrowPreviewPlaceholder=(
                <div>
                    <br/>
                    {preview}
                </div>    
            );

        }
        else {
            widePieChartPlaceholder=(
                <td>
                {pieChart}
                 </td>  
            );
            widePreviewPlaceholder=(
                <td>
                {preview}
                 </td>  
            );
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
                    <Modal.Title><Icon name="bars"/>&nbsp;&nbsp;&nbsp;Mein Themenstadtplan, Einstellungen und Kompaktanleitung</Modal.Title>
                </Modal.Header >
                <Modal.Body style={modalBodyStyle} id="myMenu" key={this.props.uiState.applicationMenuActiveKey}>
                    <span>

                        Verwandeln Sie die den Wuppertaler Online-Stadtplan in Ihren persönlichen Themenstadtplan. 
                        <br/>
                        W&auml;hlen Sie dazu unter <Link
                            to="filter" 
                            containerId="myMenu" 
                            smooth={true} 
                            delay={100} 
                            onClick={()=>this.props.uiActions.setApplicationMenuActiveKey("filter")}>
                        Mein Themenstadtplan</Link> die Themenfelder
                        aus, zu denen Sie die Points Of Interest (POI) anzeigen oder ausblenden möchten.
                        Über <Link
                                to="settings" 
                                containerId="myMenu" 
                                smooth={true} 
                                delay={100} 
                                onClick={()=>this.props.uiActions.setApplicationMenuActiveKey("settings")}>                                               
                        Einstellungen</Link> können Sie die Karten- und POI-Darstellung an Ihre Vorlieben anpassen. 
                        W&auml;hlen Sie <Link
                                 to="help" 
                                 containerId="myMenu" 
                                 smooth={true} 
                                 delay={100} 
                                 onClick={()=>this.props.uiActions.setApplicationMenuActiveKey("help")}>                                                                      
                        Kompaktanleitung</Link> für detailliertere Bedienungsinformationen.
                    </span>
                    <br/>
                    <br/>
                    
                    <Accordion key={"filter"} defaultActiveKey={this.props.uiState.applicationMenuActiveKey||"filter"} onSelect={()=>{
                        if (this.props.uiState.applicationMenuActiveKey==="filter"){
                            this.props.uiActions.setApplicationMenuActiveKey("none")
                        }else {
                            this.props.uiActions.setApplicationMenuActiveKey("filter")
                        }
                    }}> 
                    <Panel header={"Mein Themenstadtplan ("+this.props.filteredPois.length+" POI gefunden, davon "+this.props.featureCollectionCount+" in der Karte)"} eventKey="filter" bsStyle="primary">
                        <div align="center">
                        <Button style={{margin:4,marginLeft:0}} bsSize="small" onClick={()=>{
                                this.props.stadtplanActions.clearFilter("negativ");
                                this.props.stadtplanActions.setAllLebenslagenToFilter("positiv");
                            }} >alle Themen ausw&auml;hlen</Button>
                        <Button style={{margin:4}} bsSize="small" onClick={()=>{this.props.stadtplanActions.clearFilter("positiv");}} >keine Themen ausw&auml;hlen</Button>
                        <Button style={{margin:4}} bsSize="small" onClick={()=>{this.props.stadtplanActions.clearFilter("negativ");}} >keine Themen ausschlie&szlig;en</Button> 
                        </div>
                        <br/>
                        <table border={0} width="100%">
                        <tbody>
                            <tr>
                                <td align="center"> 
                                    <table border={0}>
                                        <tbody>
                                            {overviewRows}
                                        </tbody>
                                    </table>                    
                                </td>
                                {widePieChartPlaceholder}
                            </tr>
                        </tbody>
                        </table>                    
                        {narrowPieChartPlaceholder}
                    </Panel>
                   
                    </Accordion>
                   
                    <Accordion key={"settings"} defaultActiveKey={this.props.uiState.applicationMenuActiveKey} onSelect={()=>{
                        if (this.props.uiState.applicationMenuActiveKey==="settings"){
                            this.props.uiActions.setApplicationMenuActiveKey("none")
                        }else {
                            this.props.uiActions.setApplicationMenuActiveKey("settings")
                        }
                    }}>
                    <Panel header="Einstellungen" eventKey="settings" bsStyle="success">
                        <table border={0} width="100%">
                        <tbody>
                        <tr>
                                <td valign="top" style={{width:"330px"}}> 
                                    <FormGroup>
                                        <ControlLabel>POI-Einstellungen:</ControlLabel><br/>
                                        <Checkbox 
                                            readOnly={true}
                                            key={"title.checkbox"+titleDisplay}
                                            checked={titleDisplay} 
                                            onClick={(e)=>{
                                                if (e.target.checked===false) {
                                                    this.props.routingActions.push(this.props.routing.location.pathname 
                                                                    + removeQueryPart(this.props.routing.location.search, "title"));
                                                }
                                                else {
                                                    this.props.routingActions.push(this.props.routing.location.pathname 
                                                        + this.props.routing.location.search+"&title");
                                        
                                                }
                                            }}
                                            inline>Titel bei individueller Themenauswahl anzeigen</Checkbox><br/>
                                        <Checkbox 
                                            readOnly={true}
                                            key={"clustered.checkbox"+clusteredPOIs}
                                            onClick={(e)=>{
                                                if (e.target.checked===true) {
                                                    this.props.routingActions.push(this.props.routing.location.pathname 
                                                                    + removeQueryPart(this.props.routing.location.search, "unclustered"));
                                                }
                                                else {
                                                    this.props.routingActions.push(this.props.routing.location.pathname 
                                                        + this.props.routing.location.search+"&unclustered");
                                        
                                                }
                                                this.props.stadtplanActions.createFeatureCollectionFromPOIs();
                                            }}
                                            checked={clusteredPOIs}  
                                            inline>POI ma&szlig;stabsabh&auml;ngig zusammenfassen</Checkbox><br/>
                                        </FormGroup>
                                        <FormGroup>
                                        <br/>
                                        <ControlLabel>Kartendarstellung:</ControlLabel><br/>
                                        <Radio 
                                            readOnly={true}
                                            onClick={(e)=>{
                                                if (e.target.checked===true) {
                                                    this.props.routingActions.push(this.props.routing.location.pathname 
                                                                    + removeQueryPart(this.props.routing.location.search, "mapStyle"));
                                                }
                                            }}
                                            checked={namedMapStyle==='default'}
                                            name="mapBackground" inline>
                                            Tag
                                        </Radio>{' '}
                                        <Radio 
                                            readOnly={true}
                                            onClick={(e)=>{
                                                if (e.target.checked===true) {
                                                    this.props.routingActions.push(this.props.routing.location.pathname 
                                                        + modifyQueryPart(this.props.routing.location.search, {'mapStyle':'night'}));
                                                        

                                                }
                                            }}
                                            name="mapBackground" 
                                            checked={namedMapStyle==='night'}
                                            inline>
                                            Nacht
                                        </Radio>{' '}
                                    </FormGroup>                         
                                </td>
                                {widePreviewPlaceholder}
                            </tr>
  
                        </tbody>
                        </table>    
                        {narrowPreviewPlaceholder}                
                    </Panel>



                    </Accordion>
                    <Accordion name="help" key={"helptext"+this.props.uiState.applicationMenuActiveKey} defaultActiveKey={this.props.uiState.applicationMenuActiveKey} onSelect={()=>{
                        if (this.props.uiState.applicationMenuActiveKey==="help"){
                            this.props.uiActions.setApplicationMenuActiveKey("none")
                        }else {
                            this.props.uiActions.setApplicationMenuActiveKey("help")
                        }
                    }}>
                        <Panel header="Kompaktanleitung" eventKey="help" bsStyle="default">
                        
														<div>
														  <Link to="Datengrundlage" containerId="myMenu" style={{textDecoration: 'none'}}>     <Label bsStyle="default">Datengrundlage</Label>{' '}</Link>
														  <Link to="Kartendarstellung" containerId="myMenu" style={{textDecoration: 'none'}}>  <Label bsStyle="success">Kartendarstellung der Angebote</Label>{' '}</Link>
														  <Link to="positionieren" containerId="myMenu" style={{textDecoration: 'none'}}>      <Label bsStyle="success">In Karte positionieren</Label>{' '}</Link>
														  <Link to="selektieren" containerId="myMenu" style={{textDecoration: 'none'}}>        <Label bsStyle="info">Angebote selektieren</Label>{' '}</Link>
														  <Link to="merken" containerId="myMenu" style={{textDecoration: 'none'}}>             <Label bsStyle="info">Angebote merken</Label>{' '}</Link>
														  <Link to="Merkliste" containerId="myMenu" style={{textDecoration: 'none'}}>          <Label bsStyle="primary">Merkliste öffnen</Label>{' '}</Link>
														  <Link to="FunktionenMerkliste" containerId="myMenu" style={{textDecoration: 'none'}}><Label bsStyle="primary">Funktionen der Merkliste</Label>{' '}</Link>
														  <Link to="filtern" containerId="myMenu" style={{textDecoration: 'none'}}>            <Label bsStyle="warning">Angebote filtern</Label>{' '}</Link>
														</div>														

                            <div name="Datengrundlage"><br /></div>
                            <h4>Datengrundlage <Link to="help" containerId="myMenu" style={{ color: '#00000044'}}><Icon name="arrow-circle-up"/></Link></h4>
                             <p>Diese Anwendung gibt Ihnen einen Überblick über die angebotenen Ehrenamtsstellen aus der Datenbank des Zentrums für gute Taten. Die Darstellung der Einsatzorte als Karte macht es Ihnen dabei leicht, Ehrenamtsstellen in Ihrer Nähe zu finden. Einer Ehrenamtsstelle sind im Allgemeinfall mehrere <em>Aufgabenfelder</em>, <em>Tätigkeiten</em> und <em>Zielgruppen</em> zugeordnet.</p> 
														
														<div name="Kartendarstellung"><br /></div>
														<h4>Kartendarstellung der Angebote <Link to="help" containerId="myMenu" style={{ color: '#00000044'}}><Icon name="arrow-circle-up"/></Link></h4>
														 <p>Die in der Karte für die Punktdarstellungen der Angebote verwendeten Farben stehen jeweils für eine bestimmte Kombination der Kategorisierungen in den Bereichen <em>Aufgabenfelder</em>, <em>Tätigkeiten</em> und <em>Zielgruppen</em>.<br />
														 Eng beieinander liegende Angebote werden maßstabsabhängig zu größeren Punkten zusammengefasst, mit der Anzahl der repräsentierten Angebote im Zentrum <img alt="" src="images/colorcircle_k.jpg" />.<br />Vergrößern Sie ein paar Mal durch direktes Anklicken eines solchen Punktes oder mit <Icon name="plus"/> die Darstellung, so werden die zusammengefassten Angebote Schritt für Schritt in die kleineren Punktdarstellungen für die konkreten Einzelangebote zerlegt. Nur Angebote, die sich auf denselben Standort beziehen, werden in jedem Maßstab als Zusammenfassung dargestellt. In diesen Fällen führt ein weiterer Klick ab einer bestimmten Maßstabsstufe (Zoomstufe 12) dazu, dass eine Explosionsgrafik der zusammengefassten Angebote angezeigt wird.</p>
														
														<div name="positionieren"><br /></div>
														<h4>In Karte positionieren <Link to="help" containerId="myMenu" style={{ color: '#00000044'}}><Icon name="arrow-circle-up"/></Link></h4>
														 <p>Um die angebotenen Ehrenamtsstellen an einer bestimmten Stelle des Stadtgebietes zu erkunden, geben Sie den Anfang eines Stadtteils (Stadtbezirk oder Quartier), einer Adresse, eines Straßennamens oder eines interessanten Ortes (auch Point of Interest oder kurz POI genannt) im Eingabefeld ein (mindestens 2 Zeichen). In der inkrementellen Auswahlliste werden Ihnen passende Treffer angeboten. (Wenn sie weitere Zeichen eingeben, wird der Inhalt der Auswahlliste angepasst.) Durch das vorangestellte Symbol erkennen Sie, ob es sich dabei um einen <Icon name="circle"/> Stadtbezirk, ein <Icon name="pie-chart"/> Quartier, eine  <Icon name="home"/> Adresse, eine  <Icon name="road"/> Straße ohne zugeordnete Hausnummern, einen  <Icon name="tag"/> POI oder die  <Icon name="tags"/> alternative Bezeichnung eines POI handelt.</p>
														
														<div name="selektieren"><br /></div>
														<h4>Angebote selektieren <Link to="help" containerId="myMenu" style={{ color: '#00000044'}}><Icon name="arrow-circle-up"/></Link></h4>
														 <p>Bewegen Sie den Mauszeiger auf ein konkretes Angebot, um sich seine Bezeichnung anzeigen zu lassen. Ein Klick auf den farbigen Punkt setzt den Fokus auf dieses Angebot. Es wird dann blau hinterlegt und die zugehörigen Informationen (Angebotsnummer und Bezeichnung) werden in der Info-Box angezeigt. (Auf einem Tablet-PC wird der Fokus durch das erste Antippen des Angebots gesetzt, das zweite Antippen blendet die Bezeichnung ein.)<br />
														 Wenn Sie den Fokus noch nicht aktiv auf ein bestimmtes Angebot im aktuellen Kartenausschnitt gesetzt haben, wird er automatisch auf das nördlichste Angebot gesetzt.</p>
														
														<div name="merken"><br /></div>
														<h4>Angebote merken <Link to="help" containerId="myMenu" style={{ color: '#00000044'}}><Icon name="arrow-circle-up"/></Link></h4>
														 <p>Mit dem Werkzeug <Icon name="plus-square"/> in der Info-Box rechts neben der Bezeichnung können Sie das Angebot, das gerade den Fokus hat, in Ihre Merkliste aufnehmen. Es wird dann in der Karte durch einen überlagerten Stern gekennzeichnet.<br />
														 Auch die Zusammenfassungen werden mit einem überlagerten Stern gekennzeichnet, wenn sie mindestens ein Angebot umfassen, das Sie in Ihre Merkliste aufgenommen haben.<br />
														 Wenn Sie den Fokus auf ein Angebot setzen, das sich bereits in Ihrer Merkliste befindet, verwandelt sind das Werkzeug <Icon name="plus-square"/> in <Icon name="check-square"/>. Mit einem Klick hierauf entfernen Sie das Angebot aus Ihrer Merkliste.</p>
														
														<div name="Merkliste"><br /></div>
														<h4>Merkliste öffnen <Link to="help" containerId="myMenu" style={{ color: '#00000044'}}><Icon name="arrow-circle-up"/></Link></h4>
														 <p>Mit dem Werkzeug <Icon name="bookmark"/> in der Info-Box rechts neben der Angebotsnummer können Sie Ihre Merkliste öffnen. Es wird hellgrau ausgeprägt, wenn Ihre Merkliste leer ist und dunkelgrau, sobald sich mindestens ein Angebot in Ihrer Merkliste befindet. Alternativ erreichen Sie Ihre Merkliste auch durch Öffnen des Anwendungsmenüs mit dem Werkzeug <Icon name="bars"/> in der rechten oberen Ecke.<br />
														 In Ihrer Merkliste finden Sie eine Auflistung aller Angebote, die Sie in die Merkliste eingestellt haben. Der Inhalt Ihrer Merkliste bleibt auch nach einem Neustart der Anwendung erhalten. (Es sei denn, Sie löschen den Browser-Verlauf einschließlich der gehosteten App-Daten.) </p>
														
														<div name="FunktionenMerkliste"><br /></div>
														<h4>Funktionen der Merkliste <Link to="help" containerId="myMenu" style={{ color: '#00000044'}}><Icon name="arrow-circle-up"/></Link></h4>
														 <p>Rechts neben jedem Listeneintrag in der Merkliste finden Sie zwei Werkzeuge:</p>
														 <ul>
															 <li>Mit <Icon name="map-marker"/> können Sie das zugehörige Angebot in der Karte anzeigen. Es wird dann zentriert in einem großen Maßstab (Zoomstufe 13) dargestellt, zusätzlich wird der Fokus auf dieses Angebot gesetzt. Wenn das Angebot Bestandteil einer Zusammenfassung ist, wird dazu die Explosionsgraphik angezeigt.</li>
															 
															 <li>Mit <font color="#C33D17"><Icon name="minus-square"/></font> können Sie das zugehörige Angebot aus Ihrer Merkliste entfernen.</li>
															 
														 </ul>
														 <p>In der rechten oberen Ecke Ihrer Merkliste finden Sie drei Werkzeuge, die sich auf den gesamten Inhalt der Merkliste auswirken:</p>
														 <ul>
															 <li>Mit  <Icon name="trash"/> können Sie Ihre Merkliste komplett löschen.</li>
															 
															 <li>Mit <Icon name="map"/> aktivieren Sie einen Modus, in dem Ihnen in der Karte nur die Angebote aus Ihrer Merkliste angezeigt werden. Dieser Modus wird Ihnen durch ein rotes Banner <img alt="Merkliste" rc="images/merkliste_akt.jpg" /> oben in der Info-Box signalisiert. Dort können Sie den Merklistenfilter durch Klicken auf <Icon name="times"/> auch wieder ausschalten.</li>
															 
															 <li>Im Menü <Icon name="share-square"/> finden Sie Möglichkeiten, den Inhalt der Merkliste mit anderen zu teilen.
															 <ul>
															 <li>Zentrale Funktion ist dabei <Icon name="copy"/> Link kopieren: hiermit kopieren sie einen Link in die Zwischenablage, der das Infoportal Ehrenamt mit dem Inhalt Ihrer Merkliste öffnet. Der Inhalt Ihrer Merkliste wird als Liste über den Parameter „cart“ übergeben. Wenn ein Nutzer, der bereits eigene Angebote in seiner Merkliste hat, diesen Link anklickt, werden die übergebenen Angebote an seine Merkliste angehängt.</li>
															 <li>Mit <Icon name="at"/> Merkliste per Mail senden schicken Sie diesen Link zur Vereinbarung eines Beratungstermins per E-Mail an das Zentrum für Gute Taten.</li>
															 <li>(Weitere Möglichkeiten zum Teilen Ihrer Merkliste sind in Vorbereitung.)</li>
															 </ul>
															 </li>
														</ul>
														 														
														<div name="filtern"><br /></div>
														<h4>Angebote filtern <Link to="help" containerId="myMenu" style={{ color: '#00000044'}}><Icon name="arrow-circle-up"/></Link></h4>
														 <p>Über das Anwendungsmenü <Icon name="bars"/> in der rechten oberen Ecke können Sie Filter einstellen, um die in der Karte angezeigten Angebote an Ihre Interessen anzupassen. Dazu werden Ihnen in der Auswahlliste „<em>Ich suche nach</em>“ alle Kategorisierungen in den Bereichen <em>Aufgabenfelder</em>, <em>Tätigkeiten</em> und <em>Zielgruppen</em> zur Auswahl angeboten. Es werden alle Angebote gefunden, die vom Zentrum für Gute Taten mit mindestens einem der von Ihnen ausgewählten Begriffe kategorisiert worden sind (logisches „oder“). Die Treffermenge steigt dadurch bei mehreren Suchbegriffen schnell an.<br />
														 Als Gegengewicht dazu können Sie in der Liste „<em>Ich schließe aus</em>“ auch Ausschlusskriterien definieren.</p>
														 <p>Eine alternative Eingabemöglichkeit für Ihre Such- und Ausschlussbedingungen  bieten Ihnen die 3 Leitfragen unterhalb der Auswahllisten. Durch Klicken auf die jeweilige Frage erhalten Sie eine Übersicht über alle zugehörigen Kategorien und können diese mit <Icon name="thumbs-up"/> oder <Icon name="thumbs-down"/> als Such- oder Ausschlussbegriffe markieren. Die Filter-Auswahllisten und Einstellungen unter den Leitfragen sind vollständig miteinander synchronisiert. Wenn Sie Filtereinstellungen festgelegt haben, wird Ihnen dies durch ein graues Banner <img alt="Filter-Banner" src="images/filter_akt.jpg" /> oben in der Info-Box signalisiert. Die in Klammern angezeigte Zahl ist die Anzahl der aktuell von Ihnen zur Filterung verwendeten Such- und Ausschlussbegriffe.<br />
														 Über das Banner können Sie die Filterung durch Klicken auf <Icon name="times"/> wieder zurücksetzen.</p>
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
                                  <b>Hintergrundkarte</b>: <a>Stadtplanwerk 2.0 (Beta)</a>, <Icon name="copyright"/> Regionalverband Ruhr (RVR) und Kooperationspartner,
                                    Datengrundlagen <Icon name="copyright"/> OpenStreetMap contributors (<a href="http://www.opendatacommons.org/licenses/odbl/1.0/" target="_licensing">ODbL</a>) und <Icon name="copyright"/> Land NRW (2018) 
                                    , <a href="http://www.govdata.de/dl-de/by-2-0" target="_licensing">Datenlizenz Deutschland - Namensnennung - Version 2.0</a>.<br/>
                                    
                                    <b>Technische Realisierung</b>: <a href="https://cismet.de/" target="_cismet">cismet GmbH</a> auf Basis von <a  href="http://leafletjs.com/" target="_leaflet">Leaflet</a> und <a href="https://cismet.de/#refs" target="_cismet">cids | WuNDa</a>
                                    <br/>
                                    <a target="_blank" href="https://cismet.de/datenschutzerklaerung.html">Datenschutzerklärung (Privacy Policy)</a>, <a onClick={()=>{
                                        let json=prompt("Benutzerdefinierte Farbcodierung der POI (JSON-Format)","");
                                        try {
                                            JSON.parse(json);
                                            this.props.routingActions.push(this.props.routing.location.pathname 
                                                + modifyQueryPart(this.props.routing.location.search, {colorRules: json}));
     
                                        }
                                        catch (error) {
                                            console.error(error);
                                            this.props.routingActions.push(this.props.routing.location.pathname 
                                                + removeQueryPart(this.props.routing.location.search, "colorRules"));
                                            alert("konnte die Farbregeln nicht verarbeiten")
                                        }
                                        }}>Farbanpassung</a>
                                    {/* <b>POI-Daten</b>: {this.props.offersMD5} */}
                                </span>
                                    
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
const StadtplanModalApplicationMenu = connect(mapStateToProps, mapDispatchToProps)(StadtplanModalApplicationMenu_);
export default StadtplanModalApplicationMenu;
StadtplanModalApplicationMenu.propTypes = {
    uiActions: PropTypes.object,
    uiState: PropTypes.object,
    ehrenamtState: PropTypes.object,
    stadtplanActions: PropTypes.object
}