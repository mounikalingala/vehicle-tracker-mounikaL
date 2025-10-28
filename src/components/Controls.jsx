import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { RxCounterClockwiseClock } from "react-icons/rx";

export default function Controls({
    onPlayPause,
    onReset,
    playing,
    speedMultiplier,
    setSpeedMultiplier,
    progress,
    onSeek,
    onConfigureToggle,
    configureOpen,
    day,
    setDay
}) {
    return (
        <div className="flex items-center absolute bottom-4 md:z-50 flex-col left-4 md:left-30 ">
            <div className="mb-4">
                <div className="bg-white rounded-2xl shadow-xl px-6 py-4 flex-col md:flex-row items-center gap-3 md:gap-6 w-[760px] max-w-[92vw]">
                    <div className="flex items-center gap-3 md:gap-6 ">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={Math.round(progress * 100)}
                            onChange={(e) => onSeek(Number(e.target.value) / 100)}
                            className="flex-1 h-1"
                        />

                        <div className="flex items-center gap-3 md:gap-6">
                            <button
                                onClick={onPlayPause}
                                className={`w-12 h-8 rounded-2xl flex items-center justify-center text-sm text-white shadow-md bg-blue-600`}
                            >
                                {playing ? <FaPause /> : <FaPlay />}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onReset} className="w-12 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center"><RxCounterClockwiseClock /></button>

                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="0.25"
                                max="4"
                                step="0.25"
                                value={speedMultiplier}
                                onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
                            />
                            <div className="w-4 md:w-12 text-right text-sm">{speedMultiplier}x</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="bg-white rounded-xl shadow-lg p-3 w-[760px] max-w-[92vw]">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Configure</div>
                        <button onClick={onConfigureToggle} className="text-slate-400">⌄</button>
                    </div>

                    {configureOpen && (
                        <div className="mt-3 space-y-2">
                            <select className="w-full border rounded px-2 py-1 text-sm">
                                <option>WIRELESS</option>
                                <option>GPS</option>
                                <option>ALL</option>
                            </select>

                            <select
                                className="w-full border rounded px-2 py-1 text-sm"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                            >
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="thisWeek">This Week</option>
                                <option value="prevWeek">Previous Week</option>
                                <option value="thisMonth">This Month</option>
                                <option value="prevMonth">Previous Month</option>
                                <option value="custom">Custom</option>
                            </select>

                            <div className="flex gap-2 ">
                                <button onClick={onConfigureToggle} className="flex-1 bg-blue-600 text-white rounded py-1 text-sm">SHOW</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
