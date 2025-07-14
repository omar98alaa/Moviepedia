(async function () {
  //
  //  Globals
  //

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
    await LoadAPIKey();

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${APIKey}`,
      },
    };
    let url = `${API}/discover/${selectedType}?language=en-US&page=${currentPage}&sort_by=popularity.desc`;

    const { list, total_pages } = await LoadList(url, options);

    totalPages = total_pages;

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

  await LoadAPIKey();

  LoadPageContent();
})();
