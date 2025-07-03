(function () {
  //
  //  Interfaces, Types & Enums
  //

  type Listing = {
    id: number;
    overview: string;
    poster_path: string;
    title: string;
    name: string;
    vote_average: number;
  };

  enum ListType {
    MOVIE = "movie",
    TV = "tv",
  }

  //
  //  Globals
  //

  let list: Listing[] = [];
  let selectedType = ListType.MOVIE;
  let currentPage = 1;
  let totalPages = 1;
  const API = "https://api.themoviedb.org/3";
  const IMGAPI = "https://image.tmdb.org/t/p/w500";

  const placeholderCard = `
  <div class="col-7 col-md-4 col-xl-3 my-3">
    <div class="p-2 bg-body bg-opacity-10 rounded position-relative h-100 placeholder-glow">
      <div class="position-absolute top-0 start-0 m-3 bg-black bg-opacity-50 rounded p-2 text-warning">
        <i class="fa-regular fa-star"></i>
        <span class="placeholder">5.0</span>
      </div>

      <img src="https://placehold.co/220x330" class="w-100 rounded mb-2 placeholder">

      <p class="p-1 m-0 placeholder w-75"></p>
    </div>
  </div>`;

  let placehorderCardList = "";

  //
  //  Elements
  //

  const listContainer = document.getElementById("list-container");
  const pageNumIndicator = document.getElementById("pageNum");

  //
  //  Event Handlers
  //
  document
    .getElementById("pageNum-container")
    ?.addEventListener("click", (ev) => {
      const target = ev.target as HTMLElement;

      if (target.tagName === "BUTTON") {
        if (target.innerText === "Next") {
          if (currentPage < totalPages) {
            currentPage++;
          }
        } else if (currentPage != 1) {
          currentPage--;
        }

        LoadPageContent();
      }
    });

  //
  //  Functions
  //

  function CardElementFactory(title: string, imageURL: string, rating: string) {
    return `
      <div class="col-6 col-md-4 col-lg-3 my-3">
        <div class="p-2 bg-body bg-opacity-10 rounded position-relative h-100">
          <div class="position-absolute top-0 start-0 m-3 bg-black bg-opacity-50 rounded px-2 py-1 text-warning">
            <i class="fa-regular fa-star"></i>
            <span>${rating}</span>
          </div>  
        
          <img 
            src=${imageURL} alt=${title + " poster"} 
            class="w-100 rounded mb-2">
          
          <p class="p-1 m-0">${title}</p>
        </div>
      </div>`;
  }

  async function LoadList(type: ListType, pageNum: number) {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2ZmNGY3MTJjYTE1ZmI4ZDk4NmE0YWIxMTEyMjNmOCIsIm5iZiI6MTc1MTQ4ODkxMy4xMDMwMDAyLCJzdWIiOiI2ODY1OTk5MTk5ZWQ0NmZjYzA4ZTYzNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.slUGFh5HytfKT5sGJkK2XTkYXRkKv2wqBfAIqg_6wis",
      },
    };

    const url = `${API}/discover/${type}?language=en-US&page=${pageNum}&sort_by=popularity.desc`;

    try {
      const res = await fetch(url, options);

      const { results, total_pages } = await res.json();

      list = results;
      totalPages = total_pages;
    } catch (err) {
      console.error(err);
    }
  }

  function DisplayLists() {
    listContainer!.innerHTML = "";

    list.forEach((listItem) => {
      listContainer!.innerHTML += CardElementFactory(
        selectedType === ListType.MOVIE ? listItem.title : listItem.name,
        `${IMGAPI}${listItem.poster_path}`,
        listItem.vote_average.toFixed(1)
      );
    });
  }

  async function LoadPageContent() {
    await LoadList(selectedType, currentPage);

    pageNumIndicator!.innerText = `${currentPage.toString()} / ${totalPages.toString()}`;

    DisplayLists();
  }

  //
  //  Script start
  //

  const urlSearchParams = new URLSearchParams(window.location.search);
  const { type } = Object.fromEntries(urlSearchParams.entries());

  if (type === "tv") {
    selectedType = ListType.TV;
    document.querySelector("title")!.innerText = `Moviepedia-TV Shows`;
    document.getElementById("header-title")!.innerText = `TV Shows`;
  } else {
    selectedType = ListType.MOVIE;
    document.querySelector("title")!.innerText = `Moviepedia-Movies`;
    document.getElementById("header-title")!.innerText = `Movies`;
  }

  for (let i = 0; i < 12; i++) {
    placehorderCardList += placeholderCard;
  }

  listContainer!.innerHTML = placehorderCardList;

  LoadPageContent();
})();
