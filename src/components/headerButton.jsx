import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderButton({name, route}) {
    const navigate = useNavigate();
    return(
        <button className="px-5 py-2 rounded-md text-white hover:text-blue-600 hover:bg-white" onClick={() => navigate(route)}>{name}</button>  
    )

}