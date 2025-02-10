// src/components/Blocks/TextBlock.js
import React, { useState, useEffect } from 'react';
import BlockInterface from '../BlockInterface';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { CRow, CCol, CButton, CAlert } from '@coreui/react';

class TextBlock extends BlockInterface {
    render({ edit: editBlock, delete: deleteBlock }) {
        return <TextBlockComponent id={this.id} content={this.content} onEdit={editBlock} onDelete={deleteBlock} />;
    }
}

const TextBlockComponent = ({ id, content, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(content);
    const [textColor, setTextColor] = useState("#000000"); // Цвет текста по умолчанию
    const [textAlign, setTextAlign] = useState("left"); // Выравнивание текста по умолчанию
    const [textError, setTextError] = useState("");
    const [textSuccess, setTextSuccess] = useState("");

    useEffect(() => {
        setText(content);
    }, [content]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onEdit(id, text, textColor, textAlign);
        setIsEditing(false);
        setTextSuccess("Текст успешно сохранен");
        setTimeout(() => setTextSuccess(""), 3000);
    };

    const handleDelete = () => {
        onDelete(id);
    };

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ];

    return (
        <CRow>
            <CCol>
                <div className="border p-3">
                    {textError && (
                        <CAlert color="danger">{textError}</CAlert>
                    )}
                    {textSuccess && (
                        <CAlert color="success">{textSuccess}</CAlert>
                    )}
                    {isEditing ? (
                        <div style={{ width: '100%' }}>
                            <ReactQuill
                                theme="snow"
                                value={text}
                                onChange={setText}
                                modules={{ toolbar: toolbarOptions }}
                                style={{ height: 'auto', backgroundColor: 'white', color: 'black' }}
                            />
                            <CButton color="primary" onClick={handleSave} className="mt-3">Сохранить</CButton>
                        </div>
                    ) : (
                        <div>
                            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: text }} />
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

export default TextBlock;