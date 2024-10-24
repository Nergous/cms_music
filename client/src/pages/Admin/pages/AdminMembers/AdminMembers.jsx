import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { AppSidebar, AppFooter, AppHeader } from "../../components";
import CardsMembers from "../AdminMembers/CardsMembers";
import EditMembers from "../AdminMembers/EditMembers";

const AdminMembers = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get("/api/members").then((response) => {
            setItems(response.data);
        });
    }, []);

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />

                <div className="body flex-grow-1">
                    <Button variant="info" style={{ margin: "30px" }}>
                        <Link to="/admin/members/create" style={{ textDecoration: "none", color: "white" }}> Добавить участника </Link>
                    </Button>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            // margin: "20px",
                            flexWrap: "wrap",
                            // padding: "20px",
                        }}
                    >
                        {items.map((item) => (
                            <CardsMembers
                                key={item.id}
                                item={item}
                            ></CardsMembers>
                        ))}
                    </div>
                </div>
                <AppFooter />
            </div>
            <Routes>
                <Route path=":id/edit" element={<EditMembers />} />
            </Routes>
        </>
    );
};

export default AdminMembers;
