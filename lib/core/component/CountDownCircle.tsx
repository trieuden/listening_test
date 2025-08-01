"use client";
import React, { useEffect, useState, useRef } from "react";
import { Stack } from "@mui/material";
import { KeyboardVoice } from "@mui/icons-material";

type CountdownCircleProps = {
    start: boolean;
    setStart: (start: boolean) => void;
    onCountdownEnd?: () => void;
    time: number;
};

export const CountdownCircle = ({ start, setStart, onCountdownEnd, time }: CountdownCircleProps) => {
    const [timeLeft, setTimeLeft] = useState(time + 5); // Thêm 5 giây để chuẩn bị
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [hasPlayedAudio, setHasPlayedAudio] = useState(false); // tránh phát lại nhiều lần

    useEffect(() => {
        let timer: NodeJS.Timeout;

        setHasPlayedAudio(false); // reset mỗi lần bắt đầu
        if (start) {
            setTimeLeft(time + 5);
            setHasPlayedAudio(false); // reset mỗi lần bắt đầu

            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    const newTime = prev - 1;

                    // Phát audio khi time còn 30 và chỉ phát 1 lần
                    if (newTime === time + 1 && !hasPlayedAudio && audioRef.current) {
                        audioRef.current.play();
                        setHasPlayedAudio(true);
                    }

                    return newTime;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [start, time]);

    // Sử dụng useEffect riêng để theo dõi timeLeft
    useEffect(() => {
        if (timeLeft <= 0 && start) {
            if (onCountdownEnd) onCountdownEnd();
            setTimeLeft(time + 5); // Reset thời gian
        }
    }, [timeLeft, start, onCountdownEnd, time]);

    return (
        <Stack alignItems="center" justifyContent="center" className="h-[200px] w-[200px] rounded-full border-2 border-white text-white">
            <audio ref={audioRef} src="/audio/censor-beep.mp3" preload="auto" />
            <h2 className="text-4xl font-bold">{!start ? <KeyboardVoice fontSize="large" className="text-white" /> : timeLeft > time ? "Chuẩn bị" : `${timeLeft}s`}</h2>
        </Stack>
    );
};
