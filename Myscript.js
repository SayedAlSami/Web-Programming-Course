const populationUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";

const employmentUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";


// --------------------------------------------------
// GET POPULATION DATA
// --------------------------------------------------

function getPopulation() {

    return fetch("population_query.json")
        .then(response => response.json())
        .then(query => {

            return fetch(populationUrl, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(query)
            });

        })
        .then(response => response.json());
}


// --------------------------------------------------
// GET EMPLOYMENT DATA
// --------------------------------------------------

function getEmployment() {

    return fetch("employment_query.json")
        .then(response => response.json())
        .then(query => {

            return fetch(employmentUrl, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(query)
            });

        })
        .then(response => response.json());
}


// --------------------------------------------------
// GET BOTH DATASETS
// --------------------------------------------------

Promise.all([
    getPopulation(),
    getEmployment()
])

.then(([populationData, employmentData]) => {

    console.log("Population data:");
    console.log(populationData);

    console.log("Employment data:");
    console.log(employmentData);

    createTable(populationData, employmentData);

})

.catch(error => {

    console.error("Something went wrong:");
    console.error(error);

});


// --------------------------------------------------
// CREATE TABLE
// --------------------------------------------------

function createTable(populationData, employmentData) {

    const tableBody =
        document.getElementById("table-body");


    // Get municipality names
    const municipalityLabels =
        populationData
            .dimension["alue_23_20260101"]
            .category
            .label;


    // Get population values
    const populationValues =
        populationData.value;


    // Get employment values
    const employmentValues =
        employmentData.value;


    // Get municipality codes
    const municipalityCodes =
        Object.keys(municipalityLabels);


    // Create one row for every municipality
    municipalityCodes.forEach((code, index) => {

        // Create row
        const row =
            document.createElement("tr");


        // ------------------------------------------
        // Municipality
        // ------------------------------------------

        const municipalityCell =
            document.createElement("td");

        municipalityCell.textContent =
            municipalityLabels[code];


        // ------------------------------------------
        // Population
        // ------------------------------------------

        const populationCell =
            document.createElement("td");

        populationCell.textContent =
            populationValues[index];


        // ------------------------------------------
        // Employment
        // ------------------------------------------

        const employmentCell =
            document.createElement("td");

        employmentCell.textContent =
            employmentValues[index];


        // ------------------------------------------
        // Add cells to row
        // ------------------------------------------

        row.appendChild(municipalityCell);

        row.appendChild(populationCell);

        row.appendChild(employmentCell);


        // ------------------------------------------
        // Add row to table
        // ------------------------------------------

        tableBody.appendChild(row);

    });
}