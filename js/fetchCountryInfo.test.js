// fetchCountryInfo.test.js
import { fetchCountryInfo } from './main.js';

// Mocking global fetch to simulate a successful response
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: { name: 'Country Name' } })
  })
);

describe('fetchCountryInfo', () => {
  it('should fetch and display country info on success', async () => {
    // Mock the displayCountryInfo function to check if it is called correctly
    const displayCountryInfo = jest.fn();
    
    // Simulate setting this function in the global context
    global.displayCountryInfo = displayCountryInfo;

    const country = 'Germany';
    
    // Run the function to test
    await fetchCountryInfo(country);
    
    // Ensure displayCountryInfo was called with the correct data
    expect(displayCountryInfo).toHaveBeenCalledWith({ name: 'Country Name' });
  });

  it('should handle errors gracefully and display an error message', async () => {
    // Mock a failed fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );
    
    const country = 'NonExistentCountry';
    
    // Mocking the DOM to check the error message
    document.body.innerHTML = '<div id="country-info"></div>';
    
    // Run the function
    await fetchCountryInfo(country);
    
    // Check if the error message is displayed in the DOM
    expect(document.getElementById('country-info').innerHTML).toBe('Error fetching country info.');
  });
});
