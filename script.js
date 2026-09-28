// Get the form
const searchForm = document.getElementById("search-form");

// Get the input field
const inputShow = document.getElementById("input-show");

// Get the container where shows will be displayed
const showContainer = document.querySelector(".show-container");


// Listen for form submission
searchForm.addEventListener("submit", function(event) {

    // Prevent the browser from refreshing the page
    event.preventDefault();

    // Get the value typed by the user
    const searchValue = inputShow.value;

    // Fetch data from TVMaze API
    fetch("https://api.tvmaze.com/search/shows?q=" + searchValue)

        // Convert response to JSON
        .then(function(response) {
            return response.json();
        })

        // Use the received data
        .then(function(data) {

            // Remove previous search results
            showContainer.innerHTML = "";

            // Loop through every result
            data.forEach(function(item) {

                // The actual TV show is inside item.show
                const show = item.show;

                // Get image
                let imageURL = "";

                if (show.image && show.image.medium) {
                    imageURL = show.image.medium;
                }

                // Create HTML for the show
                const showHTML = `
                    <div class="show-data">

                        <img
                            src="${imageURL}"
                            alt="${show.name}"
                        >

                        <div class="show-info">

                            <h1>${show.name}</h1>

                            ${show.summary}

                        </div>

                    </div>
                `;

                // Add the show to the container
                showContainer.innerHTML += showHTML;
            });
        })

        // Handle errors
        .catch(function(error) {
            console.error("Error fetching data:", error);
        });
});