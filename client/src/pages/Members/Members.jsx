import React, { useState, useEffect, useCallback, useContext } from "react";
import Modal from "../../components/Modal/Modal";
import Member from "./Member/Member";
import LazyLoad from "react-lazyload";
import cl from "./Members.module.css";
import MemberButton from "./MemberButton";
import Spinner from "../../components/Spinner/Spinner";
import ApiContext from "../../ApiContext";
import axios from "axios";
import { loadBlockTypes } from "../../utils/loadBlockTypes";

const Members = ({ pageName }) => {
    const apiUrl = useContext(ApiContext);

    const [modal, setModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontColor, setFontColor] = useState("#000000");
    const [pageStructure, setPageStructure] = useState([]);
    const blockTypes = loadBlockTypes();

    useEffect(() => {
        const fetchFontColor = async () => {
            try {
                const res = await axios.get(`${apiUrl}/admin/font_colors`);
                setFontColor(res.data.FontColors.mainFontColor);
            } catch (error) {
                setFontColor("#000000");
            }
        };

        const fetchPageStructure = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/load_page/${pageName}`);
                setPageStructure(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке структуры страницы:", error);
            }
        };
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/members`);
                const data = await response.data;
                const filteredData = data.filter((item) => item.is_member !== false);
                setMembers(filteredData);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchFontColor();
        fetchPageStructure();
        fetchMembers();
    }, []);

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modal]);

    const handleMemberClick = useCallback((member) => {
        setSelectedMember(member);
        setModal(true);
    }, []);

    const handleMouseEnter = useCallback((id) => {
        setHoveredId(id);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredId(null);
    }, []);

    const renderBlock = (block) => {
        const BlockComponent = blockTypes[block.type]?.component;
        if (BlockComponent) {
            const Block = React.lazy(() => import(`../../components/Blocks/${BlockComponent}`));
            return (
                <React.Suspense fallback={<div>Загрузка...</div>}>
                    <Block id={block.id} content={block.content} />
                </React.Suspense>
            );
        }
        return null;
    };

    if (loading) {
        return <Spinner color={fontColor} />;
    }

    return (
        <>
            <h1 style={{ color: fontColor }} className={cl.title}>
                Участники
            </h1>
            <div className={cl.main}>
                {members.length === 0 && (
                    <h1 className={cl.title} style={{ textAlign: "center", margin: "0 auto", color: fontColor }}>
                        Похоже здесь нет участников
                    </h1>
                )}
                {members.length > 0 && (
                    <>
                        {members.map((member) => (
                            <LazyLoad key={member.id} once>
                                <MemberButton
                                    member={member}
                                    isHovered={hoveredId === member.id}
                                    onClick={() => handleMemberClick(member)}
                                    onMouseEnter={() => handleMouseEnter(member.id)}
                                    onMouseLeave={handleMouseLeave}
                                />
                            </LazyLoad>
                        ))}
                        <Modal visible={modal} setVisible={setModal}>
                            <Member member={selectedMember} />
                        </Modal>
                    </>
                )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {pageStructure.map((block) => (
                    <div key={block.id} style={{ marginBottom: "20px" }}>
                        {renderBlock(block)}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Members;
