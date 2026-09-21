const populationUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/11ra.px";

const employmentUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/115b.px";


async function getData() {
    try {

        // Get the population query
        const populationQueryResponse =
            await fetch("population_query.json");

        const populationQuery =
            await populationQueryResponse.json();


        // Get population data
        const populationResponse =
            await fetch(populationUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(populationQuery)
            });

        const populationData =
            await populationResponse.json();


        // Get the employment query
        const employmentQueryResponse =
            await fetch("employment_query.json");

        const employmentQuery =
            await employmentQueryResponse.json();


        // Get employment data
        const employmentResponse =
            await fetch(employmentUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(employmentQuery)
            });

        const employmentData =
            await employmentResponse.json();


        createTable(populationData, employmentData);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function createTable(populationData, employmentData) {

    const tableBody =
        document.getElementById("table-body");


    // Population municipalities
    const municipalities =
        populationData.dimension[
            "alue_23_20260101"
        ].category.label;


    // Population values
    const populations =
        populationData.value;


    // Employment values
    const employments =
        employmentData.value;


    const municipalityCodes =
        Object.keys(municipalities);


    municipalityCodes.forEach((code, index) => {

        const municipality =
            municipalities[code];

        const population =
            populations[index];

        const employment =
            employments[index];


        // Calculate employment percentage
        const percentage =
            ((employment / population) * 100).toFixed(2);


        // Create row
        const row =
            document.createElement("tr");


        // Municipality
        const municipalityCell =
            document.createElement("td");

        municipalityCell.textContent =
            municipality;


        // Population
        const populationCell =
            document.createElement("td");

        populationCell.textContent =
            population;


        // Employment
        const employmentCell =
            document.createElement("td");

        employmentCell.textContent =
            employment;


        // Employment %
        const percentageCell =
            document.createElement("td");

        percentageCell.textContent =
            percentage + "%";


        // Add cells to row
        row.appendChild(municipalityCell);
        row.appendChild(populationCell);
        row.appendChild(employmentCell);
        row.appendChild(percentageCell);


        // Conditional styling
        if (percentage > 45) {
            row.style.backgroundColor = "#aaffbd";
        }

        if (percentage < 25) {
            row.style.backgroundColor = "#ff9e9e";
        }


        // Add row to table
        tableBody.appendChild(row);

    });
}


getData();