const apiKey ="f44cae3064eb6d36aa922d06b473d37f"
const apiEndpoints ="https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original"

const apiPaths = {
    fetchAllCategories: ` ${apiEndpoints}/genre/movie/list?api_key=${apiKey}`,
    fetchMovieList: (id) => `${apiEndpoints}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoints}/trending/all/day?api_key=${apiKey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyDsYNqNduxHL2R8Y9eLIyRDkOTbRRAT4yw`
}


// boots up the app
function init() {
    fetchTrendingMovies();
    fetchAndBulidAllSections();    
}

function fetchTrendingMovies(){
    fetchAndBulidMovieSection(apiPaths.fetchTrending ,'Tranding Now')
    .then(list => {
        const randomIndex = parseInt(Math.random() * list.length)
        buildBannerSection(list[randomIndex]);
    }).catch(err =>{
        console.log(err)
    });
}

function buildBannerSection(movie){
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement('div');
    div.innerHTML = `
    <h2 class="banner-title">${movie.title}</h2>
    <p class="banner-info">Tranding on Netflix | Release - ${movie.release_date}</p>
    <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>
    <div class="action-button-cont">
        <button class="action-button"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path fill="#000000" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>&nbsp;&nbsp;Play</button>
        <button class="action-button"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="#ffffff" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>&nbsp;&nbsp;More Info</button>
    </div>

    `

    div.className = "banner-content container"
    bannerCont.append(div)
}

function fetchAndBulidAllSections() {
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length) {
            categories.forEach(category => {
                fetchAndBulidMovieSection(
                    apiPaths.fetchMovieList(category.id),
                    category.name
                );
            });
        }
        // console.table(categories);
    })
    .catch(err => console.error(err));
}

function fetchAndBulidMovieSection(fetchUrl, categoryName) {
    console.log(fetchUrl ,categoryName);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
        // console.table(res.results)
        const movies = res.results;
        if (Array.isArray(movies) && movies.length) {
            bulidMoviesSection(movies ,categoryName);
        }
        return movies;
    })
    .catch(err => console.error(err))
}

function bulidMoviesSection(list, categoryName){
    console.log(list, categoryName);

    const moviesCont = document.getElementById('movies-cont');
    
    const moviesListHTML = list.map(item => {
        return `
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
            <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    }).join('');

    const moviesSectionHTML =`
            <h2 class="movies-section-heading">${categoryName}<sapn class="explore-nudge">Explore All</sapn></h2>
            <div class="movies-row">
                ${moviesListHTML}
            </div>
    `;

    console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className = 'movies-section';
    div.innerHTML = moviesSectionHTML;

    //append html into movies container
    moviesCont.append(div);
}


function searchMovieTrailer(movieName, iframId) {
    if (!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        console.log(res.items[0])
        const bestResult = res.items[0];
        
        const elements = document.getElementById(iframId);
        console.log(elements, iframId);

        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`

        elements.append(div);
        
    })
    .catch(err=>console.log(err));
}


window.addEventListener('load',function(){
    init();
    window.addEventListener('scroll',function(){
        //header ui update
        const header = document.getElementById('header');
        if(window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})
