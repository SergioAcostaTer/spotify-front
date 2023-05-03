// import * as zip from "https://deno.land/x/zipjs/index.js";

async function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export default async function downloadSong(id: string, title: string) {
  const response = await fetch(
    `https://spsotify-back-ok.onrender.com/getAudioBlob/${id}/${title}`
  );

  // console.log(data);
  const blob = await response.blob();
  const newBlob = new Blob([blob]);

  const songBlob = (await blobToBase64(newBlob)) as string;
  var fileSizeInByte = blob.size;
  const result = {
    blob: songBlob.split(",")[1],
    name: `${title}.mp3`,
    size: fileSizeInByte,
  };
  console.log(result);
  //   return result;

  const blobUrl = window.URL.createObjectURL(newBlob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", `${title}.mp3`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);

  // clean up Url
  window.URL.revokeObjectURL(blobUrl);

  return result;
}
