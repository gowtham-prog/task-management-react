import Header from "./header"
export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-[100vh] h-full overflow-y-auto w-full bg-gradient-to-r from-[#FDFCFB] to-[#E2D1C3]">
            <Header authenticated={false} />
            <div className="flex items-center justify-center w-full h-full">
                <div className="flex items-center justify-center max-w-7xl h-full w-full">
                    <div className="flex w-full h-[calc(100vh-4rem)] backdrop-blur-lg rounded-xl items-center justify-center">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}