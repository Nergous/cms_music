import React, { useState } from 'react';

const EditableBlock = ({ block, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(block.content);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onEdit(block.id, content);
        setIsEditing(false);
    };

    return (
        <div>
            {isEditing ? (
                <div>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                    <button onClick={handleSave}>Сохранить</button>
                </div>
            ) : (
                <div>
                    <div>{block.content}</div>
                    <button onClick={handleEdit}>Редактировать</button>
                    <button onClick={() => onDelete(block.id)}>Удалить</button>
                </div>
            )}
        </div>
    );
};

export default EditableBlock;