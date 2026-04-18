import { useEffect } from "react";

const useTitle = (title: string) => {
  useEffect(() => {
    if (document.title === title) return;
    const prevTitle = document.title;
    document.title = title;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useTitle;
