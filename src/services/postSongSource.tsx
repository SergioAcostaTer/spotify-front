export default async function postSongSource(song: any) {
  try {
    console.log(song);
    const response = await fetch(
      `https://spsotify-back-ok.onrender.com/sourceMusic`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(song),
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      data?.audio?.allData?.map((song: any) => {
        console.log(song);
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
