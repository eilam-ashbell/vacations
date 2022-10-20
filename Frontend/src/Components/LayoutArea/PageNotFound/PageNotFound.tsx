import config from "../../../Utils/Config";
import "./PageNotFound.css";

function PageNotFound(): JSX.Element {
    return (
        <div className="PageNotFound">
            <img src={config.serverStaticsGifs + "beach.gif"} />
            <h1>Oooops...</h1>
            <h2>It's seems like this page is on a VACATION</h2>
        </div>
    );
}

export default PageNotFound;
