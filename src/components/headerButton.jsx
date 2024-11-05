import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderButton({name, route, styler}) {
    const navigate = useNavigate();
    return(
        <button className={`px-5 py-2 rounded-md text-white hover:bg-blue-800`} onClick={() => navigate(route)}>{name}</button>  
    )

}