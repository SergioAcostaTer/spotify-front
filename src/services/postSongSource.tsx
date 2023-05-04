async function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export default async function postSongSource(song: any) {
  //measures time
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

    //time to get response

    if (response.ok) {
      const data = await response.json();

      const t1 = performance.now();

      const response2 = await fetch(
        `https://spsotify-back-ok.onrender.com/getAudioBlob/${data?.youtubeId}/${data?.title}`
      );

      console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);

      const blob = await response2.blob();
      const newBlob = new Blob([blob]);

      const songBlob = (await blobToBase64(newBlob)) as string;

      const audioBlob = `data:audio/mpeg;base64,${songBlob.split(",")[1]}`;
      //add to data
      data.audioBlob = audioBlob;

      //total time
      const t2 = performance.now();
      console.log(`Call to doSomething took ${t2 - t0} milliseconds.`);

      console.log(data);

      return data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
