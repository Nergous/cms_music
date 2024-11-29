import React, { useState } from 'react';

const BlockSettings = ({ blockType, onAdd }) => {
    const [content, setContent] = useState('');

    const handleAdd = () => {
        onAdd({ id: Date.now(), type: blockType, content });
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2>Настройки блока</h2>
            {blockType === 'text' && (
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            )}
            {blockType === 'html' && (
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            )}
            <button onClick={handleAdd} style={{ marginTop: '10px' }}>Добавить блок</button>
        </div>
    );
};

export default BlockSettings;