import React, { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { CountdownCircle } from "@/core/component/CountDownCircle";
import { PrimaryButton } from "@/core/component/button/PrimaryButton";
import { getPart1Data } from "@/core/services/LoadFileService";

type Part1DataProps = {
    part1Data: string[];
    handleGetResult_1?: (result: string) => void;
    handleGetResult_2?: (result: string) => void;
    handleGetResult_3?: (result: string) => void;
};

export const Part1 = ({ part1Data, handleGetResult_1, handleGetResult_2, handleGetResult_3 }: Part1DataProps) => {
    const [start, setStart] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);
    const [result, setResult] = useState<string>("");
    const [isClient, setIsClient] = useState(false);
    const [isButtonStartDisabled, setIsButtonStartDisabled] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Check if we're on client side
    useEffect(() => {
        setIsClient(true);
        if (part1Data.length > 0) {
            setCurrentIndex(0);
        }
    }, []);

    const startRecording = async () => {
        // Check if we're in browser environment
        if (typeof navigator === "undefined" || !navigator.mediaDevices) {
            console.error("Media devices not available");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const audioUrl = URL.createObjectURL(audioBlob);
                setResult(audioUrl);
                if (currentIndex === 0) {
                    handleGetResult_1?.(audioUrl);
                } else if (currentIndex === 1) {
                    handleGetResult_2?.(audioUrl);
                } else if (currentIndex === 2) {
                    handleGetResult_3?.(audioUrl);
                }
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };

    const handleCountdownEnd = () => {
        //xử lý khi đếm ngược kết thúc
        stopRecording();
        setStart(false);
    };

    const NextIndex = () => {
        if (currentIndex < part1Data.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setStart(false);
            setShowQuestion(false);
            setResult("");
            setIsButtonStartDisabled(false);
        }
    };

    return (
        <Stack className="h-100vh text-white">
            <span className="text-3xl self-center text-black font-bold">Câu {currentIndex + 1} Part 1</span>
            <Stack direction="row" className="w-full p-[5%]">
                <Stack flex={1}>
                    <span className="flex-1 text-xl">{!showQuestion ? "Waiting ..." : part1Data[currentIndex]}</span>
                    {showQuestion && result && isClient && (
                        <audio controls src={result} className="mt-4">
                            <track kind="captions" srcLang="vi" label="No captions available" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </Stack>

                <Stack spacing={1}>
                    <CountdownCircle start={start} setStart={setStart} onCountdownEnd={handleCountdownEnd} time={30} />
                    {start && (
                        <PrimaryButton
                            title="Dừng"
                            handleClick={() => {
                                stopRecording(); // Dừng ghi âm
                                setStart(false);
                            }}
                        />
                    )}
                </Stack>
            </Stack>

            <Stack direction="row" className="w-full justify-center" spacing={2}>
                {isClient && (
                    <>
                        {!isButtonStartDisabled && (
                            <PrimaryButton
                                title="Bắt đầu"
                                handleClick={() => {
                                    setResult("");
                                    setStart(true);
                                    setIsButtonStartDisabled(true);
                                    setShowQuestion(true);
                                    startRecording(); // Bắt đầu ghi âm
                                }}
                            />
                        )}
                        {currentIndex < part1Data.length - 1 && (
                            <PrimaryButton
                                title="Câu tiếp theo"
                                handleClick={() => {
                                    stopRecording();
                                    NextIndex();
                                }}
                                bgColor="#cccc00"
                            />
                        )}
                    </>
                )}
            </Stack>
        </Stack>
    );
};
