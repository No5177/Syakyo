import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import WritingArea from '../components/writing/WritingArea';
import ControlPanel from '../components/controls/ControlPanel';
import { HEART_SUTRA_TEXT } from '../data/heart-sutra';
import { useLocalStorage } from '../hooks/useLocalStorage';

const HeartSutra: React.FC = () => {
    const [currentText, setCurrentText] = useState('');
    const [autosaveStatus, setAutosaveStatus] = useState('');
    const [progressPercent, setProgressPercent] = useState(0);

    // Storage key for single file
    const storageKey = 'verticalSutraProgress_heart-sutra';

    // Use a simple loading effect
    useEffect(() => {
        const loaded = localStorage.getItem(storageKey);
        if (loaded) {
            try {
                const parsed = JSON.parse(loaded);
                setCurrentText(parsed.text || '');
            } catch {
                setCurrentText('');
            }
        }
    }, []);

    const saveProgress = () => {
        const data = {
            text: currentText,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        setAutosaveStatus(`自動儲存於 ${new Date().toLocaleTimeString()}`);
    };

    useEffect(() => {
        const cleanInput = currentText.replace(/\n/g, '');
        const cleanTarget = HEART_SUTRA_TEXT.replace(/\n/g, '');
        const percent = Math.min(100, Math.round((cleanInput.length / cleanTarget.length) * 100));
        setProgressPercent(percent);

        if (percent === 100) {
            // Simple completion for single file
            // Maybe trigger a confetti or simple alert
        }
    }, [currentText]);

    // Auto-save
    useEffect(() => {
        const interval = setInterval(saveProgress, 5000);
        return () => clearInterval(interval);
    }, [currentText]);

    return (
        <Layout>
            <div className="flex flex-col items-center w-full">
                <div className="w-full max-w-[800px] flex justify-between items-center mb-4">
                    <button className="bg-buddhist-wood text-white px-3 py-1 rounded text-sm hover:bg-[#a0522d]"
                        onClick={() => window.location.href = '/'}>
                        返回首頁
                    </button>
                    <h2 className="text-xl font-bold text-buddhist-wood font-serif">般若波羅蜜多心經</h2>
                    <div className="w-[80px]"></div>
                </div>

                <WritingArea
                    sutraText={HEART_SUTRA_TEXT}
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

export default HeartSutra;
