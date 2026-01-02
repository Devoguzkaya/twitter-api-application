import Sidebar from "./Sidebar";
import RightSection from "./RightSection";
import BottomNav from "./BottomNav";

function Layout({ children }) {
    return (
        <div className="flex justify-center min-h-dvh bg-black text-white font-sans overflow-hidden">
            <div className="flex w-full xl:max-w-[1265px] h-dvh">
                {/* SIDEBAR (LEFT) */}
                <div className="shrink-0 z-50">
                    <Sidebar />
                </div>

                {/* MAIN FEED (CENTER) */}
                <main className="flex-1 border-r border-[#2f3336] min-w-0 overflow-y-auto custom-scrollbar w-full sm:border-r-0 lg:border-r max-w-none lg:max-w-[600px] xl:max-w-[600px]">
                    {children}
                    <div className="h-[100px] sm:hidden w-full"></div> {/* Spacer for BottomNav */}
                </main>

                {/* RIGHT SECTION */}
                <div className="hidden lg:flex flex-col shrink-0 w-[290px] xl:w-[350px]">
                    <RightSection />
                </div>
            </div>

            {/* MOBILE BOTTOM NAVIGATION */}
            <BottomNav />
        </div>
    );
}

export default Layout;
