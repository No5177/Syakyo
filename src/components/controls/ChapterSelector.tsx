import React from 'react';

interface ChapterSelectorProps {
    chapters: string[];
    currentChapter: string;
    onChapterChange: (chapter: string) => void;
    chapterTitles?: Record<string, string>;
}

const ChapterSelector: React.FC<ChapterSelectorProps> = ({
    chapters,
    currentChapter,
    onChapterChange,
    chapterTitles
}) => {
    return (
        <div className="flex items-center justify-center gap-2 mb-2 w-full max-w-[800px]">
            <label htmlFor="chapter-select" className="text-lg font-serif min-w-fit text-buddhist-wood">
                選擇經文段落：
            </label>
            <select
                id="chapter-select"
                value={currentChapter}
                onChange={(e) => onChapterChange(e.target.value)}
                className="p-2 text-base rounded border border-buddhist-wood/30 bg-white/80 font-serif min-w-[200px] focus:outline-none focus:ring-2 focus:ring-buddhist-gold"
            >
                {chapters.map((chapter) => (
                    <option key={chapter} value={chapter}>
                        {chapterTitles ? chapterTitles[chapter] || chapter : chapter}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ChapterSelector;
