//funcion url y respuesta de personajes 
const getCharacters = async (offset, orderBy, query) => {
    let url = `${baseURL}/characters?apikey=${apiPublic}`
    if(offset) url += `&offset=${offset}` 
    if(orderBy) url += `&orderBy=${orderBy}`
    if(query) url += `&nameStartsWith=${query}`
    const response = await fetch(url)
    const data = await response.json();
    return data;    
}

