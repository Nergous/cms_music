import React from "react";
import Main from "../../../Main/Main";
import Members from "../../../Members/Members";
import Music from "../../../Music/Music";
import Gigs from "../../../Gigs/Gigs";
import MyHeader from "../../../../components/header/MyHeader";
import MyFooter from "../../../../components/footer/MyFooter";

const PageRenderer = ({ pageName }) => {
    switch (pageName) {
        case "Main":
            return (
                <>
                    <MyHeader />
                    <div style={{ backgroundColor: 'black' }} className="main__part">
                        <Main></Main>
                    </div>
                    <MyFooter />
                </>
            );
        case "Members":
            return (
                <>
                    <MyHeader />
                    <div style={{ backgroundColor: 'black' }} className="main__part">
                        <Members></Members>
                    </div>
                    <MyFooter />
                </>
            );
        case "Music":
            return (
                <>
                    <MyHeader />
                    <div style={{ backgroundColor: 'black' }} className="main__part">
                        <Music></Music>
                    </div>
                    <MyFooter />
                </>
            );
        case "Gigs":
            return (
                <>
                    <MyHeader />
                    <div style={{ backgroundColor: 'black' }} className="main__part">
                        <Gigs></Gigs>
                    </div>
                    <MyFooter />
                </>
            );
        default:
            return null;
    }
};

export default PageRenderer;
