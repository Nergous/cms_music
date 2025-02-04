import React, { useState, useEffect, useCallback, useContext, useRef, useMemo } from "react";
import Modal from "../../components/Modal/Modal";
import Member from "./Member/Member";
import LazyLoad from "react-lazyload";
import cl from "./Members.module.css";
import MemberButton from "./MemberButton";
import Spinner from "../../components/Spinner/Spinner";
import ApiContext from "../../ApiContext";
import axios from "axios";
import { loadBlockTypes } from "../../utils/loadBlockTypes";
import _ from "lodash"; // Для debounce

const Members = React.memo(({ pageName }) => {
    const apiUrl = useContext(ApiContext);
    const [modal, setModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontColor, setFontColor] = useState("#000000");
    const [pageStructure, setPageStructure] = useState([]);
    const [blockTypes, setBlockTypes] = useState({});
    const blockComponents = useRef({});

    // Загрузка типов блоков
    useEffect(() => {
        const getBlockTypes = async () => {
            const blocks = await loadBlockTypes();
            setBlockTypes(blocks);
        };
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
                console.error("Ошибка при загрузке участников:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFontColor();
        fetchPageStructure();
        fetchMembers();
        getBlockTypes();
    }, [apiUrl, pageName]);

    // Блокируем скролл при открытом модальном окне
    useEffect(() => {
        if (modal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modal]);

    // Мемоизация массива участников
    const filteredMembers = useMemo(() => members.filter((item) => item.is_member !== false), [members]);

    // Обработчики событий мыши с дебаунсированием
    const debouncedHandleMouseEnter = useCallback(
        _.debounce((id) => setHoveredId(id), 200),
        []
    );

    const debouncedHandleMouseLeave = useCallback(
        _.debounce(() => setHoveredId(null), 200),
        []
    );

    const handleMemberClick = useCallback((member) => {
        setSelectedMember(member);
        setModal(true);
    }, []);

    // Функция для рендера блоков
    const renderBlock = useCallback(
        (block) => {
            if (Object.keys(blockTypes).length === 0) return null;
            const BlockComponent = blockTypes[block.type]?.component;
            if (BlockComponent) {
                console.log("чмо");
                if (!blockComponents.current[BlockComponent]) {
                    blockComponents.current[BlockComponent] = React.lazy(() => import(`../../components/Blocks/${BlockComponent}`));
                }
                const Block = blockComponents.current[BlockComponent];
                return (
                    <React.Suspense fallback={<div>Загрузка...</div>}>
                        <Block id={block.id} content={block.content} />
                    </React.Suspense>
                );
            }
            return null;
        },
        [blockTypes] // Убираем зависимость от blockTypes
    );

    if (loading) {
        return <Spinner color={fontColor} />;
    }

    return (
        <>
            <h1 style={{ color: fontColor }} className={cl.title}>
                Участники
            </h1>
            <div className={cl.main}>
                {filteredMembers.length === 0 && (
                    <h1 className={cl.title} style={{ textAlign: "center", margin: "0 auto", color: fontColor }}>
                        Похоже здесь нет участников
                    </h1>
                )}
                {filteredMembers.length > 0 && (
                    <>
                        {filteredMembers.map((member) => (
                            <LazyLoad key={member.id} once>
                                <MemberButton
                                    member={member}
                                    isHovered={hoveredId === member.id}
                                    onClick={() => handleMemberClick(member)}
                                    onMouseEnter={() => debouncedHandleMouseEnter(member.id)}
                                    onMouseLeave={debouncedHandleMouseLeave}
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
});

export default Members;
