import HeaderButton from "./headerButton"
import { useNavigate } from "react-router-dom";
export default function Header({ authenticated }) {

    const navigate = useNavigate();

    const logoutUser = async () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-center h-16 w-full z-30 bg-blue-600">
            <div className="flex items-center justify-center max-w-7xl h-full w-full">
                <div className="flex flex-row w-full h-full items-center justify between">
                    <div className="w-full md:w-1/3 h-full flex items-center text-3xl justify-start font-semibold text-white">
                        <a href="/"> Task Manager</a>
                    </div>

                    {authenticated ?
                        <div className="w-2/3 h-full hidden md:flex flex-row items-center text-xl justify-end font-semibold">
                            <HeaderButton name="login" route="/login"/>
                            <HeaderButton name="signup" route="/signup"/>
                        </div>
                        :
                        <div className="w-2/3 h-full hidden md:flex flex-row items-center text-xl justify-end font-semibold">
                            <HeaderButton name="tasks" route="/tasks"/>
                            <button className="px-5 py-2 rounded-md text-white bg-red-400 hover:bg-red-600" onClick={() => logoutUser()}>Logout</button>  
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}