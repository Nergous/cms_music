import React from 'react';

const Html = ({ content }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}} dangerouslySetInnerHTML={{ __html: content }} />
    );
};

export default Html;