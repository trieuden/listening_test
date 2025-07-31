export const ReadDefaultFile = async (fileName: string): Promise<string[]> => {
    try {
        const res = await fetch(`${window.location.origin}/files/${fileName}`);
        const json = await res.json();

        return json;
    } catch (error) {
        console.error("Failed to fetch milo.json", error);
        return [];
    }
};

export const getPart1Data = async () => {
    const words = await ReadDefaultFile(`part1.json`);
    return words;
};
