function RightSection() {
    return (
        <div className="hidden lg:flex flex-col gap-4 w-[290px] xl:w-[350px] sticky top-0 h-screen py-4 px-4 border-l border-[#2f3336]">

            {/* SEARCH */}
            <div className="bg-[#202327] rounded-full flex items-center px-4 py-2 group focus-within:bg-black focus-within:ring-1 focus-within:ring-[#1d9bf0] transition-colors">
                <span className="text-gray-500 mr-3">🔍</span>
                <input
                    type="text"
                    placeholder="Ara"
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-500"
                />
            </div>

            {/* TRENDS */}
            <div className="bg-[#16181c] rounded-xl flex flex-col pt-3 pb-3">
                <h2 className="text-xl font-bold text-white px-4 mb-3">İlgini çekebilir</h2>

                {['#Yazılım', '#React', '#Workintech', '#Frontend', '#FullStack'].map((tag) => (
                    <div key={tag} className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
                        <p className="text-xs text-gray-500">Türkiye konumunda gündem</p>
                        <p className="font-bold text-white text-sm">{tag}</p>
                        <p className="text-xs text-gray-500">12.5B Tweet</p>
                    </div>
                ))}

                <div className="px-4 pt-3 cursor-pointer text-[#1d9bf0] text-sm hover:underline">
                    Daha fazlasını göster
                </div>
            </div>

            {/* FOOTER */}
            <div className="text-xs text-gray-500 flex flex-wrap gap-2 px-4">
                <span>Hizmet Şartları</span>
                <span>Gizlilik Politikası</span>
                <span>Çerez Politikası</span>
                <span>© 2025 X Corp.</span>
            </div>

        </div>
    );
}

export default RightSection;
