// Get the search form
const searchForm = document.getElementById("search-form");

// Get the input field
const inputShow = document.getElementById("input-show");

// Get the container for the search results
const showContainer = document.querySelector(".show-container");


// Listen for form submission
searchForm.addEventListener("submit", function (event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get the search term
    const searchValue = inputShow.value;

    // Fetch data from TVMaze
    fetch("https://api.tvmaze.com/search/shows?q=" + searchValue)

        // Convert response to JSON
        .then(function (response) {
            return response.json();
        })

        // Process the data
        .then(function (data) {

            // Remove previous results
            showContainer.innerHTML = "";

            // Go through every search result
            data.forEach(function (item) {

                // Get the show object
                const show = item.show;

                // Get the image URL
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

                // Add the show to the page
                showContainer.innerHTML += showHTML;
            });
        })

        // Handle errors
        .catch(function (error) {
            console.error("Error fetching TV show data:", error);
        });

});