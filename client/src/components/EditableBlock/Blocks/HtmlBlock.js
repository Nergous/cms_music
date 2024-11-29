// src/components/Blocks/HtmlBlock.js
import React, { useState } from 'react';
import BlockInterface from '../BlockInterface';
import { CRow, CCol, CButton, CAlert, CFormTextarea } from '@coreui/react';

class HtmlBlock extends BlockInterface {
    render({ edit: editBlock, delete: deleteBlock }) {
        return <HtmlBlockComponent id={this.id} content={this.content} onEdit={editBlock} onDelete={deleteBlock} />;
    }
}

const HtmlBlockComponent = ({ id, content, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [html, setHtml] = useState(content);
    const [htmlError, setHtmlError] = useState("");
    const [htmlSuccess, setHtmlSuccess] = useState("");

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onEdit(id, html);
        setIsEditing(false);
        setHtmlSuccess("HTML успешно сохранен");
        setTimeout(() => setHtmlSuccess(""), 3000);
    };

    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <CRow>
            <CCol>
                <div className="border p-3">
                    {htmlError && (
                        <CAlert color="danger">{htmlError}</CAlert>
                    )}
                    {htmlSuccess && (
                        <CAlert color="success">{htmlSuccess}</CAlert>
                    )}
                    {isEditing ? (
                        <div>
                            <CFormTextarea
                                value={html}
                                onChange={(e) => setHtml(e.target.value)}
                                rows={10}
                            />
                            <CButton color="primary" onClick={handleSave} className="mt-3">Сохранить</CButton>
                        </div>
                    ) : (
                        <div>
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                            <div className="mt-3">
                                <CButton color="secondary" onClick={handleEdit} className="me-2">Редактировать</CButton>
                                <CButton color="danger" onClick={handleDelete}>Удалить</CButton>
                            </div>
                        </div>
                    )}
                </div>
            </CCol>
        </CRow>
    );
};

export default HtmlBlock;