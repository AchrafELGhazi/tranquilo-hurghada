import { useState, useEffect } from 'react';

interface TypewriterOptions {
    speed?: number;
    deleteSpeed?: number;
    delayBetweenTexts?: number;
    loop?: boolean;
    cursor?: boolean;
    cursorBlinkSpeed?: number;
}

interface TypewriterReturn {
    text: string;
    cursor: string;
    isComplete: boolean;
}

export const useTypewriter = (
    texts: string[],
    options: TypewriterOptions = {}
): TypewriterReturn => {
    const {
        speed = 100,
        deleteSpeed = 50,
        delayBetweenTexts = 2000,
        loop = true,
        cursor = true,
        cursorBlinkSpeed = 530
    } = options;

    const [displayText, setDisplayText] = useState<string>('');
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showCursor, setShowCursor] = useState<boolean>(cursor);

    useEffect(() => {
        if (!texts || texts.length === 0) return;

        const currentText = texts[currentTextIndex];

        const timeout = setTimeout(() => {
            if (isDeleting) {
                setDisplayText(prev => prev.slice(0, -1));

                if (displayText.length === 0) {
                    setIsDeleting(false);
                    setCurrentTextIndex(prev =>
                        loop ? (prev + 1) % texts.length : Math.min(prev + 1, texts.length - 1)
                    );
                }
            } else {
                setDisplayText(prev => currentText.slice(0, prev.length + 1));

                if (displayText === currentText) {
                    if (loop || currentTextIndex < texts.length - 1) {
                        setTimeout(() => setIsDeleting(true), delayBetweenTexts);
                    }
                }
            }
        }, isDeleting ? deleteSpeed : speed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, delayBetweenTexts, loop]);

    useEffect(() => {
        if (!cursor) return;

        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, cursorBlinkSpeed);

        return () => clearInterval(cursorInterval);
    }, [cursor, cursorBlinkSpeed]);

    return {
        text: displayText,
        cursor: showCursor ? '|' : '',
        isComplete: !loop && currentTextIndex === texts.length - 1 && displayText === texts[currentTextIndex] && !isDeleting
    };
};