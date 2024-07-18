import React from 'react'
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';

export const NavbarData = [
    {
        title: "Home",
        path: "/home",
        icon: <AiIcons.AiFillHome size={20} />,
        iconSelected: <AiIcons.AiFillHome size={20} color={"#fff"} />
    },
    {
        title: "My Forecasts",
        path: "/forecast",
        icon: <AiIcons.AiFillFund size={20} />,
        iconSelected: <AiIcons.AiFillFund size={20} color={"#fff"} />
    },
    {
        title: "Leaderboards",
        path: "/leaderboard-select",
        icon: <AiIcons.AiFillGold size={20} />,
        iconSelected: <AiIcons.AiFillGold size={20} color={"#fff"} />
    },
    {
        title: "Learn",
        path: "/learn",
        icon: <AiIcons.AiFillRead size={20} />,
        iconSelected: <AiIcons.AiFillRead size={20} color={"#fff"} />
    },
    {
        title: "Search",
        path: "/search",
        icon: <AiIcons.AiOutlineSearch size={20} />,
        iconSelected: <AiIcons.AiOutlineSearch size={20} color={"#fff"} />
    },
    {
        title: "My Profile",
        path: "/my-profile",
        icon: <AiIcons.AiFillIdcard size={20} />,
        iconSelected: <AiIcons.AiFillIdcard size={20} color={"#fff"} />
    }
];