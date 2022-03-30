
const WIKIPEDIA_URL = 'https://en.wikipedia.org/?curid=';
const WIKIPEDIA_FIRST_PARAGRAPH_URL = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&explaintext=&exsectionformat=plain&origin=*&pageids=';
const wiki_check_size = 10;
const WIKIPEDIA_PARAGRAPH_API_URL_PREFIX = 'https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit='+wiki_check_size+'&srsearch=';
const WIKIPEDIA_PARAGRAPH_API_URL_POSTFIX = '+incategory:English-language_films';
const IMDB_URL = 'https://www.imdb.com/title/';
const RAPID_API_KEY = 'b4b93bf448msh6beb7313cda0213p16670fjsn23ffae9f6f17';
const RAPID_API_URL = 'https://imdb-data-searching.p.rapidapi.com/om?t=';

function returnResponse (response: any){
    // console.log(response);
    return response;
}

function logError (error: any){
    console.log(error);
}

async function translateJSON (response: any){
    // console.log(response);
    return response.json();
}

export default class API {

    public static async getWikipediaPageId(movieTitle: string): Promise<string | null> {
        try {
            const wikipediaData = await this.getWikipediaData(movieTitle);
            // console.log("wikipediaData", wikipediaData);
            const movieData = wikipediaData?.query?.search.find((movieData: any) => {
                return (movieData.title === movieTitle) ||
                    (movieData.title === movieTitle + " (film)") ||
                    new RegExp("^ [(]" + "[0-9][0-9][0-9][0-9]" + " film[)]$").test(movieData.title.replace(movieTitle, ''))
            });
            // console.log("movieData", movieData);
            if (movieData){
                return movieData.pageid;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    public static async getWikipediaFirstParagraph(movieId: string){
        try {
            const wikipediaParagraphData = await this.getWikipediaParagraphData(movieId);
            // console.log("wikipediaParagraphData", wikipediaParagraphData);
            return wikipediaParagraphData?.query?.pages[movieId]?.extract;
        } catch {
            return null;
        }
    }

    public static async getWikipediaParagraphData(movieId: string){
        try{
            return await fetch(WIKIPEDIA_FIRST_PARAGRAPH_URL + movieId,
                {
                    method: 'GET'
                })
                .then(translateJSON)
                .then(returnResponse);
        } catch {
            return null;
        }
    }

    public static async getWikipediaData(movieTitle: string){
        try{
            return await fetch(
                WIKIPEDIA_PARAGRAPH_API_URL_PREFIX + movieTitle.replaceAll(' ', '%20') + WIKIPEDIA_PARAGRAPH_API_URL_POSTFIX,
                {
                    method: 'GET',
                })
                .then(translateJSON)
                .then(returnResponse);
        } catch {
            return null;
        }
    }

    public static async getImdbLink(movieTitle: string) {
        const imdbId = await this.getImdbId(movieTitle);
        // console.log("imdbId", imdbId);
        return imdbId && IMDB_URL + imdbId;
    }

    public static async getImdbId(movieTitle: string): Promise<string | null>{
        try{
            const rapidApiData = await this.getRapidApiData(movieTitle);
            // console.log("rapidApiData: ", rapidApiData);
            if (rapidApiData.Title === movieTitle){
                return rapidApiData.imdbID;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    public static async getWikipediaLink(pageId: string) {
        return pageId && WIKIPEDIA_URL + pageId;
    }

    public static async getRapidApiData(movieTitle: string){
        try{
            return await fetch(RAPID_API_URL + movieTitle.replaceAll(' ', '%20'),
                {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Host': 'imdb-data-searching.p.rapidapi.com',
                        'X-RapidAPI-Key': RAPID_API_KEY
                    }
                })
                .then(translateJSON)
                .then(returnResponse)
                .catch(logError);
        } catch {
            return null;
        }
    }

}




