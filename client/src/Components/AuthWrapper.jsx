import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const LoginSignUp = ({ jsxElement, endPoint, showLogin }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.target.classList.contains("cursor-pointer")) {
      navigate(endPoint);
    }
  };

  return (
    <div className="flex flex-col p-2 ">
      {/* Top Container */}
      <div className="bg--400 rounded-t-2xl flex flex-col items-center">


        <div className="mt-6">{jsxElement}</div>
      </div>
    </div>
  );
};

export default LoginSignUp;
