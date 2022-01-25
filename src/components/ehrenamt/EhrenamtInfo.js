import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Well, Tooltip } from 'react-bootstrap';
import Icon from 'components/commons/Icon';
import { constants as ehrenamtConstants } from '../../redux/modules/ehrenamt';

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const EhrenamtInfo = ({
  featureCollection,
  filteredOffers,
  selectedIndex,
  next,
  previous,
  fitAll,
  loadingIndicator,
  downloadPlan,
  downloadEverything,
  filter,
  resetFilter,
  showModalMenu,
  cart,
  toggleCartFromFeature,
  filterMode,
}) => {
  const currentFeature = featureCollection[selectedIndex];

  let logCurrentFeature = function () {
    //console.log(JSON.stringify(currentFeature));
  };

  let angebotOrAngebote = 'Angebote werden';
  if (featureCollection.length === 1) {
    angebotOrAngebote = 'Angebot wird';
  }
  let filterstatus = <div />;

  let positiv =
    filter.positiv.globalbereiche.length +
    filter.positiv.kenntnisse.length +
    filter.positiv.zielgruppen.length;

  let negativ =
    filter.negativ.globalbereiche.length +
    filter.negativ.kenntnisse.length +
    filter.negativ.zielgruppen.length;

  let modalMenuTarget = 'filtertab';
  let filterText = 'Filter aktiviert (' + (positiv + negativ) + ')';
  let filterColor = 'grey';
  let bookmarksTooltip = 'Filterliste öffnen';
  if (filterMode === ehrenamtConstants.CART_FILTER) {
    modalMenuTarget = 'cart';
    filterText = 'Merklistenfilter aktiviert';
    filterColor = '#A5695A';
    bookmarksTooltip = 'Merkliste öffnen';
  }

  if (positiv + negativ > 0 || filterMode === ehrenamtConstants.CART_FILTER) {
    filterstatus = (
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td
              style={{
                textAlign: 'left',
                verticalAlign: 'top',
                background: filterColor,
                opacity: '0.9',
                padding: '3px',
              }}
            >
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip style={{ zIndex: 3000000000 }} id="bookmarkstt">
                    {bookmarksTooltip}
                  </Tooltip>
                }
              >
                <a onClick={() => showModalMenu(modalMenuTarget)} style={{ color: 'black' }}>
                  <Icon name="filter" />
                  &nbsp;
                  {filterText}
                </a>
              </OverlayTrigger>
            </td>
            <td
              style={{
                textAlign: 'right',
                verticalAlign: 'top',
                background: filterColor,
                opacity: '0.9',
                padding: '3px',
              }}
            >
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip style={{ zIndex: 3000000000 }} id="bookmarkstt">
                    Filter deaktivieren
                  </Tooltip>
                }
              >
                <a onClick={resetFilter} style={{ color: 'black' }}>
                  <Icon name="close" />
                </a>
              </OverlayTrigger>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (featureCollection.length === 0) {
    let offerLink;
    if (filteredOffers.length > 0) {
      offerLink = (
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                <a onClick={fitAll}>{filteredOffers.length} Angebote in Wuppertal</a>
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      offerLink = <div />;
    }

    if (positiv + negativ === 0) {
      return (
        <Well bsSize="small" pixelwidth={250}>
          {filterstatus}
          <h5>Keine Angebote gefunden!</h5>
          <p>
            Für mehr Angebote, Ansicht mit <Icon name="minus-square" /> verkleinern. Um nach
            Aufgaben oder Zielgruppen zu filtern, das
            <a onClick={() => showModalMenu('filtertab')}>
              {' '}
              Men&uuml;&nbsp;
              <Icon name="bars" style={{ color: 'black' }} /> &ouml;ffnen.
            </a>
          </p>
          {offerLink}
        </Well>
      );
    } else {
      return (
        <Well bsSize="small" pixelwidth={250}>
          {filterstatus}
          <h5>Keine Angebote gefunden!</h5>
          <p>
            Für mehr Angebote Ansicht mit <Icon name="minus-square" /> verkleinern oder Filter mit{' '}
            <Icon name="close" /> deaktivieren. Um nach Aufgaben oder Zielgruppen zu filtern, das
            <a onClick={() => showModalMenu('filtertab')}>
              {' '}
              Men&uuml;&nbsp;
              <Icon name="bars" style={{ color: 'black' }} /> &ouml;ffnen.
            </a>
          </p>
          {offerLink}
        </Well>
      );
    }
  } else {
    let toggleFilterTooltip = 'Angebot merken';
    let cartIcon = 'plus-square';
    let bookmarkColor = '#DDDDDD';
    if (cart.find((x) => x.id === currentFeature.id) !== undefined) {
      cartIcon = 'check-square';
      toggleFilterTooltip = 'Angebot aus Merkliste entfernen';
    }
    if (cart.length > 0) {
      bookmarkColor = '#666666';
    }
    return (
      <div>
        <Well bsSize="small" onClick={logCurrentFeature}>
          {filterstatus}
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                  <table style={{ width: '100%' }}>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'left' }}>
                          <h5>Angebot Nr. {currentFeature.id}</h5>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <OverlayTrigger
                            placement="left"
                            overlay={
                              <Tooltip style={{ zIndex: 3000000000 }} id="bookmarkstt">
                                Merkliste &ouml;ffnen
                              </Tooltip>
                            }
                          >
                            <a
                              key={'ico.bookmark.' + bookmarkColor}
                              onClick={() => showModalMenu('cart')}
                              style={{ color: bookmarkColor }}
                            >
                              <Icon
                                style={{
                                  width: '26px',
                                  textAlign: 'center',
                                }}
                                size="2x"
                                name={'bookmark'}
                              />
                            </a>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table style={{ width: '100%' }}>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'left' }}>
                          <h6>{currentFeature.text}</h6>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <OverlayTrigger
                            //ref={(c) => (this.togglecartTooltip = c)}
                            placement="left"
                            overlay={
                              <Tooltip style={{ zIndex: 3000000000 }} id="togglecarttt">
                                {toggleFilterTooltip}
                              </Tooltip>
                            }
                          >
                            <a
                              onClick={() => {
                                // if (this.togglecartTooltip) {
                                // 	this.togglecartTooltip.hide();
                                // } else {
                                // 	console.log(
                                // 		'no togglecartTooltip'
                                // 	);
                                // }
                                toggleCartFromFeature(currentFeature);
                              }}
                              style={{ color: 'black' }}
                            >
                              <Icon
                                style={{
                                  width: '26px',
                                  textAlign: 'center',
                                }}
                                size="2x"
                                name={cartIcon}
                              />
                            </a>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td />
                <td style={{ textAlign: 'center', verticalAlign: 'center' }}>
                  <a onClick={fitAll}>{filteredOffers.length} Angebote in Wuppertal</a>
                </td>

                <td />
              </tr>
            </tbody>
          </table>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', verticalAlign: 'center' }}>
                  <a title="vorheriger Treffer" onClick={previous}>
                    &lt;&lt;
                  </a>
                </td>

                <td style={{ textAlign: 'center', verticalAlign: 'center' }}>
                  {featureCollection.length} {angebotOrAngebote} angezeigt
                </td>

                <td style={{ textAlign: 'right', verticalAlign: 'center' }}>
                  <a title="nächster Treffer" onClick={next}>
                    &gt;&gt;
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </Well>
      </div>
    );
  }
};

export default EhrenamtInfo;
EhrenamtInfo.propTypes = {
  featureCollection: PropTypes.array.isRequired,
  filteredOffers: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired,
  fitAll: PropTypes.func.isRequired,
  showModalMenu: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
  toggleCartFromFeature: PropTypes.func.isRequired,
};
