export interface Chapter {
    id: string;
    title: string;
    content: string;
}

export interface Sutra {
    id: string;
    title: string;
    description: string;
    type: 'chapter-based' | 'single-file';
    chapters?: Record<string, string>; // For embedded chapter text
    fileUrl?: string; // For fetched text
}

export interface ProgressData {
    text: string;
    timestamp: string;
    completed?: boolean;
}
