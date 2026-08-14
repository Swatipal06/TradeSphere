import React, { useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Login from "./Login";

const Home = () => {
    const [user, setUser] = useState(() => {
        // Restore session on page refresh
        const token = sessionStorage.getItem("ts_token") || localStorage.getItem("ts_token");
        const stored = sessionStorage.getItem("ts_user") || localStorage.getItem("ts_user");
        if (token && stored) {
            try { return JSON.parse(stored); } catch { return null; }
        }
        return null;
    });

    if (!user) {
        return <Login onLoginSuccess={(u) => setUser(u)} />;
    }

    return (
        <>
            <TopBar user={user} />
            <Dashboard />
        </>
    );
};

export default Home;