import React, { Suspense } from "react";

import { CContainer, CSpinner } from "@coreui/react";

// routes config

const AppContent = ({ items }) => {
    if (!items) {
        return <></>;
    }
    return (
        <CContainer className="px-4" lg>
            <Suspense fallback={<CSpinner color="primary" />}></Suspense>
            {items.map((item) => (
                <div key={item.id}>
                    {item.id} -- {item.name} -- {item.duration}
                </div>
            ))}
        </CContainer>
    );
};

export default React.memo(AppContent);
