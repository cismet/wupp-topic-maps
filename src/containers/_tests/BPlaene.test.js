import { shallow, mount, render } from 'enzyme';
import React from 'react';
import BPlaene from '../BPlaene';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
describe('BPlaene container', () => {
	let wrapper, store;

	beforeEach(() => {
		store = mockStore();
		store.dispatch = jest.fn();
		wrapper = shallow(<BPlaene store={store} />);
	});

	// it('maps state and dispatch to props', () => {
	// 	expect(wrapper.props()).toEqual(
	// 		expect.objectContaining({
	// 			counter: 1,
	// 			onIncrement: expect.any(Function),
	// 			onDecrement: expect.any(Function)
	// 		})
	// 	);
	// });

	// it('maps onIncrement to dispatch increment action', () => {
	// 	wrapper.props().onIncrement();

	// 	expect(store.dispatch).toHaveBeenCalledWith({ type: 'INCREMENT' });
	// });

	it('renders without crashing', () => {
		//expect(wrapper.contains(<Cismap />)).toEqual(true);
	});
});
