import React, { useState, useEffect, useCallback, useContext } from "react";
import Modal from "../../components/Modal/Modal";
import Member from "./Member/Member";
import LazyLoad from "react-lazyload";
import cl from "./Members.module.css";
import MemberButton from "./MemberButton";
import Spinner from "../../components/Spinner/Spinner";
import ApiContext from "../../ApiContext";
import axios from "axios";

const Members = () => {
    const apiUrl = useContext(ApiContext);

    const [modal, setModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMembers = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/members`);
	    
            const data = await response.json();
            const filteredData = data.filter(
                (item) => item.is_member !== false
            );
            setMembers(filteredData);
        } catch (error) {            
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

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

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <h1 className={cl.title}>Участники</h1>
            <div className={cl.main}>
                {members.length === 0 && (
                    <h1
                        className={cl.title}
                        style={{ textAlign: "center", margin: "0 auto" }}
                    >
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
                                    onMouseEnter={() =>
                                        handleMouseEnter(member.id)
                                    }
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
        </>
    );
};

export default Members;
