//
//  Interfaces, Types & Enums
//

interface Listing {
  id: number;
  poster_path: string;
  title: string;
  name: string;
  vote_average: number;
}

type ListingGenre = {
  id: string;
  name: string;
};

interface ListingDetails extends Listing {
  backdrop_path: string;
  genres: ListingGenre[];
  homepage: string;
  overview: string;
  tagline: string;
}

interface MovieDetails extends ListingDetails {
  runtime: number;
  release_date: string;
}

interface TvShowDetails extends ListingDetails {
  first_air_date: string;
  in_production: boolean;
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
}

enum ListType {
  MOVIE = "movie",
  TV = "tv",
}

//
//  Globals
//

const API = "https://api.themoviedb.org/3";
const IMGAPI = "https://image.tmdb.org/t/p";

let selectedType = ListType.MOVIE;

const placeholderCard = `
  <div class="col-6 col-md-3 my-3">
    <div class="p-2 bg-body bg-opacity-10 rounded position-relative h-100 placeholder-glow">
      <div class="position-absolute top-0 start-0 m-3 bg-black bg-opacity-50 rounded p-2 text-warning">
        <i class="fa-regular fa-star"></i>
        <span class="placeholder rounded">5.0</span>
      </div>

      <img src="https://placehold.co/220x330" class="w-100 rounded mb-2 placeholder">

      <p class="p-2 m-0 placeholder rounded w-75"></p>
    </div>
  </div>`;

let placehorderCardList = "";
for (let i = 0; i < 4; i++) {
  placehorderCardList += placeholderCard;
}

//
//  Functions
//

function CardElementFactory(listing: Listing) {
  const title = listing.name || listing.title;

  return `
    <div class="col-6 col-md-3 my-3">
      <div id=${
        listing.id
      } class="p-2 bg-body bg-opacity-10 rounded position-relative h-100">
        <div class="position-absolute top-0 start-0 m-3 bg-black bg-opacity-50 rounded px-2 py-1 text-warning">
          <i class="fa-regular fa-star"></i>
          <span>${listing.vote_average.toFixed(1)}</span>
        </div>  
      
        <img 
          src=${IMGAPI}/w500/${listing.poster_path} alt=${title + " poster"} 
          class="w-100 rounded mb-2">
        
        <h6 class="p-2 m-0">
          <a href="/details.html?type=${selectedType}&id=${listing.id}"
            class="text-decoration-none text-light fs-5"
          >
            ${title}
          </a>
        </h6>
      </div>
    </div>`;
}

async function LoadList(
  url: string,
  options: RequestInit
): Promise<{ list: Listing[]; total_pages: number }> {
  try {
    const res = await fetch(url, options);

    const { results, total_pages } = await res.json();

    return { list: results, total_pages };
  } catch (err) {
    console.error(err);
    return { list: [], total_pages: 1 };
  }
}

async function LoadListingDetails(
  url: string,
  options: RequestInit
): Promise<ListingDetails | null> {
  try {
    const res = await fetch(url, options);

    const listing = await res.json();

    return listing;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function DisplayList(list: Listing[], container: HTMLElement) {
  if (list.length === 0) return;

  container!.innerHTML = "";

  list.forEach((listItem) => {
    container!.innerHTML += CardElementFactory(listItem);
  });
}
