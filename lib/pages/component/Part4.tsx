import React, { use, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { CountdownCircle } from "@/core/component/CountDownCircle";
import { PrimaryButton } from "@/core/component/button/PrimaryButton";
import { getPart4Data } from "@/core/services/LoadFileService";

type Part4DataProps = {
    part4Data: {
        question: string;
        suggestion: string[];
    }[];
};

export const Part4 = ({ part4Data }: Part4DataProps) => {
    const [start, setStart] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);
    const [result, setResult] = useState<string>("");
    const [isClient, setIsClient] = useState(false);
    const [setUpTime, setSetUpTime] = useState(true);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Check if we're on client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (part4Data.length > 0) {
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
    useEffect(() => {
        if (!setUpTime) {
            startRecording(); // Bắt đầu ghi âm
        }
    }, [setUpTime]);

    const handleCountdownEnd = () => {
        //xử lý khi đếm ngược kết thúc
        stopRecording();
        setStart(false);
    };

    const NextIndex = () => {
        if (currentIndex < part4Data.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setStart(false);
            setShowQuestion(false);
            setResult("");
        }
    };

    return (
        <Stack className="h-100vh text-white">
            <Stack direction="row" className="w-full p-[5%]">
                <Stack flex={1}>
                    <span className="flex-1 text-xl">{!showQuestion ? "Waiting ..." : part4Data[currentIndex].question}</span>
                    {showQuestion && (
                        <ul className="list-disc pl-5">
                            {part4Data[currentIndex]?.suggestion?.map((item, index) => (
                                <li key={index} className="text-lg">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    {result && isClient && (
                        <audio controls src={result} className="mt-4">
                            <track kind="captions" srcLang="vi" label="No captions available" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </Stack>

                <Stack spacing={1}>
                    {setUpTime ? (
                        <CountdownCircle start={start} setStart={setStart} onCountdownEnd={() => setSetUpTime(false)} time={60} delayTime={false} />
                    ) : (
                        <CountdownCircle start={start} setStart={setStart} onCountdownEnd={handleCountdownEnd} time={120} />
                    )}
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
                        <PrimaryButton
                            title="Bắt đầu"
                            handleClick={() => {
                                setStart(true);
                                setShowQuestion(true);
                            }}
                        />
                        <PrimaryButton title="Câu tiếp theo" handleClick={NextIndex} bgColor="#cccc00" />
                    </>
                )}
            </Stack>
        </Stack>
    );
};
