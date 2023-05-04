export default async function addLiked(item: Object) {
  //add on localstorage and parse it

  //exclude audioBlob from item
  item = {
    ...item,
    audioBlob: undefined,
  };

  const liked = JSON.parse(localStorage.getItem("liked") || "[]");

  //check if item already exists

  const exists = liked.find((i: any) => i.id === item?.id);

  //if exist remove it

  if (exists) {
    const filtered = liked.filter((i: any) => i.id !== item?.id);
    localStorage.setItem("liked", JSON.stringify(filtered));
    return;
  } else {
    if (liked) {
      liked.unshift(item);
      localStorage.setItem("liked", JSON.stringify(liked));
    } else {
      localStorage.setItem("liked", JSON.stringify([item]));
    }
  }
}
