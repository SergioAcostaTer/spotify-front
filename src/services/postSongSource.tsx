async function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}


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

      // console.log(data);

      const response2 = await fetch(
        `https://spsotify-back-ok.onrender.com/getAudioBlob/${data?.youtubeId}/${data?.title}`
      );

      // // console.log(data);
      const blob = await response2.blob();
      const newBlob = new Blob([blob]);
    
      const songBlob = (await blobToBase64(newBlob)) as string;


      console.log(songBlob.split(",")[1])
      // data?.audio?.allData?.map((song: any) => {
      //   console.log(song?.url)
      // });
      // const addBlob = data
      // addBlob.audio.blob = songBlob.split(",")[1]
      // // console.log(songBlob.split(",")[1])
      // return addBlob;
      return data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
