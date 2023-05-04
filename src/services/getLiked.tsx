//get liked from localStorag

export default async function getLiked() {
  const liked = JSON.parse(localStorage.getItem("liked") || "[]");
  return liked;
}
