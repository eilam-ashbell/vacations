import { useNavigate } from "react-router-dom";
import config from "../../../Utils/Config";
import "./PageNotFound.css";

function PageNotFound(): JSX.Element {

    const navigate = useNavigate()
    return (
        <div className="PageNotFound">
            <img src={config.serverStaticsGifs + "beach.gif"} />
            <h1>Oooops...</h1>
            <h2>It's seems like this page is on a VACATION</h2>
            <button
                className="btn"
                onClick={() => navigate("/home")}>
                Back Home
            </button>
        </div>
    );
}

export default PageNotFound;
