//HTML Elements//
const driverRoster = document.getElementById("driverRoster");
const driverStandings = document.getElementById("driverStandings");
const constructorStandings = document.getElementById("constructorStandings");


//OpenF1 API URL's//
const url = "https://api.openf1.org/v1/drivers?session_key=11388";
const standingsURL = "https://api.openf1.org/v1/championship_drivers?session_key=11388";
const constructorsURL = "https://api.openf1.org/v1/championship_teams?session_key=11388";

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