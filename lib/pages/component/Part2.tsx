import React, { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { CountdownCircle } from "@/core/component/CountDownCircle";
import { PrimaryButton } from "@/core/component/button/PrimaryButton";
import { getPart2Data } from "@/core/services/LoadFileService";

type Part2DataType = {
    image: string;
    question: string[];
};
export const Part2 = () => {
    const [start, setStart] = useState(false);
    const [part2Data, setPart2Data] = useState<Part2DataType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);
    const [result0, setResult0] = useState<string>("");
    const [result1, setResult1] = useState<string>("");
    const [result2, setResult2] = useState<string>("");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [nextQuestion, setNextQuestion] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPart2Data();

            // Shuffle mảng
            const shuffledData = [...data];
            for (let i = shuffledData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
            }
            setPart2Data(shuffledData);
            if (data.length > 0) {
                setCurrentIndex(0);
            }
        };
        fetchData();
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
                } else if (questionIndex === 1) {
                    setResult1(audioUrl);
                } else if (questionIndex === 2) {
                    setResult2(audioUrl);
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
        }
    };

    return (
        <Stack className="h-100vh text-white">
            <Stack direction="row" className="w-full p-[5%]">
                <Stack flex={1}>
                    {showQuestion && <img src={`/images/part2/${part2Data[currentIndex]?.image}.PNG`} alt="" className="w-60" />}
                    <span className="flex-1 text-xl">{!showQuestion ? "Waiting ..." : part2Data[currentIndex]?.question[questionIndex]}</span>

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
                {questionIndex == 2 && !start && (
                    <Stack flex={1} direction={"column"} alignItems={"start"}>
                        <span className=" text-xl">{part2Data[currentIndex]?.question[0]}</span>
                        <span className=" text-xl">{part2Data[currentIndex]?.question[1]}</span>
                        <span className=" text-xl">{part2Data[currentIndex]?.question[2]}</span>
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
                    <PrimaryButton
                        title="Bắt đầu"
                        handleClick={() => {
                            setStart(true);
                            setShowQuestion(true);
                            startRecording(); // Bắt đầu ghi âm
                        }}
                    />
                    <PrimaryButton title="Chủ đề tiếp theo" handleClick={NextIndex} bgColor="#cccc00" />
                </>
            </Stack>
        </Stack>
    );
};
