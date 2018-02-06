import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    ButtonGroup,
    ButtonToolbar,
} from 'react-bootstrap';

import {Icon} from 'react-fa'

const MultiToggleButton = ({value, stateOptions, valueChanged}) => {
    let buttons=[];

    for (let stateOption of stateOptions){
        let c=stateOption.color;
        if (value===stateOption.key) {
            c=stateOption.selectedColor;
        }
        let b=<Button className="" onClick={()=>valueChanged(stateOption.key)} style={{color:c}} title={stateOption.title}><Icon name={stateOption.glyph}/>{stateOption.text}</Button>
        buttons.push(b);
    }
    return (
        <ButtonToolbar>
            <ButtonGroup bsSize="xsmall">
                {buttons}
            </ButtonGroup>
        </ButtonToolbar>
    );

};

export default MultiToggleButton;

MultiToggleButton.propTypes = {
    value: PropTypes.object.isRequired,
    stateOptions: PropTypes.object,
    valueChanged: PropTypes.func.isRequired
};

MultiToggleButton.defaultProps = {
    stateOptions : [{
            key: "one",
            glyph: "thumbs-up",
            title: "Gerne",
            text: "",
            color: "grey",
            selectedColor: "green"
        },{
            key: "two",
            glyph: "",
            title: "egal",
            text: "-",
            color: "grey",
            selectedColor: "black"
        }, {
            key: "three",
            glyph: "thumbs-down",
            title: "Besser nicht",
            text: "",
            color: "grey",
            selectedColor: "red"
        }
    ]
}