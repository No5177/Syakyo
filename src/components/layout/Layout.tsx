import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            {/* Header */}
            <header className="w-full text-center py-10 px-5 box-border">
                <h1 className="text-buddhist-wood text-4xl md:text-5xl font-serif font-bold mb-2 shadow-sm">
                    佛經抄寫修行入口
                </h1>
                <div className="text-buddhist-wood text-lg md:text-xl font-serif mb-8">
                    心靜則文凈，經典抄寫，福慧雙修
                </div>
            </header>

            {/* Main Content */}
            <main className="w-11/12 max-w-6xl flex-grow p-5 bg-white/50 rounded-lg shadow-sm backdrop-blur-sm mb-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="w-full text-center py-5 text-buddhist-wood font-serif bg-white/30 text-sm md:text-base mt-auto">
                <p>© 2025 佛經抄寫修行平台 | 願一切眾生離苦得樂</p>
            </footer>
        </div>
    );
};

export default Layout;
