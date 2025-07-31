"use client";

import React, { useState } from "react";
import { Button, Box, Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

type ButtonProps = {
    title: string;
    handleClick?: () => Promise<void> | void;
    icon?: React.ReactNode;
    isTransform?: boolean;
    width?: string;
    bgColor?: string;
    tooltip?: string;
};

export const PrimaryButton = ({ title, handleClick, icon, isTransform, width, bgColor, tooltip }: ButtonProps) => {
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        if (!handleClick) return;

        try {
            setLoading(true);
            await handleClick();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tooltip title={tooltip || ""} disableHoverListener={!tooltip}>
            <Box width={width || "auto"} display="flex" justifyContent="center" alignItems="center">
                <Button
                    variant="contained"
                    fullWidth
                    disabled={!handleClick || loading}
                    sx={{
                        borderRadius: 2,
                        textTransform: isTransform ? "none" : "",
                        height: "38px",
                        fontWeight: 600,
                        backgroundColor: !handleClick || loading ? "rgba(145, 158, 171, 0.24)" : bgColor || "#1976d2",
                        color: !handleClick || loading ? "rgba(145, 158, 171, 0.32)" : "#fff",
                        "& .MuiButton-startIcon": {
                            "& > *:first-of-type": {
                                fontSize: "1.5rem",
                            },
                        },
                        "&:hover": {
                            backgroundColor: "rgba(145, 158, 171, 0.24)",
                        },
                    }}
                    onClick={onClick}
                    startIcon={icon}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : <span>{title}</span>}
                </Button>
            </Box>
        </Tooltip>
    );
};