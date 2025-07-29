
import { useEffect } from "react";
import { useLoader } from "../contexts/LoaderContext";


const RouteChangeLoader = () => {
  const { setLoading } = useLoader();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [ setLoading]);

  return null;
};

export default RouteChangeLoader;
