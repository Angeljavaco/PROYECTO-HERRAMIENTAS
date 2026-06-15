export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/OnlineStoreApp";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
