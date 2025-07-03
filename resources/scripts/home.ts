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

  let trendingList: Listing[] = [];
  let popularList: Listing[] = [];
  let selectedType = ListType.MOVIE;
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

  const typeSelectBtnsContainer = document.getElementById("type-select-btns");
  const trendingListContainer = document.getElementById("trending-list");
  const popularListContainer = document.getElementById("popular-list");

  //
  //  Event Handlers
  //
  typeSelectBtnsContainer?.addEventListener("click", function (e: MouseEvent) {
    const target = e.target as HTMLElement;
    const movieButton = typeSelectBtnsContainer.children[0];
    const tvButton = typeSelectBtnsContainer.children[1];

    let type = selectedType;

    if (target === movieButton) {
      type = ListType.MOVIE;
    } else {
      type = ListType.TV;
    }

    if (type !== selectedType) {
      selectedType = type;

      movieButton.classList.toggle("btn-primary");
      tvButton.classList.toggle("btn-primary");

      trendingListContainer!.innerHTML = placehorderCardList;
      popularListContainer!.innerHTML = placehorderCardList;

      LoadPageContent();
    }
  });

  //
  //  Functions
  //

  function CardElementFactory(title: string, imageURL: string, rating: string) {
    return `
    <div class="col-7 col-md-4 col-xl-3 my-3">
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

  async function LoadList(type: ListType, filter: string) {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2ZmNGY3MTJjYTE1ZmI4ZDk4NmE0YWIxMTEyMjNmOCIsIm5iZiI6MTc1MTQ4ODkxMy4xMDMwMDAyLCJzdWIiOiI2ODY1OTk5MTk5ZWQ0NmZjYzA4ZTYzNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.slUGFh5HytfKT5sGJkK2XTkYXRkKv2wqBfAIqg_6wis",
      },
    };

    let url = "";

    switch (filter) {
      case "trending":
        url = `${API}/trending/${type}/week?language=en-US`;
        break;

      case "popular":
        url = `${API}/${type}/popular?language=en-US&page=1`;
        break;
    }

    try {
      const res = await fetch(url, options);

      const { results } = await res.json();

      switch (filter) {
        case "trending":
          trendingList = results;
          break;

        case "popular":
          popularList = results;
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  function DisplayLists() {
    trendingListContainer!.innerHTML = "";
    popularListContainer!.innerHTML = "";

    trendingList.forEach((trendingListItem) => {
      trendingListContainer!.innerHTML += CardElementFactory(
        selectedType === ListType.MOVIE
          ? trendingListItem.title
          : trendingListItem.name,
        `${IMGAPI}${trendingListItem.poster_path}`,
        trendingListItem.vote_average.toFixed(1)
      );
    });

    popularList.forEach((popularListItem) => {
      popularListContainer!.innerHTML += CardElementFactory(
        selectedType === ListType.MOVIE
          ? popularListItem.title
          : popularListItem.name,
        `${IMGAPI}${popularListItem.poster_path}`,
        popularListItem.vote_average.toFixed(1)
      );
    });
  }

  async function LoadPageContent() {
    await LoadList(selectedType, "trending");
    await LoadList(selectedType, "popular");

    DisplayLists();
  }

  //
  //  Script start
  //

  for (let i = 0; i < 6; i++) {
    placehorderCardList += placeholderCard;
  }

  trendingListContainer!.innerHTML = placehorderCardList;
  popularListContainer!.innerHTML = placehorderCardList;

  LoadPageContent();
})();
