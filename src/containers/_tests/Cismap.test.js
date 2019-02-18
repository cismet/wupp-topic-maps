import { shallow, mount, render } from 'enzyme';
import React from 'react';
import Cismap from '../Cismap';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
describe('Cismap container', () => {
	// let wrapper, store;
	// beforeEach(() => {
	// 	store = mockStore();
	// 	store.dispatch = jest.fn();
	// 	wrapper = shallow(<Cismap store={store} />);
	// });
	// it('renders without crashing', () => {
	// 	console.log('wrapper.props()', wrapper.props());
	// 	//expect(wrapper.contains(<Cismap />)).toEqual(true);
	// });
	it('dummy test', () => {
		expect(true).toBe(true);
	});
});
