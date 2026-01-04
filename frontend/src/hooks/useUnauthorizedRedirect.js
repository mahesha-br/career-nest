import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useUnauthorizedRedirect = (setIsLogin) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsLogin(false);
      navigate("/login", { replace: true });
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [navigate, setIsLogin]);
};

export default useUnauthorizedRedirect;
