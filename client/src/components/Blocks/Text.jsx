// src/components/Text/Text.js
import React from 'react';

const Text = ({ content }) => {
    return (
        <div className='ql-editor' dangerouslySetInnerHTML={{ __html: content }} />
    );
};

export default Text;