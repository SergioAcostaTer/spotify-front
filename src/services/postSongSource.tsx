export default async function postSongSource(song: any) {
  const t0 = performance.now();

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

      const t1 = performance.now();
      console.log(`Call to postSongSource took ${t1 - t0} milliseconds.`);
      return data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
