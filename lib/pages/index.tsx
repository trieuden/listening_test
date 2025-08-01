"use client";

import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { OutlineButton } from "@/core/component/button/OutlineButton";
import { Part1 } from "./component/Part1";
import { Part2 } from "./component/Part2";
import { Part3 } from "./component/Part3";
import { Part4 } from "./component/Part4";
import { Test } from "./component/Test";
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

export const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [part1Data, setPart1Data] = useState<string[]>([]);
    const [part2Data, setPart2Data] = useState<Part2DataType[]>([]);
    const [part3Data, setPart3Data] = useState<Part2DataType[]>([]);
    const [part4Data, setPart4Data] = useState<Part4DataType[]>([]);

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
                    setPart1Data(shuffledData);
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
                    setPart2Data(shuffledData);
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
                    setPart3Data(shuffledData);
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
                    setPart4Data(shuffledData);
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
            <Stack direction="row" className=" justify-between items-center px-2 rounded-2xl m-4 bg-gray-800">
                <span className="p-4 text-3xl font-bold text-gray-400">{currentPage < 5 ? "Part" + currentPage : "Test"}</span>
                <Stack direction="row" spacing={2}>
                    <OutlineButton title="Trang chủ" handleClick={() => setCurrentPage(1)} width={"180px"} />
                    <PrimaryButton title="Làm bài test" width={"180px"} handleClick={() => setCurrentPage(5)} bgColor="red" />
                </Stack>
            </Stack>

            <Stack className="mx-10 border-2 border-white p-4 rounded-lg ">
                {(() => {
                    switch (currentPage) {
                        case 1:
                            return <Part1 part1Data={part1Data} />;
                        case 2:
                            return <Part2 part2Data={part2Data} />;
                        case 3:
                            return <Part3 part3Data={part3Data} />;
                        case 4:
                            return <Part4 part4Data={part4Data} />;
                        case 5:
                            return <Test />;
                        default:
                            return null;
                    }
                })()}
            </Stack>

            {currentPage < 5 && (
                <Stack direction={"row"} className="w-full justify-center" spacing={2} mt={4}>
                    <OutlineButton title="Part 1" handleClick={() => setCurrentPage(1)} />
                    <OutlineButton title="Part 2" handleClick={() => setCurrentPage(2)} />
                    <OutlineButton title="Part 3" handleClick={() => setCurrentPage(3)} />
                    <OutlineButton title="Part 4" handleClick={() => setCurrentPage(4)} />
                </Stack>
            )}
        </Stack>
    );
};
