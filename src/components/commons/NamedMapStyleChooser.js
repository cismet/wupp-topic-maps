import React from "react";
import PropTypes from "prop-types";
import { FormGroup, Radio, ControlLabel } from "react-bootstrap";
import { removeQueryPart, modifyQueryPart } from "../../utils/routingHelper";

// Since this component is simple and static, there's no parent container for it.
const NamedMapStyleChooser = ({
  title,
  currentNamedMapStyle,
  pathname,
  search,
  pushNewRoute,
  modes
}) => {
  return (
    <FormGroup>
      <ControlLabel>{title}</ControlLabel>
      <br />
      {modes.map((item, key) => {
        return (
          <Radio
            key={key}
            readOnly={true}
            onClick={e => {
              if (e.target.checked === true) {
                if (item.mode === "default") {
                  pushNewRoute(pathname + removeQueryPart(search, "mapStyle"));
                } else {
                  pushNewRoute(
                    pathname +
                      modifyQueryPart(search, {
                        mapStyle: item.mode
                      })
                  );
                }
              }
            }}
            checked={currentNamedMapStyle === item.mode}
            name="mapBackground"
            inline
          >
            {item.title} &nbsp;
          </Radio>
        );
      })}
    </FormGroup>
  );
};

export default NamedMapStyleChooser;
NamedMapStyleChooser.propTypes = {
  title: PropTypes.string,
  currentNamedMapStyle: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  pushNewRoute: PropTypes.func.isRequired,
  modes: PropTypes.array
};

NamedMapStyleChooser.defaultProps = {
  title: "Kartendarstellung:",
  modes: [{ title: "Tag", mode: "default" }, { title: "Nacht", mode: "night" }]
};
