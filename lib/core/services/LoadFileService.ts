export const ReadDefaultFile = async (fileName: string) => {
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
export const getPart2Data = async () => {
    const words = await ReadDefaultFile(`part2.json`);
    return words;
};
export const getPart4Data = async () => {
    const words = await ReadDefaultFile(`part4.json`);
    return words;
};
