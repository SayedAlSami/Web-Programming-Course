const populationUrl =
    "https://pxdata.stat.fi:443/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";

const employmentUrl =
    "https://pxdata.stat.fi:443/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";


async function fetchStatFinData(url, body) {

    console.log("Sending POST request to:", url);
    console.log("Request body:", body);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
        throw new Error("API request failed: " + response.status);
    }

    return await response.json();
}


async function initializeCode() {

    console.log("JavaScript started");

    try {

        console.log("Loading population_query.json");

        const populationResponse =
            await fetch("population_query.json");

        console.log(
            "Population JSON status:",
            populationResponse.status
        );

        const populationBody =
            await populationResponse.json();


        console.log("Loading employment_query.json");

        const employmentResponse =
            await fetch("employment_query.json");

        console.log(
            "Employment JSON status:",
            employmentResponse.status
        );

        const employmentBody =
            await employmentResponse.json();


        console.log("Both query files loaded");


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


        console.log("Population data:", populationData);
        console.log("Employment data:", employmentData);


        setupTable(
            populationData,
            employmentData
        );

    } catch (error) {

        console.error(
            "ERROR IN JAVASCRIPT:",
            error
        );

    }
}


function setupTable(
    populationData,
    employmentData
) {

    const tableBody =
        document.querySelector("table tbody");


    const populationDimension =
        populationData.dimension[
            "alue_23_20260101"
        ];


    const municipalityLabels =
        populationDimension.category.label;


    const populationValues =
        populationData.value;


    const employmentValues =
        employmentData.value;


    const municipalityCodes =
        Object.keys(municipalityLabels);


    municipalityCodes.forEach(
        (code, index) => {

            const row =
                document.createElement("tr");


            const municipalityCell =
                document.createElement("td");

            municipalityCell.textContent =
                municipalityLabels[code];


            const populationCell =
                document.createElement("td");

            populationCell.textContent =
                populationValues[index];


            const employmentCell =
                document.createElement("td");

            employmentCell.textContent =
                employmentValues[index];


            const employmentPercentCell =
                document.createElement("td");


            const percentage =
                (
                    employmentValues[index] /
                    populationValues[index]
                ) * 100;


            employmentPercentCell.textContent =
                percentage.toFixed(2);


            row.appendChild(
                municipalityCell
            );

            row.appendChild(
                populationCell
            );

            row.appendChild(
                employmentCell
            );

            row.appendChild(
                employmentPercentCell
            );


            if (percentage > 45) {

                row.style.backgroundColor =
                    "#aaffbd";

            } else if (percentage < 25) {

                row.style.backgroundColor =
                    "#ff9e9e";

            }


            tableBody.appendChild(row);

        }
    );
}


initializeCode();