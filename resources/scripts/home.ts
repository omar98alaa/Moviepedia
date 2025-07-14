(async function () {
  //
  //  Globals
  //

  let trendingList: Listing[] = [];
  let popularList: Listing[] = [];

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

  async function LoadPageContent() {
    let url = "";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${APIKey}`,
      },
    };

    url = `${API}/trending/${selectedType}/week?language=en-US`;
    trendingList = (await LoadList(url, options))["list"];

    url = `${API}/${selectedType}/popular?language=en-US&page=1`;
    popularList = (await LoadList(url, options))["list"];

    DisplayList(trendingList, trendingListContainer!);
    DisplayList(popularList, popularListContainer!);
  }

  //
  //  Script start
  //

  trendingListContainer!.innerHTML = placehorderCardList;
  popularListContainer!.innerHTML = placehorderCardList;

  await LoadAPIKey();

  LoadPageContent();
})();
