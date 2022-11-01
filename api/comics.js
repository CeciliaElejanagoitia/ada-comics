//url y funcion respuesta de comics
const baseURL = "https://gateway.marvel.com/v1/public";
const apiPublic = '18711567b5b83bb31e633c9efddf98ef';

const getComics = async (offset, orderBy, query) => {
    let url = `${baseURL}/comics?apikey=${apiPublic}`
    if(offset) url += `&offset=${offset}` 
    if(orderBy) url += `&orderBy=${orderBy}`
    if(query) url += `&titleStartsWith=${query}`
    const response = await fetch(url)
    const data = await response.json();
    return data;    
}