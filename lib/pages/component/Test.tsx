"use client";

import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { OutlineButton } from "@/core/component/button/OutlineButton";
import { Part1 } from "./Part1";
import { Part2 } from "./Part2";
import { Part3 } from "./Part3";
import { Part4 } from "./Part4";
import { getPart1Data, getPart2Data, getPart3Data, getPart4Data } from "@/core/services/LoadFileService";
import { PrimaryButton } from "@/core/component/button/PrimaryButton";

type Part2DataType = {
    image: string;
    question: string[];
};

type Part4DataType = {
    question: string;
    suggestion: string[];
};

export const Test = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [part1Data, setPart1Data] = useState<string[]>([]);
    const [part2Data, setPart2Data] = useState<Part2DataType[]>([]);
    const [part3Data, setPart3Data] = useState<Part2DataType[]>([]);
    const [part4Data, setPart4Data] = useState<Part4DataType[]>([]);

    const [part1Result_1, setPart1Result_1] = useState<string>("");
    const [part1Result_2, setPart1Result_2] = useState<string>("");
    const [part1Result_3, setPart1Result_3] = useState<string>("");

    const [part2Result_1, setPart2Result_1] = useState<string>("");
    const [part2Result_2, setPart2Result_2] = useState<string>("");
    const [part2Result_3, setPart2Result_3] = useState<string>("");

    const [part3Result_1, setPart3Result_1] = useState<string>("");
    const [part3Result_2, setPart3Result_2] = useState<string>("");
    const [part3Result_3, setPart3Result_3] = useState<string>("");

    const [part4Result, setPart4Result] = useState<string>("");

    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        switch (currentPage) {
            case 1: {
                const fetchData = async () => {
                    const data = await getPart1Data();
                    // Shuffle mảng
                    const shuffledData = [...data];
                    for (let i = shuffledData.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
                    }
                    const newData = shuffledData.slice(0, 3); // Lấy 10 phần tử đầu tiên
                    setPart1Data(newData);
                };
                fetchData();
                break;
            }
            case 2: {
                const fetchData = async () => {
                    const data = await getPart2Data();

                    // Shuffle mảng
                    const shuffledData = [...data];
                    for (let i = shuffledData.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
                    }
                    const newData = shuffledData.slice(0, 1);
                    setPart2Data(newData);
                };
                fetchData();
                break;
            }
            case 3: {
                const fetchData = async () => {
                    const data = await getPart3Data();

                    // Shuffle mảng
                    const shuffledData = [...data];
                    for (let i = shuffledData.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
                    }
                    const newData = shuffledData.slice(0, 1);
                    setPart3Data(newData);
                };
                fetchData();
                break;
            }
            case 4: {
                const fetchData = async () => {
                    const data = await getPart4Data();
                    // Shuffle mảng
                    const shuffledData = [...data];
                    for (let i = shuffledData.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
                    }
                    const newData = shuffledData.slice(0, 1);
                    setPart4Data(newData);
                };
                fetchData();
                break;
            }
            default:
                document.title = "Listening Test";
        }
    }, [currentPage]);
    return (
        <Stack className=" h-100vh text-white bg-[#404040]">
            <Stack direction="row" className=" justify-between items-center px-2 border-b-1">
                <span className="p-4 text-3xl font-bold">Test Part {currentPage}</span>
                <span className="text-red-500">Lưu ý, nhớ nhấn dừng hoặc chờ hết time trước khi nhấn Kết thúc </span>
                <Stack direction="row">
                    {currentPage < 4 ? (
                        <PrimaryButton title="Qua Part tiếp theo" width="260px" handleClick={() => setCurrentPage(currentPage + 1)} bgColor="#cccc00" />
                    ) : (
                        <PrimaryButton title="Kết thúc" width="260px" handleClick={() => setShowResults(true)} bgColor="#cccc00" />
                    )}
                </Stack>
            </Stack>

            <Stack className="pt-4">
                {(() => {
                    switch (currentPage) {
                        case 1:
                            return <Part1 part1Data={part1Data} handleGetResult_1={setPart1Result_1} handleGetResult_2={setPart1Result_2} handleGetResult_3={setPart1Result_3} />;
                        case 2:
                            return <Part2 part2Data={part2Data} handleGetResult_1={setPart2Result_1} handleGetResult_2={setPart2Result_2} handleGetResult_3={setPart2Result_3} />;
                        case 3:
                            return <Part3 part3Data={part3Data} />;
                        case 4:
                            return <Part4 part4Data={part4Data} />;
                        default:
                            return null;
                    }
                })()}
            </Stack>

            {showResults && (
                <Stack className="mt-10">
                    <Stack direction="row" spacing={2} className="w-full justify-center items-center mt-4">
                        <span className="text-2xl text-amber-300">Kết quả Part 1 Câu 1</span>
                        {part1Result_1 && (
                            <audio controls src={part1Result_1} className="mt-4">
                                <track kind="captions" srcLang="vi" label="No captions available" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </Stack>
                    <Stack direction="row" spacing={2} className="w-full justify-center items-center mt-4">
                        <span className="text-2xl text-amber-300">Kết quả Part 1 Câu 2</span>
                        {part1Result_2 && (
                            <audio controls src={part1Result_2} className="mt-4">
                                <track kind="captions" srcLang="vi" label="No captions available" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </Stack>
                    <Stack direction="row" spacing={2} className="w-full justify-center items-center mt-4">
                        <span className="text-2xl text-amber-300">Kết quả Part 1 Câu 3</span>
                        {part1Result_3 && (
                            <audio controls src={part1Result_3} className="mt-4">
                                <track kind="captions" srcLang="vi" label="No captions available" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </Stack>
                    <Stack direction="row" spacing={2} className="w-full justify-center items-center mt-4">
                        <span className="text-2xl text-amber-300">Kết quả Part 2</span>
                        {part2Result_1 && (
                            <audio controls src={part2Result_1} className="mt-4">
                                <track kind="captions" srcLang="vi" label="No captions available" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        {part2Result_2 && (
                            <audio controls src={part2Result_2} className="mt-4">
                                <track kind="captions" srcLang="vi" label="No captions available" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        {part2Result_3 && (
                            <audio controls src={part2Result_3} className="mt-4">
                                <track kind="captions" srcLang="vi" label="No captions available" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
};
