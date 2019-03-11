import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import "jest-enzyme";

// prevent a warning I didn't understand
// see: https://stackoverflow.com/questions/43375079/redux-warning-only-appearing-in-tests
jest.mock("./redux/store");

// react-testing-library renders your components to document.body,
// this will ensure they're removed after each test.
import "react-testing-library/cleanup-after-each";
// this adds jest-dom's custom assertions
import "jest-dom/extend-expect";

describe("<App /> shallow", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });
});
