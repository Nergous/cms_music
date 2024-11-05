import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyHeader from "./components/header/MyHeader";
import MyFooter from "./components/footer/MyFooter";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter/AppRouter";
import axios from "axios";
import ApiContext from "./ApiContext";

import Admin from "./pages/Admin/Admin";
import { useEffect, useState, useContext } from "react";

function App() {
    const api = useContext(ApiContext);
    const [font, setFont] = useState("Arial");
    const [fonts, setFonts] = useState([]);
    const [color, setColor] = useState("#ffffff");
        
    useEffect(() => {
        //get font
        const loadFont = async () => {
            try {
                const response = await axios.get(`${api}/admin/font`);
                if (response.data.Font.available_fonts) {
                    setFonts(response.data.Font.available_fonts);
                }
                setFont(response.data.Font.selected_font);
            } catch (error) {
                setFont("Montserrat")
            }
        };

        const fetchColor = async () => {
            try {
                const response = await axios.get(`${api}/admin/colors`);
                setColor(response.data.Colors.backgroundColor);
            } catch (error) {
                setColor("#ffffff")
            }
        };

        fetchColor();
        loadFont();
    },[])

    return (
        <div className="App__main" style={{ fontFamily: `${font}, ${fonts}` }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin/*" element={<Admin />} />

                    <Route
                        path="/*"
                        element={
                            <>
                                <MyHeader />
                                <div style={{ backgroundColor: color }} className="main__part">
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
