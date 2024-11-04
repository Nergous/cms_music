// src/ApiContext.js
import React from "react";

const ApiContext = React.createContext();

export const ApiProvider = ({ children }) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    if (!apiUrl) {
        throw new Error("REACT_APP_API_URL is not defined");
    }

    return <ApiContext.Provider value={apiUrl}>{children}</ApiContext.Provider>;
};

export default ApiContext;
