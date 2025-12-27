import React from 'react';
import { Link } from 'react-router-dom';
import { Sutra } from '../../types';

interface SutraCardProps {
    sutra: Sutra;
    linkTo: string;
    comingSoon?: boolean;
}

const SutraCard: React.FC<SutraCardProps> = ({ sutra, linkTo, comingSoon = false }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative flex flex-col h-[280px]">
            {comingSoon && (
                <div className="absolute top-2 right-2 bg-orange-400 text-white px-2 py-1 rounded text-xs font-bold z-10">
                    即將推出
                </div>
            )}

            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl md:text-2xl text-buddhist-wood font-bold mb-3 font-serif border-b border-buddhist-wood/20 pb-2">
                    {sutra.title}
                </h3>

                <p className="text-gray-600 font-serif leading-relaxed text-sm md:text-base flex-grow">
                    {sutra.description}
                </p>

                <div className="mt-4 text-center">
                    {comingSoon ? (
                        <span className="inline-block bg-gray-400 text-white px-6 py-2 rounded-md cursor-not-allowed font-serif">
                            即將推出
                        </span>
                    ) : (
                        <Link
                            to={linkTo}
                            className="inline-block bg-buddhist-wood hover:bg-[#a0522d] text-white px-6 py-2 rounded-md transition-colors duration-300 font-serif"
                        >
                            開始抄寫
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SutraCard;
