export default async function checkLike(item: Object) {
  //if item in localstorage return true else return false
  const liked = JSON.parse(localStorage.getItem("liked") || "[]");

  //check if item already exists
  const exists = liked.find((i: any) => i.id === item?.id);
  if (exists) {
    return true;
  } else {
    return false;
  }
}
