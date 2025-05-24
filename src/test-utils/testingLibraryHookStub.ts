
// Create a stub for @testing-library/react-hooks if needed
export const renderHook = jest.fn().mockImplementation((callback) => {
  const result = { current: callback() };
  
  return {
    result,
    waitForNextUpdate: jest.fn().mockResolvedValue(undefined),
    rerender: jest.fn(),
    unmount: jest.fn()
  };
});

export const act = jest.fn().mockImplementation(callback => {
  callback();
  return undefined;
});
