import React from "react";
import { CCard, CCardBody, CCardTitle, CCardText, CCol, CRow, CButton } from "@coreui/react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div className="body flex-grow-1 p-4">
            <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 2 }} lg={{ cols: 3 }}>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Музыкальные релизы</CCardTitle>
                            <CCardText>Управление музыкальными релизами.</CCardText>
                            <CButton color="primary">
                                <Link to="/admin/music" style={{ textDecoration: "none", color: "white" }}>
                                    Перейти
                                </Link>
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Участники</CCardTitle>
                            <CCardText>Управление участниками.</CCardText>
                            <CButton color="secondary">
                                <Link to="/admin/members" style={{ textDecoration: "none", color: "white" }}>
                                    Перейти
                                </Link>
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Выступления</CCardTitle>
                            <CCardText>Управление выступлениями.</CCardText>
                            <CButton color="success">
                                <Link to="/admin/gigs" style={{ textDecoration: "none", color: "white" }}>
                                    Перейти
                                </Link>
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Роли</CCardTitle>
                            <CCardText>Управление ролями участников.</CCardText>
                            <CButton color="danger">
                                <Link to="/admin/roles" style={{ textDecoration: "none", color: "white" }}>
                                    Перейти
                                </Link>
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Настройки</CCardTitle>
                            <CCardText>Настройки системы.</CCardText>
                            <CButton color="warning">
                                <Link to="/admin/settings" style={{ textDecoration: "none", color: "white" }}>
                                    Перейти
                                </Link>
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
};

export default AdminDashboard;
