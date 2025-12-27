import React, { useEffect, useRef, useState } from 'react';

interface WritingAreaProps {
    sutraText: string;
    initialText?: string;
    onTextChange: (text: string) => void;
    onCompositionChange?: (isComposing: boolean) => void;
}

const WritingArea: React.FC<WritingAreaProps> = ({
    sutraText,
    initialText = '',
    onTextChange,
    onCompositionChange
}) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const [isComposing, setIsComposing] = useState(false);
    const [userInputContent, setUserInputContent] = useState(initialText);

    // Focus input on mount or text change
    useEffect(() => {
        if (inputRef.current && initialText !== inputRef.current.innerText) {
            if (initialText) {
                inputRef.current.innerText = initialText;
                updateUserDisplay(); // Initial display update
            } else {
                inputRef.current.innerHTML = '';
            }
        }
    }, [initialText]);

    // Handle cursor position at end
    const placeCaretAtEnd = (el: HTMLDivElement) => {
        el.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        if (sel) {
            range.selectNodeContents(el);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };


    const updateUserDisplay = () => {
        if (isComposing || !inputRef.current) return;

        const typed = inputRef.current.innerText;
        onTextChange(typed);

        // Create fragments to avoid full re-render flickering if possible, 
        // but React's diffing usually handles this.
        // However, for contentEditable with manual HTML manipulation, we need to be careful.
        // We are effectively implementing the logic from the legacy app:
        // clearing innerHTML and rebuilding spans based on comparison.

        let html = '';
        let sutraIndex = 0;

        // We need to strip newlines from sutra for comparison in some logic 
        // but legacy logic kept track of them.
        // Legacy logic:
        // for char in typed:
        //   if char == \n -> <br>
        //   else -> span
        //     skip sutra newlines
        //     compare

        for (let i = 0; i < typed.length; i++) {
            const char = typed[i];
            if (char === '\n') {
                html += '<br>';
                continue;
            }

            // Skip newlines in source text to align comparison
            while (sutraIndex < sutraText.length && sutraText[sutraIndex] === '\n') {
                sutraIndex++;
            }

            let className = 'text-red-500 underline decoration-red-500'; // incorrect style
            if (sutraIndex < sutraText.length && char === sutraText[sutraIndex]) {
                className = 'text-black'; // correct style
            }

            // We use inline styles or tailwind classes?
            // Let's use Tailwind classes.
            // We need to use font-serif.
            html += `<span class="${className} font-serif">${char}</span>`;
            sutraIndex++;
        }

        // Update the visual content
        // Warning: This resets cursor position! We must restore it.
        // But since we always want it at the end for this specific "transcription" flow (usually), 
        // we can set it to end.
        // However, if user edits middle, this kills UX.
        // Legacy app simply did: placeCaretAtEnd(userInput);
        // So we will stick to that behavior for now as requested by user rules mostly implying migration.

        inputRef.current.innerHTML = html;
        placeCaretAtEnd(inputRef.current);
    };

    const handleInput = () => {
        if (!isComposing) {
            updateUserDisplay();
        }
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
        if (onCompositionChange) onCompositionChange(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
        if (onCompositionChange) onCompositionChange(false);
        // We need to run update logic after composition ends
        updateUserDisplay();
    };

    return (
        <div className="relative w-full max-w-[1000px] h-[550px] border border-[#f7e1be] bg-[#f8f7f5] p-5 box-border overflow-auto writing-vertical-rl text-upright font-serif leading-loose">
            {/* Watermark Layer */}
            <div
                className="absolute top-5 right-5 bottom-5 left-2.5 pointer-events-none z-10 text-buddhist-wood/70 text-2xl tracking-[5px] whitespace-pre-line font-serif"
                style={{ lineHeight: '1.5' }}
            >
                {sutraText}
            </div>

            {/* User Input Layer */}
            <div
                ref={inputRef}
                contentEditable
                spellCheck={false}
                className="absolute top-5 right-5 bottom-5 left-2.5 z-20 text-2xl bg-transparent outline-none tracking-[5px] whitespace-pre-line caret-black font-serif text-transparent"
                style={{ lineHeight: '1.5' }}
                onInput={handleInput}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
            />
        </div>
    );
};

export default WritingArea;
