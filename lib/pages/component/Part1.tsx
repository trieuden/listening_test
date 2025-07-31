import React, { useEffect, useRef, useState } from "react";
import {Stack} from "@mui/material";
import { CountdownCircle } from "@/core/component/CountDownCircle";
import { PrimaryButton } from "@/core/component/button/PrimaryButton";
import { getPart1Data } from "@/core/services/LoadFileService";

export const Part1 = () => {
    const [start, setStart] = useState(false);
    const [part1Data, setPart1Data] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);
    const [result, setResult] = useState<string>("");
    const [isClient, setIsClient] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Check if we're on client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPart1Data();
            // Shuffle mảng
            const shuffledData = [...data];
            for (let i = shuffledData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
            }
            setPart1Data(shuffledData);
            if (data.length > 0) {
                setCurrentIndex(0);
            }
        };
        fetchData();
    }, []);

    const startRecording = async () => {
        // Check if we're in browser environment
        if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
            console.error('Media devices not available');
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
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };

    const handleCountdownEnd = () => {
        stopRecording();
        setStart(false);
    };

    const NextIndex = () => {
        if (currentIndex < part1Data.length - 1) {
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
                    <span className="flex-1 text-xl">{!showQuestion ? "Waiting ..." : part1Data[currentIndex]}</span>
                    {result && isClient && (
                        <audio controls src={result} className="mt-4">
                            <track kind="captions" srcLang="vi" label="No captions available" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </Stack>

                <CountdownCircle start={start} setStart={setStart} onCountdownEnd={handleCountdownEnd} />
            </Stack>

            <Stack direction="row" className="w-full justify-center" spacing={2}>
                {isClient && (
                    <>
                        <PrimaryButton
                            title="Bắt đầu"
                            handleClick={() => {
                                setStart(true);
                                setShowQuestion(true);
                                startRecording(); // Bắt đầu ghi âm
                            }}
                        />
                        <PrimaryButton title="Tiếp theo" handleClick={NextIndex} bgColor="#cccc00" />
                        <PrimaryButton
                            title="Dừng"
                            handleClick={() => {
                                stopRecording(); // Dừng ghi âm
                                setStart(false);
                            }}
                        />
                    </>
                )}
            </Stack>
        </Stack>
    );
};
