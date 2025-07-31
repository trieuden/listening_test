export const ReadDefaultFile = async (fileName: string): Promise<string[]> => {
    try {
        // Check if we're in browser environment
        const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : '';
        const res = await fetch(`${baseUrl}/files/${fileName}`);
        const json = await res.json();

        return json;
    } catch (error) {
        console.error("Failed to fetch file", error);
        return [];
    }
};

export const getPart1Data = async () => {
    const words = await ReadDefaultFile(`part1.json`);
    return words;
};
