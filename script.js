const populationUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/11ra.px";

const employmentUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/115b.px";


async function getData() {

    try {

        // Get population query
        const populationQueryResponse =
            await fetch("population_query.json");

        const populationQuery =
            await populationQueryResponse.json();


        // Send population query
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


        // Get employment query
        const employmentQueryResponse =
            await fetch("employment_query.json");

        const employmentQuery =
            await employmentQueryResponse.json();


        // Send employment query
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


        // Create the table
        createTable(populationData, employmentData);

    }

    catch (error) {

        console.error("Error fetching data:", error);

    }

}


function createTable(populationData, employmentData) {

    const tableBody =
        document.getElementById("table-body");


    // Get municipality names
    const municipalities =
        populationData.dimension[
            "alue_23_20260101"
        ].category.label;


    // Get population values
    const populations =
        populationData.value;


    // Get employment values
    const employments =
        employmentData.value;


    // Get municipality codes
    const municipalityCodes =
        Object.keys(municipalities);


    // Create a row for each municipality
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


        // Create table row
        const row =
            document.createElement("tr");


        // Create municipality cell
        const municipalityCell =
            document.createElement("td");

        municipalityCell.textContent =
            municipality;


        // Create population cell
        const populationCell =
            document.createElement("td");

        populationCell.textContent =
            population;


        // Create employment cell
        const employmentCell =
            document.createElement("td");

        employmentCell.textContent =
            employment;


        // Create employment percentage cell
        const percentageCell =
            document.createElement("td");

        percentageCell.textContent =
            percentage + "%";


        // Add cells to row
        row.appendChild(municipalityCell);
        row.appendChild(populationCell);
        row.appendChild(employmentCell);
        row.appendChild(percentageCell);


        // Color rows based on employment percentage
        if (percentage > 45) {

            row.style.backgroundColor =
                "#abffbd";

        }
        else if (percentage < 25) {

            row.style.backgroundColor =
                "#ff9e9e";

        }


        // Add row to table body
        tableBody.appendChild(row);

    });

}


// Run when JavaScript is enabled
getData();