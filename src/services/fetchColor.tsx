

export default async function fetchColor(img: string) {
  // avoid empty img
  if (!img) {
    return;
  }
  const response = await fetch(`https://spsotify-back-ok.onrender.com/color`, {
    method: "POST",
    body: JSON.stringify({ img }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  console.log(response);
  return response;
}
