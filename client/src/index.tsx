import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.scss';
import App from './components/App';

if (process.env.NODE_ENV === "development") {
    const { initMockServer} = require("./__tests__/mock/mock-server");
    initMockServer("development" );
}

ReactDOM.render(
    <App />,
    document.getElementById("content")
);
