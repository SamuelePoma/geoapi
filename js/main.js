document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', function () {
        const query = document.getElementById('search-input').value;
        if (query) {
            fetchCountryInfo(query);
        } else {
            document.getElementById('country-info').innerHTML = 'Please enter a country.';
        }
    });
});

async function fetchCountryInfo(country) {
    try {
        const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${country}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'f2c5fa9f21msh75373877108bd0cp1d1e6bjsnbf028d5228d2',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayCountryInfo(data.data);
    } catch (error) {
        console.error('Error fetching country info:', error);
        document.getElementById('country-info').innerHTML = 'Error fetching country info.';
    }
}

function displayCountryInfo(country) {
    const infoDiv = document.getElementById('country-info');
    infoDiv.innerHTML = `
        <h2 class="text-xl font-bold">${country.name}</h2>
        <p><strong>Code:</strong> ${country.code}</p>
        <p><strong>Calling Code:</strong> ${country.callingCode}</p>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Regions N:</strong> ${country.numRegions}</p>
        <p><strong>Currency:</strong> ${country.currencyCodes}</p>
        <img src="${country.flagImageUri}" alt="Flag of ${country.name}" class="country-flag w-16 h-10">

        <button id="regions-button"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">Show
            Regions</button>
    `;

    document.getElementById('regions-button').addEventListener('click', function () {
        fetchRegions(country.code);
    });
}

async function fetchRegions(countryCode, offset = 0, regions = []) {
    try {
        const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryCode}/regions?limit=10&offset=${offset}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'f2c5fa9f21msh75373877108bd0cp1d1e6bjsnbf028d5228d2',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            if (response.status === 429) {
                console.log('Too many requests, waiting for 1 second before retrying...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                return fetchRegions(countryCode, offset, regions);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        regions = regions.concat(data.data);

        if (data.metadata && data.metadata.totalCount > regions.length) {
            await fetchRegions(countryCode, offset + 10, regions);
        } else {
            displayRegions(regions, countryCode);
        }
    } catch (error) {
        document.getElementById('regions-list').innerHTML = 'Error fetching regions.';
    }
}

function displayRegions(regions, countryCode) {
    const regionsDiv = document.getElementById('regions-list');
    regionsDiv.innerHTML = '<h3 class="text-lg font-bold mb-2">Regions:</h3>';
    regions.forEach(region => {
        const regionDiv = document.createElement('div');
        regionDiv.classList.add('region-card', 'bg-white', 'shadow-md', 'rounded-lg', 'p-4', 'mt-2');
        regionDiv.innerHTML = `
            <a href="cities.html?region=${encodeURIComponent(region.name)}&country=${countryCode}" class="block text-blue-500 hover:underline">${region.name}</a>
        `;
        regionsDiv.appendChild(regionDiv);
    });
}
