import React, { useState, useContext, useRef, useEffect } from "react";
import ApiContext from "../../../../ApiContext";
import "react-quill-new/dist/quill.snow.css";

import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from "@coreui/react";

import AppearanceSettings from "./Appearance/AppearanceSettings";
import SystemSettings from "./System/SystemSettings";

const AdminSettings = () => {
    const api = useContext(ApiContext);

    const [activeTab, setActiveTab] = useState(null);
    const [activeSubTab, setActiveSubTab] = useState(null);
    const [subTabs, setSubTabs] = useState([]);

    const appearanceSettingsRef = useRef(null);
    const systemSettingsRef = useRef(null);

    const scrollToElement = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const getSubTabs = (settingsComponent) => {
        if (!settingsComponent.current) {
            return [];
        }

        const subTabs = [];
        Array.from(settingsComponent.current.children).forEach((child) => {
            if (child.id && child.getAttribute("label")) {
                subTabs.push({ id: child.id, label: child.getAttribute("label") });
            }
        });
        return subTabs;
    };

    useEffect(() => {
        if (activeTab === "appearance") {
            setSubTabs(getSubTabs(appearanceSettingsRef));
        } else if (activeTab === "system") {
            setSubTabs(getSubTabs(systemSettingsRef));
        } else {
            setSubTabs([]);
        }
    }, [activeTab]);

    return (
        <div className="body flex-grow-1" style={{ margin: "30px", display: "flex" }}>
            <div style={{ flex: 1, marginRight: "20px" }}>
                <CNav variant="tabs" role="tablist">
                    <CNavItem>
                        <CNavLink
                            style={{ cursor: "pointer" }}
                            active={activeTab === "appearance"}
                            onClick={() => setActiveTab("appearance")}
                        >
                            Настройки внешнего вида
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            style={{ cursor: "pointer" }}
                            active={activeTab === "system"}
                            onClick={() => setActiveTab("system")}
                        >
                            Системные настройки
                        </CNavLink>
                    </CNavItem>
                </CNav>
                <CTabContent>
                    <CTabPane visible={activeTab === "appearance"}>
                        <AppearanceSettings api={api} ref={appearanceSettingsRef} />
                    </CTabPane>
                    <CTabPane visible={activeTab === "system"}>
                        <SystemSettings api={api} ref={systemSettingsRef} />
                    </CTabPane>
                </CTabContent>
            </div>
            <div style={{ width: "250px", backgroundColor: "#f8f9fa", padding: "20px", borderLeft: "1px solid #dee2e6", position: "fixed", top: "60px", right: "30px" }}>
                <h5>Навигация</h5>
                <CNav style={{ flexDirection: "column" }}>
                    {activeTab ? (
                        subTabs.map((subTab) => (
                            <CNavItem key={subTab.id}>
                                <CNavLink
                                    href={`#${subTab.id}`}
                                    onClick={() => { setActiveSubTab(subTab.id); scrollToElement(subTab.id); }}
                                >
                                    {subTab.label}
                                </CNavLink>
                            </CNavItem>
                        ))
                    ) : (
                        <>
                            <CNavItem>
                                <CNavLink href="#" onClick={() => setActiveTab("appearance")}>
                                    Настройки внешнего вида
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="#" onClick={() => setActiveTab("system")}>
                                    Системные настройки
                                </CNavLink>
                            </CNavItem>
                        </>
                    )}
                </CNav>
            </div>
        </div>
    );
};

export default AdminSettings;