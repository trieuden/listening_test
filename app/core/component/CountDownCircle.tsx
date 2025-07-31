import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { KeyboardVoice } from "@mui/icons-material";

type CountdownCircleProps = {
    start: boolean;
    setStart: (start: boolean) => void;
    onCountdownEnd?: () => void; // Thêm callback khi đếm ngược kết thúc
};

export const CountdownCircle = ({ start, setStart, onCountdownEnd }: CountdownCircleProps) => {
    const [timeLeft, setTimeLeft] = useState(35);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (start) {
            setTimeLeft(35); // Reset mỗi lần bắt đầu
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setStart(false); // dừng đồng hồ
                        if (onCountdownEnd) onCountdownEnd(); // gọi callback
                        return 35;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [start]);

    return (
        <Stack alignItems="center" justifyContent="center" className="h-[200px] w-[200px] rounded-full border-2 border-white text-white">
            <h2 className="text-4xl font-bold">{!start ? <KeyboardVoice fontSize="large" className="text-white" /> : timeLeft > 30 ? "Chuẩn bị" : `${timeLeft}s`}</h2>
        </Stack>
    );
};
