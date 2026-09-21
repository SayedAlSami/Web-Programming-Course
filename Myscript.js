const populationUrl =
    "https://pxdata.stat.fi:443/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";

const employmentUrl =
    "https://pxdata.stat.fi:443/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";


async function fetchStatFinData(url, body) {

    const response = await fetch(url, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(body)
    });

    return await response.json();
}


async function initializeCode() {

    // Load the two query JSON files
    const populationBody =
        await (await fetch("population_query.json")).json();

    const employmentBody =
        await (await fetch("employment_query.json")).json();


    // Request both APIs at the same time
    const [populationData, employmentData] =
        await Promise.all([

            fetchStatFinData(
                populationUrl,
                populationBody
            ),

            fetchStatFinData(
                employmentUrl,
                employmentBody
            )

        ]);


    setupTable(
        populationData,
        employmentData
    );
}


function setupTable(populationData, employmentData) {

    const tableBody =
        document.querySelector("table tbody");


    // Population information
    const populationDimension =
        populationData.dimension["alue_23_20260101"];

    const municipalityLabels =
        populationDimension.category.label;

    const populationValues =
        populationData.value;


    // Employment information
    const employmentValues =
        employmentData.value;


    // Municipality codes
    const municipalityCodes =
        Object.keys(municipalityLabels);


    municipalityCodes.forEach((code, index) => {

        const row =
            document.createElement("tr");


        // Municipality
        const municipalityCell =
            document.createElement("td");

        municipalityCell.textContent =
            municipalityLabels[code];


        // Population
        const populationCell =
            document.createElement("td");

        populationCell.textContent =
            populationValues[index];


        // Employment
        const employmentCell =
            document.createElement("td");

        employmentCell.textContent =
            employmentValues[index];


        row.appendChild(municipalityCell);
        row.appendChild(populationCell);
        row.appendChild(employmentCell);

        tableBody.appendChild(row);

    });
}


// Start the application
initializeCode();