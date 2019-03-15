import React from 'react';

import { Icon } from 'react-fa';
import { FormGroup, Checkbox, Radio, ControlLabel, Button } from 'react-bootstrap';
import { constants as kitasConstants } from '../../redux/modules/kitas';
import KitasProfileMapVisSymbol from './KitasProfileMapVisSymbol';
import KitasTraegertypMapVisSymbol from './KitasTraegertypMapVisSymbol';
// Since this component is simple and static, there's no parent container for it.
const KitasFilterPanel = ({
  width,
  filter,
  addFilterFor,
  removeFilterFor,
  resetFilter,
  featureRenderingOption,
  pieChart
}) => {
  const traegertypMap = [
    { text: 'städtisch', c: kitasConstants.TRAEGERTYP_STAEDTISCH },
    { text: 'evangelisch', c: kitasConstants.TRAEGERTYP_EVANGELISCH },
    { text: 'katholisch', c: kitasConstants.TRAEGERTYP_KATHOLISCH },
    { text: 'Elterninitiative', c: kitasConstants.TRAEGERTYP_ELTERNINITIATIVE },
    { text: 'Betrieb', c: kitasConstants.TRAEGERTYP_BETRIEBSKITA },
    { text: 'andere freie Träger', c: kitasConstants.TRAEGERTYP_ANDERE }
  ];
  let widePieChartPlaceholder = null;
  let narrowPieChartPlaceholder = null;

  if (width < 995) {
    narrowPieChartPlaceholder = (
      <div>
        <br />
        {pieChart}
      </div>
    );
  } else {
    widePieChartPlaceholder = <td>{pieChart}</td>;
  }

  let injectQueryParameter =
    '&inject=' + window.btoa(JSON.stringify([{ action: 'setFilterAndApply', payload: filter }]));
  if (new URLSearchParams(window.location.href).get('getinjectorstring')) {
    console.log(injectQueryParameter);
  }
  return (
    <div>
      <table border={0} width="100%">
        <tbody>
          <tr>
            <td valign="center" style={{ width: '330px' }}>
              <FormGroup>
                <ControlLabel>
                  Trägertyp
                  {'  '}
                  <Icon
                    style={{
                      color: 'grey',
                      width: '30px',
                      textAlign: 'center'
                    }}
                    size="2x"
                    name={'home'}
                  />
                </ControlLabel>
                {traegertypMap.map(item => {
                  return (
                    <div key={'filter.kita.traeger.div.' + item.c}>
                      <Checkbox
                        readOnly={true}
                        key={'filter.kita.traeger.' + item.c}
                        onClick={e => {
                          if (e.target.checked === false) {
                            removeFilterFor('traeger', item.c);
                          } else {
                            addFilterFor('traeger', item.c);
                          }
                        }}
                        checked={filter.traeger.indexOf(item.c) !== -1}
                        inline
                      >
                        {item.text}{' '}
                        <KitasTraegertypMapVisSymbol
                          visible={
                            featureRenderingOption ===
                            kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP
                          }
                          traegertyp={kitasConstants.TRAEGERTYP.indexOf(item.c)}
                        />
                      </Checkbox>
                    </div>
                  );
                })}
              </FormGroup>
              <br />
              <FormGroup>
                <ControlLabel>
                  Profil
                  {'  '}
                  <Icon
                    style={{
                      color: 'grey',
                      width: '30px',
                      textAlign: 'center'
                    }}
                    size="2x"
                    name={'child'}
                  />
                </ControlLabel>
                <br />
                <Checkbox
                  readOnly={true}
                  key={'filter.kita.inklusion.checkbox'}
                  onClick={e => {
                    if (e.target.checked === false) {
                      removeFilterFor('profil', kitasConstants.PROFIL_INKLUSION);
                    } else {
                      addFilterFor('profil', kitasConstants.PROFIL_INKLUSION);
                    }
                  }}
                  checked={filter.profil.indexOf(kitasConstants.PROFIL_INKLUSION) !== -1}
                  inline
                >
                  Schwerpunkt Inklusion
                </Checkbox>
                {'  '}
                <KitasProfileMapVisSymbol
                  inklusion={true}
                  visible={featureRenderingOption === kitasConstants.FEATURE_RENDERING_BY_PROFIL}
                />
                <br />
                <Checkbox
                  readOnly={true}
                  key={'filter.kita.normal.checkbox'}
                  onClick={e => {
                    if (e.target.checked === false) {
                      removeFilterFor('profil', kitasConstants.PROFIL_NORMAL);
                    } else {
                      addFilterFor('profil', kitasConstants.PROFIL_NORMAL);
                    }
                  }}
                  checked={filter.profil.indexOf(kitasConstants.PROFIL_NORMAL) !== -1}
                  inline
                >
                  ohne Schwerpunkt Inklusion
                </Checkbox>
                {'  '}
                <KitasProfileMapVisSymbol
                  inklusion={false}
                  visible={featureRenderingOption === kitasConstants.FEATURE_RENDERING_BY_PROFIL}
                />
              </FormGroup>
              <FormGroup>
                <br />
                <ControlLabel>
                  Kindesalter{' '}
                  <Icon
                    style={{
                      color: 'grey',
                      width: '30px',
                      textAlign: 'center'
                    }}
                    size="2x"
                    name={'user'}
                  />
                </ControlLabel>
                <br />
                <Radio
                  readOnly={true}
                  key={'filter.kita.alter.unter2'}
                  onClick={e => {
                    if (e.target.checked === true) {
                      addFilterFor('alter', kitasConstants.ALTER_UNTER2);
                      removeFilterFor('alter', kitasConstants.ALTER_AB2);
                      removeFilterFor('alter', kitasConstants.ALTER_AB3);
                    }
                  }}
                  checked={filter.alter.indexOf(kitasConstants.ALTER_UNTER2) !== -1}
                  inline
                >
                  unter 2 Jahre
                </Radio>
                <br />
                <Radio
                  readOnly={true}
                  key={'filter.kita.alter.ab2'}
                  onClick={e => {
                    if (e.target.checked === true) {
                      addFilterFor('alter', kitasConstants.ALTER_AB2);
                      removeFilterFor('alter', kitasConstants.ALTER_UNTER2);
                      removeFilterFor('alter', kitasConstants.ALTER_AB3);
                    }
                  }}
                  checked={filter.alter.indexOf(kitasConstants.ALTER_AB2) !== -1}
                  inline
                >
                  2 bis 3 Jahre
                </Radio>
                <br />
                <Radio
                  readOnly={true}
                  key={'filter.kita.alter.ab3'}
                  onClick={e => {
                    if (e.target.checked === true) {
                      addFilterFor('alter', kitasConstants.ALTER_AB3);
                      removeFilterFor('alter', kitasConstants.ALTER_AB2);
                      removeFilterFor('alter', kitasConstants.ALTER_UNTER2);
                    }
                  }}
                  checked={filter.alter.indexOf(kitasConstants.ALTER_AB3) !== -1}
                  inline
                >
                  ab 3 Jahre
                </Radio>
              </FormGroup>
              <FormGroup>
                <br />
                <ControlLabel>
                  Betreuungsumfang{' '}
                  <Icon
                    style={{
                      color: 'grey',
                      width: '40px',
                      textAlign: 'center'
                    }}
                    size="2x"
                    name={'calendar'}
                  />
                </ControlLabel>
                <br />
                <Checkbox
                  key="filter.kita.umfang.35h"
                  readOnly={true}
                  onClick={e => {
                    if (e.target.checked === false) {
                      removeFilterFor('umfang', kitasConstants.STUNDEN_FILTER_35);
                    } else {
                      addFilterFor('umfang', kitasConstants.STUNDEN_FILTER_35);
                    }
                  }}
                  checked={filter.umfang.indexOf(kitasConstants.STUNDEN_FILTER_35) !== -1}
                  name="mapBackground"
                  inline
                >
                  35 Stunden pro Woche
                </Checkbox>{' '}
                <br />
                <Checkbox
                  key="filter.kita.umfang.45h"
                  readOnly={true}
                  onClick={e => {
                    if (e.target.checked === false) {
                      removeFilterFor('umfang', kitasConstants.STUNDEN_FILTER_45);
                    } else {
                      addFilterFor('umfang', kitasConstants.STUNDEN_FILTER_45);
                    }
                  }}
                  name="mapBackground"
                  checked={filter.umfang.indexOf(kitasConstants.STUNDEN_FILTER_45) !== -1}
                  inline
                >
                  45 Stunden pro Woche
                </Checkbox>
              </FormGroup>
              <br />
              <br />
              <p>
                <Button bsSize="small" onClick={() => resetFilter()}>
                  Filter zurücksetzen (Alle Kitas anzeigen)
                </Button>
              </p>
            </td>
            {widePieChartPlaceholder}
          </tr>
        </tbody>
      </table>
      {narrowPieChartPlaceholder}
    </div>
  );
};

export default KitasFilterPanel;
