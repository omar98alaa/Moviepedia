(function () {
  //
  //  Globals
  //

  let list: Listing[] = [];
  let selectedType = ListType.MOVIE;
  let currentPage = 1;
  let totalPages = 1;

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

  async function LoadPageContent() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2ZmNGY3MTJjYTE1ZmI4ZDk4NmE0YWIxMTEyMjNmOCIsIm5iZiI6MTc1MTQ4ODkxMy4xMDMwMDAyLCJzdWIiOiI2ODY1OTk5MTk5ZWQ0NmZjYzA4ZTYzNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.slUGFh5HytfKT5sGJkK2XTkYXRkKv2wqBfAIqg_6wis",
      },
    };
    let url = `${API}/discover/${selectedType}?language=en-US&page=${currentPage}&sort_by=popularity.desc`;

    const { list, totalPages } = await LoadList(url, options);

    pageNumIndicator!.innerText = `${currentPage.toString()} of ${totalPages.toString()}`;

    DisplayList(list, listContainer!);
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

  listContainer!.innerHTML = placehorderCardList;

  LoadPageContent();
})();
