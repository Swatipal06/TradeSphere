import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
    BarChartOutlined,
    KeyboardArrowDown,
    KeyboardArrowUp,
    MoreHoriz,
} from "@mui/icons-material";
import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

const WatchList = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredWatchlist = watchlist.filter((stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const labels = filteredWatchlist.map((subArray) => subArray.name);

    const data = {
        labels,
        datasets: [
            {
                label: "Price (₹)",
                data: filteredWatchlist.map((stock) => stock.price),
                backgroundColor: [
                    "rgba(37, 99, 235, 0.6)",
                    "rgba(16, 185, 129, 0.6)",
                    "rgba(245, 158, 11, 0.6)",
                    "rgba(239, 68, 68, 0.6)",
                    "rgba(139, 92, 246, 0.6)",
                    "rgba(14, 165, 233, 0.6)",
                    "rgba(236, 72, 153, 0.6)",
                    "rgba(100, 116, 139, 0.6)",
                    "rgba(20, 184, 166, 0.6)",
                ],
                borderColor: [
                    "rgba(37, 99, 235, 1)",
                    "rgba(16, 185, 129, 1)",
                    "rgba(245, 158, 11, 1)",
                    "rgba(239, 68, 68, 1)",
                    "rgba(139, 92, 246, 1)",
                    "rgba(14, 165, 233, 1)",
                    "rgba(236, 72, 153, 1)",
                    "rgba(100, 116, 139, 1)",
                    "rgba(20, 184, 166, 1)",
                ],
                borderWidth: 1.5,
            },
        ],
    };

    return (
        <div className="watchlist-container">
            <div className="search-container">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search eg: infy, rel, tcs, sbin..."
                    className="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="counts">{filteredWatchlist.length} / {watchlist.length}</span>
            </div>

            <ul className="list">
                {filteredWatchlist.length > 0 ? (
                    filteredWatchlist.map((stock, index) => {
                        return <WatchListItem stock={stock} key={index} />;
                    })
                ) : (
                    <li style={{ padding: "16px", color: "#94a3b8", textAlign: "center" }}>
                        No instruments match "{searchTerm}"
                    </li>
                )}
            </ul>

            <div style={{ padding: "20px 10px" }}>
                <DoughnutChart data={data} />
            </div>
        </div>
    );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
    const [showWatchlistActions, setShowWatchlistActions] = useState(false);

    return (
        <li
            onMouseEnter={() => setShowWatchlistActions(true)}
            onMouseLeave={() => setShowWatchlistActions(false)}
        >
            <div className="item">
                <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
                <div className="itemInfo">
                    <span className="percent">{stock.percent}</span>
                    {stock.isDown ? (
                        <KeyboardArrowDown className="down" />
                    ) : (
                        <KeyboardArrowUp className="up" />
                    )}
                    <span className="price">₹{stock.price.toFixed(2)}</span>
                </div>
            </div>
            {showWatchlistActions && <WatchListActions stock={stock} />}
        </li>
    );
};

const WatchListActions = ({ stock }) => {
    const generalContext = useContext(GeneralContext);

    const handleBuyClick = () => {
        generalContext.openBuyWindow(stock.name, stock.price);
    };

    const handleSellClick = () => {
        generalContext.openSellWindow(stock.name, stock.price);
    };

    return (
        <span className="actions">
            <span>
                <Tooltip
                    title="Buy (B)"
                    placement="top"
                    arrow
                    TransitionComponent={Grow}
                >
                    <button className="buy" onClick={handleBuyClick}>Buy</button>
                </Tooltip>
                <Tooltip
                    title="Sell (S)"
                    placement="top"
                    arrow
                    TransitionComponent={Grow}
                >
                    <button className="sell" onClick={handleSellClick}>Sell</button>
                </Tooltip>
                <Tooltip
                    title="Analytics (A)"
                    placement="top"
                    arrow
                    TransitionComponent={Grow}
                >
                    <button className="action" onClick={handleBuyClick}>
                        <BarChartOutlined className="icon" />
                    </button>
                </Tooltip>
                <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
                    <button className="action">
                        <MoreHoriz className="icon" />
                    </button>
                </Tooltip>
            </span>
        </span>
    );
};