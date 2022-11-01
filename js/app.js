const resultsId = document.querySelector('#results');
const resultsNumber = document.querySelector('.results-number');
const comicCover = document.querySelector('.comic-cover');
const comicTitle = document.querySelector('.comic-title');
const comicPublished = document.querySelector('.comic-published');
const comicWriters = document.querySelector('.comic-writers');
const comicDescription = document.querySelector('.comic-description');
const comicSection = document.querySelector('.comic-section');
const characterSection = document.querySelector('.character-section');
const resultsSection = document.querySelector('.results-section');
const searchButton = document.querySelector('.apply-button');
const characterImg = document.querySelector('.character-portrait');
const characterName = document.querySelector('.character-name');
const characterDescription = document.querySelector('.character-description');
const loaderContainer = document.querySelector('.loader-container'); 
const searchType = document.querySelector('#search-type');
const searchSort = document.getElementById('search-sort');

//*******************************************************************************************************/
//funcion pedir comics y funciones derivadas
const loadComics = async () => {
    showLoader()
    const params = new URLSearchParams(window.location.search);
    const comicsResponse = await getComics(
        params.get('offset') ||  0,
        params.get('order') || "title",
        params.get('query') 
    )
    const data = comicsResponse.data
    const comics = data.results;
    const offset = data.offset;
    const total = data.total
    clearResults()
    updateResultsCount(data.total)
    hideLoader()
    printComics(comics)
    pagination(offset, total - 13)
    updatePagination(offset, total - 13)
}
//funcion pintar comics
const printComics = comics => {
    const params = new URLSearchParams(window.location.search);
    if (comics.length === 0 ){
        resultsId.innerHTML = `<h2 class="no-results">No hemos encontrado resultados</h2>`
    }
    for (const comic of comics) {
        const comicCard = document.createElement('div');
        comicCard.tabIndex = 0;
        comicCard.classList.add('comic');
        comicCard.onclick = () => {
            fetchComic(comic)
        }
        
        comicCard.innerHTML = `
        <div class="comic-img-container">
          <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}" alt="${comic.title}" class="comic-thumbnail" />
          </div>
          <h3 class="comic-title">${comic.title}</h3>`
        resultsId.append(comicCard) 
    }
}
//funcion pintar una card con determinado comic cuando se le da click
const fetchComic = (comic) => {
    showLoader()
    const coverPath = `${comic.thumbnail.path}.${comic.thumbnail.extension}`
    const releaseDate = new Intl.DateTimeFormat().format(
        new Date(comic.dates.find(date => date.type === 'onsaleDate').date)
    )
    const writers = comic.creators.items
    .filter(creator => creator.role === 'writer')
    .map(creator => creator.name)
    .join(', ')
    comicCover.src = coverPath;
    comicTitle.innerHTML = comic.title;
    comicPublished.innerHTML = releaseDate;
    comicWriters.innerHTML = writers;
    comicDescription.innerHTML = comic.description;
    resultsNumber.innerHTML = '0'
    showComicDetails()
    clearResults()
    hideLoader()
}

//*******************************************************************************************************/
// funcion pedir personajes y funciones derivadas
const loadCharacters = async () => {
    const params = new URLSearchParams(window.location.search);
    const charactersResponse = await getCharacters(
        params.get('offset') ||  0, 
        params.get('order') || "name",
        params.get('query') 
    );
    const data = charactersResponse.data
    const characters = data.results;
    const offset = data.offset;
    const total =data.total
    clearResults()
    updateResultsCount(data.total)
    hideLoader()
    printCharacters(characters)
    pagination(offset, total -2)
    updatePagination(offset, total -2);

}
//funcion pintar personajes
const printCharacters = characters => {
    const params = new URLSearchParams(window.location.search);
    if (characters.length === 0 ){
        resultsId.innerHTML = `<h2 class="no-results">No hemos encontrado resultados</h2>`
    }
    for (const character of characters) {
        const characterCard = document.createElement('div');
        characterCard.tabIndex = 0;
        characterCard.classList.add('character');
        characterCard.onclick = () => {
            fetchCharacter(character)
        }
        characterCard.innerHTML = `
                <div class="character-img-container">
                    <img src="${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}" alt="${character.name}" class="character-thumbnail" />
                </div>
                <div class="character-name-container">
                <h3 class="character-name">${character.name}</h3>
                </div>
                `
        resultsId.append(characterCard) 
    }
}
//funcion pintar una card con determinado personaje cuando se le da click
const fetchCharacter = (character) => {
    showLoader()
    const coverPath = `${character.thumbnail.path}.${character.thumbnail.extension}`
    characterImg.src = coverPath
    characterName.innerHTML = character.name
    characterDescription.innerHTML = character.description;
    resultsNumber.innerHTML = '0'
    showCharacterDetails()
    clearResults()
    hideLoader()
}
//funcion cambio de tipo del filtro order
searchType.addEventListener('change', () => {
    if(searchType.value === 'comics'){
        searchSort.innerHTML = `
        <option value="title">A-Z</option>' 
        <option value="-title">Z-A</option>
        <option value="-focDate">Más nuevos</option>
        <option value="focDate">Más viejos</option>'`
    } if(searchType.value === 'characters') {
        searchSort.innerHTML = `
        <option value="name">A-Z</option>
        <option value="-name">Z-A</option>
        `
    }
})

//*******************************************************************************************************/
//funcion de filtros en el formulario 
const formSearch = document.getElementById('search-form');

formSearch.addEventListener('submit', e => {
    e.preventDefault();

    const orderBy = e.target["search-sort"].value;
    const orderType = e.target["search-type"].value;
    const query = e.target["search-input"].value;
    const params = new URLSearchParams(window.location.search);
    params.set('type', orderType)
    params.set('order', orderBy);
    params.set('offset', 0);
    params.set('query', query)
    

    window.location.href = window.location.pathname + '?' + params.toString();
     
})

//*******************************************************************************************************/
//funciones del paginador
const firstPage = document.getElementById('first-page');
const previousPage = document.getElementById('previous-page');
const nextPage = document.getElementById('next-page');
const lastPage = document.getElementById('last-page');

const pagination = (offset, total) =>{
    let = offset;
    firstPage.addEventListener('click', () => {
        offset = 0;
        const params = new URLSearchParams(window.location.search);
        params.set('offset', offset);
        window.location.href = window.location.pathname + '?' + params.toString();
    })
    previousPage.addEventListener('click', () => {
        offset -= 20;
        const params = new URLSearchParams(window.location.search);
        params.set('offset', offset);
        window.location.href = window.location.pathname + '?' + params.toString();
    })
    nextPage.addEventListener('click', () => {
        offset += 20;
        const params = new URLSearchParams(window.location.search);
        params.set('offset', offset);
        window.location.href = window.location.pathname + '?' + params.toString();
    })
    lastPage.addEventListener('click', () => {
        offset = total;
        const params = new URLSearchParams(window.location.search);
        params.set('offset', offset);
        window.location.href = window.location.pathname + '?' + params.toString();
    })
}
//funcion activar/desactivar flechas del paginador
const updatePagination = (offset, total) => {
    if(offset <= 1){
        previousPage.disabled = true;
        firstPage.disabled  = true;
    } else {
        previousPage.disabled = false;
        firstPage.disabled = false;
    } if(offset == total) {
        nextPage.disabled = true;
        lastPage.disabled = true;
    } else {
        nextPage.disabled = false;
        lastPage.disabled = false;
    }
}
//funcion que actualiza el contador 
const updateResultsCount = count => {
    resultsNumber.innerHTML = count;
    resultsCount = count 
}
//funcion limpiar resultados
const clearResults = () => resultsId.innerHTML = '';
//funcion mostrar el cargador
const showLoader = () => loaderContainer.classList.remove('hidden');
//funcion ocultar el cargador
const hideLoader = () => loaderContainer.classList.add('hidden');
//funcion ocultar seccion de comics
const hiddenDetails = () => {
    comicSection.classList.add('hidden');
}
//funcion mostrar detalles de comics
const showComicDetails = () => {
    hiddenDetails()
    comicSection.classList.remove('hidden')
}
//funcion mostrar detalles de personajes
const showCharacterDetails = () => {
    hiddenDetails()
    characterSection.classList.remove('hidden')
}
//funcion buscador
const search = () => {
    showLoader()
    const params = new URLSearchParams(window.location.search)
    if(params.get('type') === 'characters'){
        loadCharacters()
    } else {
        loadComics()
    }
}
//funcion inicio
const inicio = () => {
    searchButton.addEventListener('click', () => {
        search()
    })
    search()
}
inicio()