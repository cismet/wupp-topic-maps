import * as actionTypes from '../constants/actionTypes';

export function screenResize(height,width) {
    return {
        type: actionTypes.SCREEN_RESIZE,
        width: width,
        height: height,
    };
}
export function showHelpComponent(helpTextVisible) {
    return {
        type: actionTypes.SHOW_HELP_COMPONENT,
        helpTextVisible
    };
}
