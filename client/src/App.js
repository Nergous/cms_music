import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyHeader from "./components/header/MyHeader";
import MyFooter from "./components/footer/MyFooter";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter/AppRouter";

import Admin from "./pages/Admin/Admin";

function App() {
    return (
        <div className="App__main">
            <BrowserRouter>
                <Routes>
                    <Route path="/admin/*" element={<Admin />} />

                    <Route
                        path="/*"
                        element={
                            <>
                                <MyHeader />
                                <div className="main__part">
                                    <AppRouter />
                                </div>
                                <MyFooter />
                            </>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
