import { faPlug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Checkbox, ControlLabel, FormGroup } from 'react-bootstrap';

const Comp = ({ filter, setFilter, steckertypes }) => {
  if (steckertypes) {
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
            {Object.keys(steckertypes).map((typ) => {
              return (
                <div>
                  <Checkbox
                    readOnly={true}
                    key={'filter.emob.stecker.' + typ}
                    onClick={(e) => {
                      const f = JSON.parse(JSON.stringify(filter));
                      if (filter.stecker === undefined) {
                        f.stecker = Object.keys(steckertypes);
                      }
                      const add = f.stecker.indexOf(typ) === -1;

                      if (add === true) {
                        f.stecker.push(typ);
                      } else {
                        f.stecker.splice(f.stecker.indexOf(typ), 1);
                      }

                      //f.stecker = e.target.checked;
                      setFilter(f);
                    }}
                    checked={filter.stecker === undefined || filter.stecker.indexOf(typ) !== -1}
                    inline
                  >
                    {steckertypes[typ]}
                  </Checkbox>
                </div>
              );
            })}
          </div>
        </FormGroup>
        <br />
      </div>
    );
  } else {
    return null;
  }
};

export default Comp;
