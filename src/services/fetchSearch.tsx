export default async function fetchSearch(query: string) {
  try {
    const response = await fetch(`https://spsotify-back-ok.onrender.com/searchfast/${query}`);
    if (response.ok) {
      const data = await response.json();
      //sort by popularity
      data.sort((a: any, b: any) => {
        return b.popularity - a.popularity;
      });
      return data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
