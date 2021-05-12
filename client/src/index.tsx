import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.scss';
import App from './components/App';
import { initMockServer} from "./mock/mock-server";

if (process.env.NODE_ENV === "development") {
    initMockServer("development" );
}

ReactDOM.render(
    <App />,
    document.getElementById("content")
);
