
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Population Growth in Finland</title>

  <script src="https://unpkg.com/frappe-charts@latest/dist/frappe-charts.min.umd.js"></script>

  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 24px;
      color: #222;
    }

    .search-form {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 18px;
    }

    #chart {
      width: 100%;
      min-height: 450px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }

    input, button {
      font: inherit;
      padding: 5px 8px;
    }

    #status {
      margin: 8px 0;
      color: #555;
    }
  </style>
</head>

<body>
  <h1>Population growth in Finland</h1>

  <form class="search-form" id="municipality-form">
    <label for="input-area">Enter municipality</label>
    <input
      id="input-area"
      name="municipality"
      type="text"
      value="whole country"
      autocomplete="off"
    >
    <button id="submit-data" type="submit">Submit</button>
  </form>

  <p id="status" role="status">Loading population data...</p>

  <div id="chart" aria-label="Population growth line chart"></div>

  <div class="actions">
    <button id="add-data" type="button">View estimated data</button>
    <button id="navigation" type="button">
      View birth and death charts
    </button>
  </div>

  <script>
    "use strict";

    const API_URL =
      "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/12dy.px";

    const FIRST_YEAR = 2000;
    const LAST_YEAR = 2021;
    const COUNTRY_CODE = "SSS";
    const COUNTRY_NAME = "whole country";

    let areaOptions = [];
    let currentAreaCode = COUNTRY_CODE;
    let currentAreaName = COUNTRY_NAME;
    let chartLabels = [];
    let populationValues = [];
    let populationChart = null;

    function getYearValues() {
      const years = [];

      for (
        let year = FIRST_YEAR;
        year <= LAST_YEAR;
        year++
      ) {
        years.push(String(year));
      }

      return years;
    }

    async function fetchMunicipalityOptions() {
      // GET request: retrieve municipality codes and names.
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Could not load municipality names from Statistics Finland."
        );
      }

      const metadata = await response.json();

      const areaVariable = metadata.variables.find(
        variable => variable.code === "alue_23_20260101"
      );

      if (!areaVariable) {
        throw new Error(
          "The municipality variable was not found in the API metadata."
        );
      }

      areaOptions = areaVariable.values.map((code, index) => ({
        code: code,
        name: areaVariable.valueTexts[index]
      }));

      return areaOptions;
    }

    function buildPopulationRequest(areaCode) {
      return {
        query: [
          {
            code: "timeperiod_y",
            selection: {
              filter: "item",
              values: getYearValues()
            }
          },
          {
            code: "alue_23_20260101",
            selection: {
              filter: "item",
              values: [areaCode]
            }
          },
          {
            code: "contentscode",
            selection: {
              filter: "item",
              values: ["synt-vaesto"]
            }
          }
        ],
        response: {
          format: "json-stat2"
        }
      };
    }

    async function fetchPopulation(areaCode) {
      // POST request: retrieve population data.
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          buildPopulationRequest(areaCode)
        )
      });

      if (!response.ok) {
        throw new Error(
          "The population request failed. Please try again."
        );
      }

      const result = await response.json();

      if (!Array.isArray(result.value)) {
        throw new Error(
          "The API response did not contain population values."
        );
      }

      return result.value.map(value =>
        value === null ? 0 : Number(value)
      );
    }

    function drawPopulationChart() {
      const chartContainer = document.getElementById("chart");

      // Clear the old chart before drawing the new one.
      chartContainer.innerHTML = "";

      populationChart = new frappe.Chart("#chart", {
        title: "Population growth in " + currentAreaName,

        data: {
          labels: chartLabels,
          datasets: [
            {
              name: "Population",
              values: populationValues
            }
          ]
        },

        type: "line",
        height: 450,
        colors: ["#eb5146"],

        axisOptions: {
          xAxisMode: "tick",
          yAxisMode: "span",
          xIsSeries: true
        },

        lineOptions: {
          regionFill: 0,
          hideDots: 0
        }
      });
    }

    function saveSelectedArea() {
      // Share the selected municipality with newchart.html.
      sessionStorage.setItem(
        "selectedAreaCode",
        currentAreaCode
      );

      sessionStorage.setItem(
        "selectedAreaName",
        currentAreaName
      );
    }

    async function loadArea(areaCode, areaName) {
      const status = document.getElementById("status");
      const submitButton = document.getElementById("submit-data");

      status.textContent = "Loading population data...";
      submitButton.disabled = true;

      try {
        const values = await fetchPopulation(areaCode);

        currentAreaCode = areaCode;
        currentAreaName = areaName;

        chartLabels = getYearValues();
        populationValues = values;

        saveSelectedArea();
        drawPopulationChart();

        status.textContent =
          "Showing population data for " + currentAreaName + ".";

      } catch (error) {
        status.textContent = error.message;

      } finally {
        submitButton.disabled = false;
      }
    }

    function findArea(searchText) {
      const cleanedSearch =
        searchText.trim().toLocaleLowerCase();

      if (
        cleanedSearch === "" ||
        cleanedSearch === COUNTRY_NAME
      ) {
        return {
          code: COUNTRY_CODE,
          name: COUNTRY_NAME
        };
      }

      // Match municipality names without case sensitivity.
      return areaOptions.find(
        area =>
          area.name.toLocaleLowerCase() === cleanedSearch
      ) || null;
    }

    document
      .getElementById("municipality-form")
      .addEventListener("submit", async function(event) {
        event.preventDefault();

        const searchText =
          document.getElementById("input-area").value;

        const selectedArea = findArea(searchText);

        if (!selectedArea) {
          document.getElementById("status").textContent =
            "Municipality not found. Check the spelling and try again.";
          return;
        }

        // Replace the existing chart data with the selected area.
        await loadArea(
          selectedArea.code,
          selectedArea.name
        );
      });

    document
      .getElementById("add-data")
      .addEventListener("click", function() {
        if (populationValues.length < 2) {
          document.getElementById("status").textContent =
            "At least two data points are needed to make a prediction.";
          return;
        }

        // Calculate the total change between consecutive data points.
        let totalChange = 0;

        for (
          let index = 1;
          index < populationValues.length;
          index++
        ) {
          totalChange +=
            populationValues[index] -
            populationValues[index - 1];
        }

        // Calculate the mean change.
        const meanChange =
          totalChange / (populationValues.length - 1);

        // Add the mean change to the last data point.
        const lastValue =
          populationValues[populationValues.length - 1];

        const predictedValue = lastValue + meanChange;

        populationValues.push(predictedValue);

        // Add the next year to the chart labels.
        const lastYear =
          Number(chartLabels[chartLabels.length - 1]);

        chartLabels.push(String(lastYear + 1));

        drawPopulationChart();

        document.getElementById("status").textContent =
          "Added an estimated population point for " +
          chartLabels[chartLabels.length - 1] + ".";
      });

    document
      .getElementById("navigation")
      .addEventListener("click", function() {
        saveSelectedArea();
        window.location.href = "newchart.html";
      });

    async function initialize() {
      try {
        await fetchMunicipalityOptions();

      } catch (error) {
        document.getElementById("status").textContent =
          error.message;
        return;
      }

      document.getElementById("input-area").value = COUNTRY_NAME;

      await loadArea(
        COUNTRY_CODE,
        COUNTRY_NAME
      );
    }

    initialize();
  </script>
</body>
</html>
