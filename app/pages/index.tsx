import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { PrimaryButton } from "~/core/component/button/PrimaryButton";
import { OutlineButton } from "~/core/component/button/OutlineButton";
import { Part1 } from "./component/Part1";

export const HomePage = () => {
    return (
        <Stack className=" h-100vh text-white">
            <span className="p-4 text-3xl font-bold">Listening Test</span>

            <Part1 />
            <Stack direction={"row"} className="w-full justify-center" spacing={2} mt={4}>
                <OutlineButton title="Part 1" handleClick={() => console.log("Next button clicked")} />
                <OutlineButton title="Part 2" handleClick={() => console.log("Next button clicked")} />
                <OutlineButton title="Part 3" handleClick={() => console.log("Next button clicked")} />
                <OutlineButton title="Part 4" handleClick={() => console.log("Next button clicked")} />
            </Stack>
        </Stack>
    );
};
