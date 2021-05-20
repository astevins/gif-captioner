import React from "react";
import "../stylesheets/App.scss";
import GifUploader from "./GifUploader";

function App() {
    return (
        <div className="app-container">
            <h1>Gif Captioner</h1>
            <GifUploader onGifUpload={() => {
                return;
            }}/>
            <div className="attribution-footer">
                <p>
                    Icons made by
                    <a href="https://www.freepik.com" title="Freepik">Freepik</a>
                    from
                    <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com </a>
                </p>
            </div>
        </div>
    );
}

export default App;
