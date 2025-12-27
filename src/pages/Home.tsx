import React from 'react';
import Layout from '../components/layout/Layout';
import SutraCard from '../components/sutra/SutraCard';
import { Sutra } from '../types';

const SUTRA_LIST: Sutra[] = [
    {
        id: 'earth-store',
        title: '地藏菩薩本願經',
        description: '記載地藏菩薩「地獄不空，誓不成佛」的大願，及其救度眾生的事蹟。抄寫此經能增長孝親之心，消除業障。',
        type: 'chapter-based'
    },
    {
        id: 'heart-sutra',
        title: '般若波羅蜜多心經',
        description: '佛教最精簡的經典，闡述「色即是空，空即是色」的核心智慧。抄寫心經能開啟智慧，破除妄念。',
        type: 'single-file'
    },
    {
        id: 'diamond-sutra',
        title: '金剛般若波羅蜜經',
        description: '闡述「應無所住而生其心」的無上法門。抄寫金剛經能斷除煩惱，成就無上菩提。',
        type: 'chapter-based'
    }
];

const Home: React.FC = () => {
    return (
        <Layout>
            <div className="bg-white/50 p-6 rounded-lg mb-8 text-center">
                <p className="text-lg md:text-xl text-buddhist-dark leading-relaxed font-serif">
                    經文抄寫是漢傳佛教的重要修行方式，不僅能夠靜心凝神，更能深入經藏，獲得智慧。<br className="hidden md:inline" />
                    透過恭敬抄寫，我們能夠修持戒定慧，累積功德，利益自他。<br className="hidden md:inline" />
                    在此提供多部經典供大眾抄寫，願您在抄寫過程中得到心靈的寧靜與智慧的啟迪。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SutraCard
                    sutra={SUTRA_LIST[0]}
                    linkTo="/earth-store"
                />
                <SutraCard
                    sutra={SUTRA_LIST[1]}
                    linkTo="/heart-sutra"
                />
                <SutraCard
                    sutra={SUTRA_LIST[2]}
                    linkTo="#"
                    comingSoon={true}
                />
            </div>
        </Layout>
    );
};

export default Home;
