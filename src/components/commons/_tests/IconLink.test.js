import { shallow, mount, render } from 'enzyme';
import React from 'react';
import IconLink from '../IconLink';

describe('Cismap container', () => {
  let wrapper, store;

  beforeEach(() => {
    wrapper = shallow(
      <IconLink tooltip="tooltip" href="www.google.com" target="windowname" iconname="Link" />
    );
  });

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('has the correct href', () => {
    // expect(wrapper.find('a').href).toBe('www.google.com');
    // console.log(wrapper.find('Icon'));
  });
});
