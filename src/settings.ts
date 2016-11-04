/**
 * Created by KOALA on 28/10/2016.
 */

export default class Settings {
    public static SC_BASE_API_URL: string = "https://mobile-api.senscritique.com";
    public static TMDB_BASE_API_URL: string = "https://api.themoviedb.org/3";
    public static HEADER_TOKEN: string = "X-Access-Token";
    public static TMDB_API_KEY: string = new Buffer("YjUyMjU5MTU3MjExMGVmYjM3MGU0ZjY1YjE1MmYzNTI=", "base64").toString();
}
