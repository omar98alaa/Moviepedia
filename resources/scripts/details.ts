(function () {
  //
  //  Globals
  //

  let selectedType = ListType.MOVIE;

  //
  //  Elements
  //

  const banner = document.getElementById("banner") as HTMLImageElement;
  const title = document.getElementById("title");
  const poster = document.getElementById("poster") as HTMLImageElement;
  const infoContainer = document.getElementById("info-container");

  //
  //  Event Handlers
  //

  //
  //  Functions
  //

  function MovieInfoFactory(listing: MovieDetails) {
    return `
      <!-- Tagline -->
      <h3>${listing.tagline}</h3>

      <!-- Overview -->
      <p>${listing.overview}</p>

      <!-- Rating -->
      <div>
        <h5>Rating</h5>
        <div class="text-warning">
          <i class="fa-regular fa-star"></i>
          <span>${listing.vote_average.toFixed(1)}</span>
        </div>
      </div>

      <!-- Type -->
      <div>
        <h5>Type</h5>
        <p>Movie</p>
      </div>

      <!-- Release Date -->
      <div>
        <h5>Release Date</h5>
        <p>${listing.release_date}</p>
      </div>

      <!-- Runtime -->
      <div>
        <h5>Runtime</h5>
        <p>${listing.runtime} min</p>
      </div>

      <!-- Genres -->
      <div>
        <h5>Genres</h5>
        <p>${listing.genres.map((g) => g.name).join(", ")}</p>
      </div>
    `;
  }

  function TvShowInfoFactory(listing: TvShowDetails) {
    return `
      <!-- Tagline -->
      <h3>${listing.tagline}</h3>

      <!-- Overview -->
      <p>${listing.overview}</p>

      <!-- Rating -->
      <div>
        <h5>Rating</h5>
        <div class="text-warning">
          <i class="fa-regular fa-star"></i>
          <span>${listing.vote_average.toFixed(1)}</span>
        </div>
      </div>

      <div class="row gap-4">
        <!-- Type -->
        <div class="col-md">
          <h5>Type</h5>
          <p>TV Show</p>
        </div>

        <!-- Status -->
        <div class="col-md">
          <h5>Status</h5>
          <p>${listing.status}</p>
        </div>
      </div>

      <div class="row gap-4">
        <!-- First Air Date -->
        <div class="col-md">
          <h5>First Air Date</h5>
          <p>${listing.first_air_date}</p>
        </div>

        <!-- Last Air Date -->
        <div class="col-md">
          <h5>Last Air Date</h5>
          <p>${listing.last_air_date || "N/A"}</p>
        </div>
      </div>

      <div class="row gap-4">
        <!-- No of Seasons -->
        <div class="col-md">
          <h5>No of Seasons</h5>
          <p>${listing.number_of_seasons}</p>
        </div>

        <!-- No of Episodes -->
        <div class="col-md">
          <h5>No of Episodes</h5>
          <p>${listing.number_of_episodes}</p>
        </div>
      </div>

      <!-- Genres -->
      <div>
        <h5>Genres</h5>
        <p>${listing.genres.map((g) => g.name).join(", ")}</p>
      </div>
    `;
  }

  async function LoadPageContent() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2ZmNGY3MTJjYTE1ZmI4ZDk4NmE0YWIxMTEyMjNmOCIsIm5iZiI6MTc1MTQ4ODkxMy4xMDMwMDAyLCJzdWIiOiI2ODY1OTk5MTk5ZWQ0NmZjYzA4ZTYzNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.slUGFh5HytfKT5sGJkK2XTkYXRkKv2wqBfAIqg_6wis",
      },
    };

    let url = `${API}/${selectedType}/${id}?language=en-US`;

    const listing = await LoadListingDetails(url, options);

    console.log(listing);

    if (listing) {
      DisplayContent(listing);
    }
  }

  function DisplayContent(listing: ListingDetails) {
    banner!.src = `${IMGAPI}/w1920/${listing.backdrop_path}`;
    poster!.src = `${IMGAPI}/w780/${listing.poster_path}`;

    infoContainer!.innerHTML = "";

    if (selectedType === ListType.MOVIE) {
      title!.innerText = listing.title;
      infoContainer!.innerHTML = MovieInfoFactory(listing as MovieDetails);
    } else {
      title!.innerText = listing.name;
      infoContainer!.innerHTML = TvShowInfoFactory(listing as TvShowDetails);
    }
  }

  //
  //  Script start
  //

  const urlSearchParams = new URLSearchParams(window.location.search);
  const { id, type } = Object.fromEntries(urlSearchParams.entries());

  if (type === "tv") {
    selectedType = ListType.TV;
    document.querySelector("title")!.innerText = `Moviepedia-TV Shows`;
  } else {
    selectedType = ListType.MOVIE;
    document.querySelector("title")!.innerText = `Moviepedia-Movies`;
  }

  LoadPageContent();
})();
