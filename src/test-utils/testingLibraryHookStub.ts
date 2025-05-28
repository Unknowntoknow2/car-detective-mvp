
/**
 * This is a custom stub for testing hooks without any external dependencies
 * It replaces the need for @testing-library/react-hooks
 */

// Simple implementation of renderHook
export const renderHook = jest.fn().mockImplementation((callback) => {
  const result = { current: callback() };
  
  // Create a function to update the result
  const rerender = (props?: any) => {
    result.current = callback(props);
    return result;
  };
  
  // Create a mock waitForNextUpdate that resolves immediately
  const waitForNextUpdate = jest.fn().mockImplementation(() => {
    return Promise.resolve();
  });
  
  // Create a mock unmount function
  const unmount = jest.fn();
  
  return {
    result,
    waitForNextUpdate,
    rerender,
    unmount
  };
});

// Simple implementation of act
export const act = jest.fn().mockImplementation((callback) => {
  const result = callback();
  
  // If the callback returns a promise, return a resolved promise
  if (result && typeof result.then === 'function') {
    return Promise.resolve(result);
  }
  
  return undefined;
});

// Provide additional testing utilities that might be needed
export const cleanup = jest.fn();
export const renderHookResult = jest.fn();
