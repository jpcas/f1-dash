const driverRoster = document.getElementById("driverRoster");
const driverStandings = document.getElementById("driverStandings");
console.log(driverStandings)
const url = "https://api.openf1.org/v1/drivers?session_key=11388";
let drivers = [];

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return response.json();
    })    .then(data => {
        drivers = data;
        console.log("Saved drivers:", drivers.length);
        driverRoster.innerHTML = "";
        data.forEach(driver =>
            driverRoster.innerHTML += `
            <div class="driver-card" style="border-top: 5px solid #${driver.team_colour || '666666'};">
            <img src="${driver.headshot_url}" alt="${driver.full_name}">
            <h3>${driver.full_name}</h3>
            <p>Driver Number: ${driver.driver_number}</p>
            <p>Team: ${driver.team_name}</p>
            </div>
            `
            )
        ;
    });

const standingsURL = "https://api.openf1.org/v1/championship_drivers?session_key=11388";

fetch (standingsURL)
    .then(response => response.json())
    .then(data => {
        driverStandings.innerHTML = "";

        data.forEach(standing => {
            const driver = drivers.find(d => d.driver_number === standing.driver_number);
            driverStandings.innerHTML += `
            <div class="standing-card">
                <p>Position: ${standing.position_current}</p>
                <p>Name: ${driver ? driver.full_name : "Unknown"}</p>
                <p>Driver Number: ${standing.driver_number}</p>
                <p>Points: ${standing.points_current}</p>
            </div>
            `;
        });
    });
