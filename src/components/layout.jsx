import Header from "./header";
import React, { useEffect, useState } from "react";
import { useAuthentication } from "../Authentication";
export default function Layout({ children }) {
    const [authenticated, setAuthenticated] = useState(null);
    const { isAuthenticated } = useAuthentication();

    useEffect(() => {
        const checkAuthentication = async () => {
            const result = await isAuthenticated();
            setAuthenticated(result);
        };

        checkAuthentication();
    }, [isAuthenticated]);

    // useEffect(() => {
    //     if (authenticated) {
    //         window.location.href = '/';
    //     }
    // }, [authenticated]);

    return (
        <div className="flex flex-col min-h-[100vh] h-full overflow-y-auto w-full bg-gradient-to-r from-[#FDFCFB] to-[#E2D1C3]">
            <Header authenticated={authenticated} />
            <div className="flex items-center justify-center w-full h-full ">
                <div className="flex items-center justify-center  h-full w-full">
                    <div className="flex w-full h-[calc(100vh-4rem)] backdrop-blur-lg rounded-xl items-center justify-center">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}