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

const API = "https://api.themoviedb.org/3";
const IMGAPI = "https://image.tmdb.org/t/p/w500";

const placeholderCard = `
  <div class="col-6 col-md-3 my-3">
    <div class="p-2 bg-body bg-opacity-10 rounded position-relative h-100 placeholder-glow">
      <div class="position-absolute top-0 start-0 m-3 bg-black bg-opacity-50 rounded p-2 text-warning">
        <i class="fa-regular fa-star"></i>
        <span class="placeholder">5.0</span>
      </div>

      <img src="https://placehold.co/220x330" class="w-100 rounded mb-2 placeholder">

      <p class="p-2 m-0 placeholder w-75"></p>
    </div>
  </div>`;

let placehorderCardList = "";
for (let i = 0; i < 12; i++) {
  placehorderCardList += placeholderCard;
}

//
//  Functions
//

function CardElementFactory(title: string, imageURL: string, rating: string) {
  return `
    <div class="col-6 col-md-3 my-3">
      <div class="p-2 bg-body bg-opacity-10 rounded position-relative h-100">
        <div class="position-absolute top-0 start-0 m-3 bg-black bg-opacity-50 rounded px-2 py-1 text-warning">
          <i class="fa-regular fa-star"></i>
          <span>${rating}</span>
        </div>  
      
        <img 
          src=${imageURL} alt=${title + " poster"} 
          class="w-100 rounded mb-2">
        
        <h6 class="p-2 m-0">${title}</h6>
      </div>
    </div>`;
}

async function LoadList(
  url: string,
  options: RequestInit
): Promise<{ list: Listing[]; totalPages: number }> {
  try {
    const res = await fetch(url, options);

    const { results, total_pages } = await res.json();

    return { list: results, totalPages: total_pages };
  } catch (err) {
    console.error(err);
    return { list: [], totalPages: 1 };
  }
}

function DisplayList(list: Listing[], container: HTMLElement) {
  container!.innerHTML = "";

  list.forEach((listItem) => {
    container!.innerHTML += CardElementFactory(
      listItem.title ? listItem.title : listItem.name,
      `${IMGAPI}${listItem.poster_path}`,
      listItem.vote_average.toFixed(1)
    );
  });
}
