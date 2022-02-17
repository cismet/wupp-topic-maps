import { faPlug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Checkbox, ControlLabel, FormGroup } from 'react-bootstrap';

// select '['||array_to_string(array( select '"'||schluessel||'"' from emob_steckdosentyp order by schluessel),',')||']'
// select '['||array_to_string(array( select '"'||name||'"' from emob_steckdosentyp  order by schluessel)  ,',')||']'

// const stecker = [ 'Schuko', 'Typ 2', 'CHAdeMO', 'CCS', 'Tesla Supercharger', 'Drehstrom' ];
const stecker = [
  'CCS',
  'CHAdeMO',
  'CHAdeMO Stecker',
  'COMBO CCS',
  'COMBO Kupplung',
  'Drehstrom',
  'Kupplung Combo, CHAdeMO',
  'Schuko',
  'Tesla Supercharger',
  'Tesla Typ2',
  'Tesla Wallbox',
  'Typ 2',
  'Typ 2 Kupplung',
];

const steckerNames = [
  'CCS',
  'CHAdeMO Kupplung',
  'CHAdeMO Stecker',
  'Combo Steckdose',
  'Combo Kupplung',
  'Drehstrom',
  'Combo, CHAdeMO Kupplung',
  'Schuko Steckdose',
  'Tesla Supercharger',
  'Tesla Typ2',
  'Tesla Wallbox',
  'Typ 2 Steckdose',
  'Typ 2 Kupplung',
];
const Comp = ({ filter, setFilter }) => {
  return (
    <div>
      <FormGroup>
        <ControlLabel>
          Steckertypen
          {'  '}
          <FontAwesomeIcon
            icon={faPlug}
            size="2x"
            style={{
              color: 'grey',
              width: '30px',
              textAlign: 'center',
            }}
          />
        </ControlLabel>
        <div>
          {stecker.map((typ, index) => {
            return (
              <div>
                <Checkbox
                  readOnly={true}
                  key={'filter.emob.stecker.' + typ}
                  onClick={(e) => {
                    const f = JSON.parse(JSON.stringify(filter));
                    const add = filter.stecker.indexOf(typ) === -1;

                    if (add === true) {
                      f.stecker.push(typ);
                    } else {
                      f.stecker.splice(filter.stecker.indexOf(typ), 1);
                    }

                    //f.stecker = e.target.checked;
                    setFilter(f);
                  }}
                  checked={filter.stecker.indexOf(typ) !== -1}
                  inline
                >
                  {steckerNames[index]}
                </Checkbox>
              </div>
            );
          })}
        </div>
      </FormGroup>
      <br />
    </div>
  );
};

export default Comp;
