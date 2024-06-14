document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const region = params.get('region');
    const country = params.get('country');

    if (region && country) {
        document.getElementById('region-title').innerText = `Cities in ${region}`;
        fetchCitiesByRegionAndCountry(region, country);
    } else {
        document.getElementById('city-results').innerHTML = 'Region or Country not specified.';
    }
});

async function fetchCitiesByRegionAndCountry(region, country, offset = 0, cities = []) {
    try {
        const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${encodeURIComponent(country)}&minPopulation=300000&limit=10&offset=${offset}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'f2c5fa9f21msh75373877108bd0cp1d1e6bjsnbf028d5228d2',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            if (response.status === 429) {
                // Se riceviamo l'errore "Too Many Requests", aspettiamo 2 secondi prima di ritentare
                console.log('Too many requests, waiting for 2 seconds before retrying...');
                await new Promise(resolve => setTimeout(resolve, 2000)); // Attendiamo 2 secondi
                return fetchCitiesByRegionAndCountry(region, country, offset, cities); // Ritentiamo la richiesta
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        cities = cities.concat(data.data);

        if (data.metadata && data.metadata.totalCount > cities.length) {
            await fetchCitiesByRegionAndCountry(region, country, offset + 10, cities);
        } else {
            console.log('Fetched cities:', cities);  // Log per debug
            displayCities(cities, region);
        }
    } catch (error) {
        console.error('Error fetching cities:', error);
        document.getElementById('city-results').innerHTML = 'Error fetching cities.';
    }
}

function displayCities(cities, region) {
    const resultsDiv = document.getElementById('city-results');
    resultsDiv.innerHTML = ''; // Clear previous results

    const filteredCities = cities.filter(city => city.region === region);

    filteredCities.forEach(city => {
        const cityDiv = document.createElement('div');
        cityDiv.classList.add('p-4', 'bg-white', 'shadow-md', 'rounded-lg', 'mb-4');
        cityDiv.innerHTML = `
            <h2 class="text-xl font-bold">${city.name}</h2>
            <p><strong>Country:</strong> ${city.country}</p>
            <p><strong>Latitude:</strong> ${city.latitude}</p>
            <p><strong>Longitude:</strong> ${city.longitude}</p>
            <p><strong>Population:</strong> ${city.population}</p>
        `;
        resultsDiv.appendChild(cityDiv);
    });
}
