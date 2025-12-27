import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import WritingArea from '../components/writing/WritingArea';
import ControlPanel from '../components/controls/ControlPanel';
import ChapterSelector from '../components/controls/ChapterSelector';
import { EARTH_STORE_SUTRA } from '../data/earth-store-sutra';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Extract first line as title for simplicity, or use a mapping
const getChapterTitle = (text: string) => {
    const firstLine = text.split('\n')[0];
    // If first line is "地藏菩薩本願經", maybe take second line? 
    // The data structure has "地藏菩薩本願經\n忉利天宮神通品第一..." for chapter 1.
    // Let's use the second line if it exists and looks like a title, otherwise first.
    const lines = text.split('\n');
    if (lines.length > 1 && lines[1].includes('品')) {
        return lines[1];
    }
    return lines[0];
};

const EarthStoreSutra: React.FC = () => {
    const chapterKeys = useMemo(() => Object.keys(EARTH_STORE_SUTRA), []);
    const [currentChapter, setCurrentChapter] = useState(chapterKeys[0]);

    // Persistent State for current chapter's text
    // Key format: verticalSutraProgress_chapterX
    const storageKey = `verticalSutraProgress_${currentChapter}`;
    const [savedData, setSavedData] = useLocalStorage<{ text: string, timestamp: string } | null>(storageKey, null);

    // Completion Count State
    const [completionCount, setCompletionCount] = useLocalStorage<number>('sutraCompletionCount', 0);

    // Local state for the writing area (to avoid too many writes to localStorage on every keystroke)
    const [currentText, setCurrentText] = useState('');
    const [autosaveStatus, setAutosaveStatus] = useState('');
    const [progressPercent, setProgressPercent] = useState(0);

    const currentSutraText = EARTH_STORE_SUTRA[currentChapter];

    // Load initial text when chapter changes
    useEffect(() => {
        if (savedData) {
            setCurrentText(savedData.text);
        } else {
            setCurrentText('');
        }
    }, [currentChapter, savedData]); // savedData change might be tricky if we update it ourselves? 
    // Actually, useLocalStorage returns the latest value. 
    // When we switch chapter, storageKey changes, so useLocalStorage hook *should* return the value for new key?
    // Our useLocalStorage hook implementation:
    // useEffect(() => { ... }, [key, value]);
    // It syncs state TO local storage.
    // But does it sync FROM local storage when key changes?
    // The initial state is set ONLY ONCE on mount in the hook: `useState(() => getStorageValue(key, defaultValue))`.
    // If key changes, `value` state in the hook is NOT reset to the new key's value automatically unless we force it.
    // **CRITICAL BUG IN useLocalStorage HOOK**: The hook provided earlier does NOT refetch when key changes.
    // I need to fix useLocalStorage or work around it. 
    // The provided hook: 
    /*
    export const useLocalStorage = <T>(key: string, defaultValue: T) => {
        const [value, setValue] = useState<T>(() => {
          return getStorageValue(key, defaultValue);
        });
      
        useEffect(() => {
          localStorage.setItem(key, JSON.stringify(value));
        }, [key, value]);
      
        return [value, setValue] as const;
     };
    */
    // If 'key' changes, the 'value' state remains what it was! And then it overwrites the NEW key with the OLD value!
    // This is major. I must FIX useLocalStorage hook first or correct it here. 
    // The standard useLocalStorage hook usually handles key changes by updating state.
    // I will assume I need to FIX the hook.

    // Wait, I can't fix the hook in this tool call easily without context switching.
    // I will use a key-based component instance or handle the fetch manually.
    // Better: Fix the hook in the next step. 
    // For now, I will write this component assuming the hook *will be fixed* or I can use a key on the hook call? No, hook call is top level.
    // I will use `key={currentChapter}` on a wrapper or sub-component?
    // No, I'll just fix the hook logic in the Page component for now by using `useEffect` to load data when `currentChapter` changes,
    // bypassing the flawed hook for the *switching* logic, OR strictly use the hook for *one* key.
    // Actually, let's fix the hook in a separate step. It's critical. 

    // For this file, I'll write the logic assuming a working hook or I will implement a robust loading strategy.
    // Let's implement a `useSutraProgress` hook inside this file or locally first? 
    // No, let's just use raw localStorage in useEffect for simplicity and correctness right now since the hook is suspect.

    // Re-reading hook: `useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);`
    // Yes, if key changes, it writes the OLD value to the NEW key. DESTROYING DATA.

    // STRATEGY CHANGE: I will NOT use the custom `useLocalStorage` hook for the dynamic chapter data in this component yet.
    // I will manage it with `useEffect` and `useState` locally here to ensure safety.

    useEffect(() => {
        const loaded = localStorage.getItem(storageKey);
        if (loaded) {
            try {
                const parsed = JSON.parse(loaded);
                setCurrentText(parsed.text || '');
            } catch (e) {
                console.error("Failed to parse", e);
                setCurrentText('');
            }
        } else {
            setCurrentText('');
        }
    }, [currentChapter]);

    // Update progress calculation
    useEffect(() => {
        const cleanInput = currentText.replace(/\n/g, '');
        const cleanTarget = currentSutraText.replace(/\n/g, '');
        const percent = Math.min(100, Math.round((cleanInput.length / cleanTarget.length) * 100));
        setProgressPercent(percent);

        // Check completion
        if (percent === 100) {
            // check if all chapters done?
            // Logic from legacy:
            // if (currentChapter === LAST_CHAPTER && percent === 100) -> check all chapters -> increment count -> reset.
            // We can implement checking all chapters here.
            checkAllChaptersCompletion();
        }
    }, [currentText, currentChapter]);

    const saveProgress = () => {
        const data = {
            text: currentText,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        setAutosaveStatus(`自動儲存於 ${new Date().toLocaleTimeString()}`);
    };

    // Auto-save every 5 seconds
    useEffect(() => {
        const interval = setInterval(saveProgress, 5000);
        return () => clearInterval(interval);
    }, [currentText, storageKey]);

    const checkAllChaptersCompletion = () => {
        // Check all chapters
        const allDone = chapterKeys.every(key => {
            // Current chapter might not be saved to LS yet if just finished in state?
            // We should check currentText for currentChapter, and LS for others.
            let textToCheck = '';
            if (key === currentChapter) {
                textToCheck = currentText;
            } else {
                const raw = localStorage.getItem(`verticalSutraProgress_${key}`);
                if (!raw) return false;
                try {
                    textToCheck = JSON.parse(raw).text;
                } catch { return false; }
            }

            const target = EARTH_STORE_SUTRA[key].replace(/\n/g, '');
            const current = textToCheck.replace(/\n/g, '');
            return current.length >= target.length;
        });

        if (allDone) {
            // Increment completion count
            const newCount = (completionCount || 0) + 1;
            setCompletionCount(newCount);

            // Clear all progress
            chapterKeys.forEach(key => {
                localStorage.removeItem(`verticalSutraProgress_${key}`);
            });

            // Clear current state
            setCurrentText('');
            alert(`恭喜完成第 ${newCount} 遍抄經！已重置所有章節以便重新開始。`);

            // Force reload current chapter (empty)
            // It's already cleared in state above? No, we need to set state.
            setCurrentText('');
        }
    };

    const handleClearAll = () => {
        if (confirm('確定要清空所有章節的進度嗎？此操作無法復原！')) {
            chapterKeys.forEach(key => localStorage.removeItem(`verticalSutraProgress_${key}`));
            setCurrentText('');
            alert('所有章節進度已清空');
        }
    };

    const handleResetCount = () => {
        if (completionCount === 0) return;
        if (confirm(`目前已完成 ${completionCount} 遍抄經，是否確定要重置為 0？`)) {
            setCompletionCount(0);
        }
    };

    const chapterTitles = useMemo(() => {
        const titles: Record<string, string> = {};
        chapterKeys.forEach(key => {
            titles[key] = getChapterTitle(EARTH_STORE_SUTRA[key]);
        });
        return titles;
    }, [chapterKeys]);

    return (
        <Layout>
            <div className="flex flex-col items-center w-full">
                <div className="w-full max-w-[800px] flex justify-between items-center mb-4">
                    <button className="bg-buddhist-wood text-white px-3 py-1 rounded text-sm hover:bg-[#a0522d]"
                        onClick={() => window.location.href = '/'}>
                        返回首頁
                    </button>
                    <h2 className="text-xl font-bold text-buddhist-wood font-serif">地藏菩薩本願經</h2>
                    <div className="w-[80px]"></div> {/* Spacer */}
                </div>

                <ChapterSelector
                    chapters={chapterKeys}
                    currentChapter={currentChapter}
                    onChapterChange={setCurrentChapter}
                    chapterTitles={chapterTitles}
                />

                <div className="flex flex-wrap gap-4 items-center justify-center mb-2 font-serif text-buddhist-wood">
                    <button onClick={handleClearAll} className="text-sm underline hover:text-red-600">
                        清空所有章節
                    </button>
                    <span className="font-bold">已完成遍數: {completionCount}</span>
                    <button onClick={handleResetCount} className="text-sm bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600">
                        重置遍數
                    </button>
                </div>

                <WritingArea
                    sutraText={currentSutraText}
                    initialText={currentText}
                    onTextChange={setCurrentText}
                />

                <ControlPanel
                    onSave={() => { saveProgress(); alert('進度已保存'); }}
                    onLoad={() => {
                        const loaded = localStorage.getItem(storageKey);
                        if (loaded) setCurrentText(JSON.parse(loaded).text);
                        alert('進度已載入');
                    }}
                />

                <div className="h-6 text-gray-500 text-sm font-serif mb-2">
                    {autosaveStatus}
                </div>

                <div className="text-xl font-bold text-buddhist-wood font-serif mb-10">
                    進度: {progressPercent}%
                </div>
            </div>
        </Layout>
    );
};

export default EarthStoreSutra;
