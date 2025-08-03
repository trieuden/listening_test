import React, { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { CountdownCircle } from "@/core/component/CountDownCircle";
import { PrimaryButton } from "@/core/component/button/PrimaryButton";
import { getPart2Data } from "@/core/services/LoadFileService";

type Part2DataProps = {
    part2Data: {
        image: string;
        question: string[];
    }[];
    handleGetResult_1?: (result: string) => void;
    handleGetResult_2?: (result: string) => void;
    handleGetResult_3?: (result: string) => void;
};
export const Part2 = ({ part2Data, handleGetResult_1, handleGetResult_2, handleGetResult_3 }: Part2DataProps) => {
    const [start, setStart] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);
    const [result0, setResult0] = useState<string>("");
    const [result1, setResult1] = useState<string>("");
    const [result2, setResult2] = useState<string>("");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [nextQuestion, setNextQuestion] = useState(false);
    const [isButtonStartDisabled, setIsButtonStartDisabled] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (part2Data.length > 0) {
            setCurrentIndex(0);
        }
    }, []);

    useEffect(() => {
        if (nextQuestion) {
            setStart(true);
            startRecording();
        }
        setNextQuestion(false);
    }, [nextQuestion]);

    const startRecording = async () => {
        // Check if we're in browser environment
        if (typeof navigator === "undefined" || !navigator.mediaDevices) {
            console.error("Media devices not available");
            return;
        }

        try {
            // Stop and cleanup previous stream if exists
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const audioUrl = URL.createObjectURL(audioBlob);
                if (questionIndex === 0) {
                    setResult0(audioUrl);
                    handleGetResult_1?.(audioUrl);
                } else if (questionIndex === 1) {
                    setResult1(audioUrl);
                    handleGetResult_2?.(audioUrl);
                } else if (questionIndex === 2) {
                    setResult2(audioUrl);
                    handleGetResult_3?.(audioUrl);
                }

                // Clean up stream after recording stops
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                    streamRef.current = null;
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
        stopRecording(); // Dừng ghi âm
        setStart(false);
        if (questionIndex < 2) {
            setQuestionIndex(questionIndex + 1);
            setNextQuestion(true); // Chuyển sang câu hỏi tiếp theo
        }
    };

    const NextIndex = () => {
        if (currentIndex < part2Data.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setStart(false);
            setShowQuestion(false);
            setResult0("");
            setResult1("");
            setResult2("");
            setQuestionIndex(0);
            setIsButtonStartDisabled(false);
        }
    };

    return (
        <Stack className="h-100vh text-white">
            <Stack direction="row" className="w-full p-[5%]">
                <Stack flex={1}>
                    {showQuestion && <img src={`/images/part2/${part2Data[currentIndex]?.image}.PNG`} alt="" className="w-60" />}
                    <span className="flex-1 text-2xl mt-4">{!showQuestion ? "Waiting ..." : part2Data[currentIndex]?.question[questionIndex]}</span>
                </Stack>
                {questionIndex == 2 && !start && (
                    <Stack flex={1} >
                        <Stack direction={"column"} alignItems={"start"}>
                            <span className=" text-xl">{part2Data[currentIndex]?.question[0]}</span>
                            <span className=" text-xl">{part2Data[currentIndex]?.question[1]}</span>
                            <span className=" text-xl">{part2Data[currentIndex]?.question[2]}</span>
                        </Stack>
                        {result0 && (
                            <audio controls src={result0} className="mt-4">
                                <track kind="captions" srcLang="vi" label="No captions available" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        {result1 && (
                            <audio controls src={result1} className="mt-4">
                                <track kind="captions" srcLang="vi" label="No captions available" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        {result2 && (
                            <audio controls src={result2} className="mt-4">
                                <track kind="captions" srcLang="vi" label="No captions available" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </Stack>
                )}
                <Stack spacing={1}>
                    <CountdownCircle start={start} setStart={setStart} onCountdownEnd={handleCountdownEnd} time={45} />
                    {start && (
                        <PrimaryButton
                            title="Dừng"
                            handleClick={() => {
                                stopRecording(); // Dừng ghi âm
                                setStart(false);
                                if (questionIndex < 2) {
                                    setQuestionIndex(questionIndex + 1);
                                    setNextQuestion(true); // Chuyển sang câu hỏi tiếp theo
                                }
                            }}
                        />
                    )}
                </Stack>
            </Stack>

            <Stack direction="row" className="w-full justify-center" spacing={2}>
                <>
                    {!isButtonStartDisabled && (
                        <PrimaryButton
                            title="Bắt đầu"
                            handleClick={() => {
                                setStart(true);
                                setShowQuestion(true);
                                startRecording(); // Bắt đầu ghi âm
                                setIsButtonStartDisabled(true);
                            }}
                        />
                    )}
                    {part2Data.length > 1 && <PrimaryButton title="Chủ đề tiếp theo" handleClick={NextIndex} bgColor="#cccc00" />}
                </>
            </Stack>
        </Stack>
    );
};
