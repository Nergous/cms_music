import React, { Suspense } from 'react';
import { loadBlockTypes } from "../../utils/loadBlockTypes";

const Container = ({ content: blockList }) => {
    const blockTypes = loadBlockTypes();
    const renderBlock = (block) => {
        const BlockComponent = blockTypes[block.type]?.component;
        if (BlockComponent) {
            const Block = React.lazy(() => import(`./${BlockComponent}`));
            return (
                <Suspense fallback={<div>Загрузка...</div>}>
                    <Block id={block.id} content={block.content} />
                </Suspense>
            );
        }
        return null;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            {blockList.map((block) => (
                <div key={block.id} style={{ marginBottom: "20px" }}>
                    {renderBlock(block)}
                </div>
            ))}
        </div>
    );
};

export default Container;