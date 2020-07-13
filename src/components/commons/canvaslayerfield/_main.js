// base
import Vector from './Vector.js';

import Cell from './Cell.js';

import Field from './Field.js';

import ScalarField from './ScalarField.js';

import VectorField from './VectorField.js';

window.L.Vector = Vector;
window.L.Cell = Cell;
window.L.Field = Field;
window.L.ScalarField = ScalarField;
window.L.VectorField = VectorField;

// layer
require('./layer/L.CanvasLayer.js');
require('./layer/L.CanvasLayer.SimpleLonLat.js');
require('./layer/L.CanvasLayer.Field.js');
require('./layer/L.CanvasLayer.ScalarField.js');
require('./layer/L.CanvasLayer.VectorFieldAnim.js');

// control
require('./control/L.Control.ColorBar.js');
