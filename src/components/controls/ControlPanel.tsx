import React from 'react';

interface ControlPanelProps {
    onSave: () => void;
    onLoad: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onSave, onLoad }) => {
    return (
        <div className="my-5 text-center w-full max-w-[800px]">
            <button
                onClick={onSave}
                className="bg-buddhist-wood hover:bg-[#a0522d] text-white px-3 py-1.5 rounded mx-2 text-lg font-serif transition-colors duration-200"
            >
                保存進度
            </button>
            <button
                onClick={onLoad}
                className="bg-buddhist-wood hover:bg-[#a0522d] text-white px-3 py-1.5 rounded mx-2 text-lg font-serif transition-colors duration-200"
            >
                載入進度
            </button>
        </div>
    );
};

export default ControlPanel;
