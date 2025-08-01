"use client";

import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { OutlineButton } from "@/core/component/button/OutlineButton";
import { Part1 } from "./component/Part1";
import { Part2 } from "./component/Part2";

export const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
        <Stack className=" h-100vh text-white bg-[#404040]">
            <span className="p-4 text-3xl font-bold">Part {currentPage}</span>

            {(() => {
                switch (currentPage) {
                    case 1:
                        return <Part1 />;
                    case 2:
                        return <Part2 />;
                    case 3:
                        return <span className="p-4 text-2xl">Part 3</span>;
                    case 4:
                        return <span className="p-4 text-2xl">Part 4</span>;
                    default:
                        return null;
                }
            })()}

            
            <Stack direction={"row"} className="w-full justify-center" spacing={2} mt={4}>
                <OutlineButton title="Part 1" handleClick={() => setCurrentPage(1)} />
                <OutlineButton title="Part 2" handleClick={() => setCurrentPage(2)} />
                <OutlineButton title="Part 3" handleClick={() => console.log("Next button clicked")} />
                <OutlineButton title="Part 4" handleClick={() => console.log("Next button clicked")} />
            </Stack>
        </Stack>
    );
};
