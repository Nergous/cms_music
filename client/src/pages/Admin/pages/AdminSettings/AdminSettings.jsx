import React, { useState, useContext } from "react";
import ApiContext from "../../../../ApiContext";
import "react-quill-new/dist/quill.snow.css";

import { CButton } from "@coreui/react";

import AppearanceSettings from "./Appearance/AppearanceSettings";
import SystemSettings from "./System/SystemSettings";

const AdminSettings = () => {
    const api = useContext(ApiContext);

    const [activeTab, setActiveTab] = useState("appearance");
    
    return (
        <>
            <div className="body flex-grow-1" style={{ margin: "30px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <CButton
                        color={activeTab === "appearance" ? "primary" : "secondary"}
                        onClick={() => setActiveTab("appearance")}
                        style={{ marginRight: "10px" }}
                    >
                        Внешний вид
                    </CButton>
                    <CButton
                        color={activeTab === "system" ? "primary" : "secondary"}
                        onClick={() => setActiveTab("system")}
                    >
                        Настройки системы
                    </CButton>
                </div>
                {activeTab === "appearance" && (
                    <AppearanceSettings api={api} />
                )}
                {activeTab === "system" && (
                    <SystemSettings api={api} />
                )}
            </div>
        </>
    );
};

export default AdminSettings;
