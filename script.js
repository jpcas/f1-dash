//HTML Elements//
const driverRoster = document.getElementById("driverRoster");
const driverStandings = document.getElementById("driverStandings");
const constructorStandings = document.getElementById("constructorStandings");
const yearSelect = document.getElementById("yearSelect");
const raceSelect = document.getElementById("raceSelect");


//OpenF1 API URL's//
const url = "https://api.openf1.org/v1/drivers?session_key=11388";
const standingsURL = "https://api.openf1.org/v1/championship_drivers?session_key=11388";
const constructorsURL = "https://api.openf1.org/v1/championship_teams?session_key=11388";
const sessionsURL = "https://api.openf1.org/v1/sessions?session_type=Race&year=2026";

//Last Race Analysis//
const raceInfo = document.getElementById("raceInfo");
const raceResults = document.getElementById("raceResults");

Promise.all([
    fetch(url),
    fetch(standingsURL),
    fetch(constructorsURL)
])
.then(responses => {
    responses.forEach(response => {
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
    });

    return Promise.all(
        responses.map(response => response.json())
    );
})
.then(([drivers, standings, constructors]) => {
    console.log("Drivers loaded:", drivers.length);
    console.log("Standings loaded:", standings.length);
    console.log("constructors loaded:", constructors.length);

    driverRoster.innerHTML = "";

    drivers.forEach(driver => {
        driverRoster.innerHTML += `
            <div class="driver-card" style="border-top: 5px solid #${driver.team_colour || '666666'};">
                <img src="${driver.headshot_url}" alt="${driver.full_name}">
                <h3>${driver.full_name}</h3>
                <p>Driver Number: ${driver.driver_number}</p>
                <p>Team: ${driver.team_name}</p>
            </div>
        `;
    });
    
driverStandings.innerHTML = `
<table class="standings-table">
    <thead>
        <tr>
            <th>Position</th>
            <th>Driver</th>
            <th>Points</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
`;

const driverTableBody = driverStandings.querySelector("tbody");

standings
.sort((a, b) => a.position_current - b.position_current)
.forEach(standing => {
    const driver = drivers.find(
        d => d.driver_number === standing.driver_number
    );

    driverTableBody.innerHTML += `
        <tr>
            <td>${standing.position_current}</td>
            <td>${driver ? driver.full_name : "Unknown"}</td>
            <td>${standing.points_current}</td>
        </tr>
    `;
});


    // Display constructor standings
constructorStandings.innerHTML = `
    <table class="standings-table">
        <thead>
            <tr>
                <th>Position</th>
                <th>Constructor</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
`;

const constructorTableBody = constructorStandings.querySelector("tbody");
constructors
        .sort((a, b) => a.position_current - b.position_current)
        .forEach(team => {
            constructorTableBody.innerHTML += `
                <tr>
                    <td>${team.position_current}</td>
                    <td>${team.team_name}</td>
                    <td>${team.points_current}</td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.error("Dashboard error:", error);
    });

fetch(sessionsURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`API ERROR: ${response.status}`);
        }
        return response.json();
    })
    .then(sessions => {
    const now = new Date();



    const completedRaces = sessions.filter(
        session =>
        !session.is_cancelled &&
        new Date(session.date_end) < now
    );

    completedRaces.sort((a,b) =>
        new Date(b.date_end) - new Date(a.date_end)
    );

    const latestRace = completedRaces [0];
    console.log("latest completed race:", latestRace);

    const resultsURL = `https://api.openf1.org/v1/position?session_key=${latestRace.session_key}`;

fetch(resultsURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Results API error: ${response.status}`);
        }
        return response.json();
    })
    .then(positions => {
        console.log("Race positions:", positions);
        console.log("First position record:", positions[0]);
    })
    .catch(error => {
        console.error("Race results error:", error);
    
        
    });

    raceInfo.innerHTML = `
        <h3>${latestRace.country_name} Grand Prix</h3>
        <p>Circuit: ${latestRace.circuit_short_name}</p>
        <p>Date: ${new Date(latestRace.date_start).toLocaleDateString()}</p>
    `

   })
    .catch(error => {
        console.log("Race analyses error:", error);
    });


// Temporary race data for testing our table
const sampleResults = [
    { position: 1, driver: "Lando Norris", fastestLap: "1:32.456" },
    { position: 2, driver: "Max Verstappen", fastestLap: "1:32.891" },
    { position: 3, driver: "Charles Leclerc", fastestLap: "1:33.102" }
];

raceResults.innerHTML = `
    <table class="standings-table">
        <thead>
            <tr>
                <th>Position</th>
                <th>Driver</th>
                <th>Fastest Lap</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
`
console.log("Race table code executed!");

const raceTableBody = raceResults.querySelector("tbody");

sampleResults.forEach(result => {
    raceTableBody.innerHTML += `
        <tr>
            <td>${result.position}</td>
            <td>${result.driver}</td>
            <td>${result.fastestLap}</td>
        </tr>
    `;
});

yearSelect.addEventListener("change", () => {
    const selectedYear = yearSelect.value;

    console.log("Selected season:", selectedYear);

    const raceURL = `https://api.openf1.org/v1/sessions?session_type=Race&year=${selectedYear}`;

    console.log("Race API URL:", raceURL);
    fetch(raceURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return response.json();
    })
    .then(races => {
        const grandPrixRaces = races.filter(race => race.session_name === "Race");
    
        console.log("Grand Prix races:", grandPrixRaces.length);
        console.log("Filtered races:", grandPrixRaces);
        raceSelect.innerHTML = '<option value="">Select a race</option>';

grandPrixRaces.forEach(race => {
    raceSelect.innerHTML += `
        <option value="${race.session_key}">
            ${race.country_name} Grand Prix
        </option>
    `;
});
console.log("Dropdown options:", raceSelect.options.length);

    })
    .catch(error => {
        console.error("Error loading races:", error);
    });
});

raceSelect.addEventListener("change", () => {
    const selectedRace = raceSelect.value;

    console.log("Selected race session key:", selectedRace);
    if (!selectedRace) {
        return;
    }
    
    const positionsURL = `https://api.openf1.org/v1/position?session_key=${selectedRace}`;
    
    console.log("Positions API URL:", positionsURL);
    fetch(positionsURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    })
    .then(positions => {
        console.log("Position records:", positions.length);
        console.log("First position record:", positions[0]);
        const latestPositions = {};

positions.forEach(record => {
    latestPositions[record.driver_number] = record;
});

console.log("Latest positions:", latestPositions);
const finalPositions = Object.values(latestPositions);

console.log("Total drivers:", finalPositions.length);
    })
    .catch(error => {
        console.error("Error loading positions:", error);
    });
});