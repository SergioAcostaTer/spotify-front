async function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export default async function postSongSource(song: any) {
  const t0 = performance.now();

  try {
    console.log(song);
    const response = await fetch(`http://localhost:666/sourceMusic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(song),
    });

    //time to get response

    if (response.ok) {
      const data = await response.json();

      const t1 = performance.now();
      console.log(`Call to postSongSource took ${t1 - t0} milliseconds.`);

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
