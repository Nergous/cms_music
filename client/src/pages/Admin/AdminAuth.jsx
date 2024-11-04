import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import ApiContext from "../../ApiContext";

const Auth = () => {
    const appUrl = useContext(ApiContext);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${appUrl}/admin/login`,
                {
                    username: login,
                    password: password,
                },
                { withCredentials: true }
            );
            if (response.data.success) {
                navigate("/admin");
            } else {
                setError("Invalid login or password");
            }
        } catch (error) {
            setError("Invalid login or password");
        }
    };

    return (
        <div style={{ color: "white" }}>
            <h2 style={{ color: "white", margin: "30px" }}>Войти</h2>
            {error && <p style={{ margin: "30px" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                {" "}
                                <label
                                    style={{ color: "white", margin: "30px" }}>
                                    Логин:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label
                                    style={{ color: "white", margin: "30px" }}>
                                    Пароль:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div></div>
                <Button
                    variant="light"
                    type="submit"
                    style={{ margin: "30px" }}>
                    Войти
                </Button>
            </form>
        </div>
    );
};

export default Auth;
