import { useEffect } from "react";

function useBlurInputOnClickOutside(ref) {
  useEffect(() => {
    function handleClickOutside(event) {
      const activeElement = document.activeElement;
      if (ref.current && !ref.current.contains(event.target) && activeElement.tagName === "INPUT") {
        activeElement.blur();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default useBlurInputOnClickOutside;
