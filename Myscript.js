const populationUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/11ra.px";

const employmentUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/115b.px";


// Get the population query
fetch("population_query.json")
    .then(response => response.json())
    .then(populationQuery => {

        // Send the population query to the API
        return fetch(populationUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(populationQuery)
        });

    })
    .then(response => response.json())
    .then(populationData => {

        // Get the employment query
        return fetch("employment_query.json")
            .then(response => response.json())
            .then(employmentQuery => {

                // Send employment query to API
                return fetch(employmentUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(employmentQuery)
                });

            })
            .then(response => response.json())
            .then(employmentData => {

                createTable(populationData, employmentData);

            });

    })
    .catch(error => {
        console.error("Error:", error);
    });


function createTable(populationData, employmentData) {

    const tableBody = document.getElementById("table-body");

    /*
     * Population data
     */

    const populationDimension =
        populationData.dimension["alue_23_20260101"];

    const municipalityLabels =
        populationDimension.category.label;

    const populationValues =
        populationData.value;


    /*
     * Employment data
     */

    const employmentDimension =
        employmentData.dimension["alue_23_20260101"];

    const employmentValues =
        employmentData.value;


    /*
     * Get municipality codes in the correct order
     */

    const municipalityCodes =
        Object.keys(municipalityLabels);


    /*
     * Create one table row for every municipality
     */

    municipalityCodes.forEach((code, index) => {

        const municipality =
            municipalityLabels[code];

        const population =
            populationValues[index];

        const employment =
            employmentValues[index];


        /*
         * Calculate employment percentage
         */

        const employmentPercentage =
            ((employment / population) * 100).toFixed(2);


        /*
         * Create table row
         */

        const row = document.createElement("tr");


        /*
         * Municipality cell
         */

        const municipalityCell =
            document.createElement("td");

        municipalityCell.textContent =
            municipality;


        /*
         * Population cell
         */

        const populationCell =
            document.createElement("td");

        populationCell.textContent =
            population;


        /*
         * Employment cell
         */

        const employmentCell =
            document.createElement("td");

        employmentCell.textContent =
            employment;


        /*
         * Employment percentage cell
         */

        const percentageCell =
            document.createElement("td");

        percentageCell.textContent =
            employmentPercentage + "%";


        /*
         * Add cells to row
         */

        row.appendChild(municipalityCell);
        row.appendChild(populationCell);
        row.appendChild(employmentCell);
        row.appendChild(percentageCell);


        /*
         * Conditional styling
         */

        if (employmentPercentage > 45) {

            row.style.backgroundColor = "#aaffbd";

        }
        else if (employmentPercentage < 25) {

            row.style.backgroundColor = "#ff9e9e";

        }


        /*
         * Add row to table
         */

        tableBody.appendChild(row);

    });
}