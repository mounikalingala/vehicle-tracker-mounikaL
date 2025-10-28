import React from "react";
import { FaCarAlt, FaLocationArrow } from "react-icons/fa";
import { IoMdTime, IoIosTimer, IoMdBatteryFull, IoMdLock } from "react-icons/io";
import { RiKeyFill } from "react-icons/ri";
import { LuSnowflake } from "react-icons/lu";
import { BsFuelPumpFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6"
export default function InfoCard({ point, infoClose, extra, areaName }) {
    return (
        <div className="absolute z-60 left-1/2 transform -translate-x-1/2 top-20 w-[360px] bg-white rounded-xl shadow-2xl  p-4 ">
            <div className="flex justify-end ">
                <button onClick={infoClose} className="text-slate-400 hover:text-slate-600 mr-1 text-lg font-extrabold ">✕</button>
            </div>
            <div className="flex justify-between items-center  ">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl"><FaCarAlt /></div>
                    <div className="text-sm font-semibold">WIRELESS</div>
                </div>

                <div className="text-sm text-green-500 font-bold flex gap-1 items-center "><span className="font-bold"><IoMdTime size={17} /></span>{point?.timestamp ? new Date(point.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
                    : "-"}</div>
            </div>
            <div className="col-span-3 mt-2">
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-900"><span className="text-teal-600"><FaLocationDot size={20} /></span>{areaName}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                <div className="flex flex-col items-center">
                    <div><IoIosTimer size={20} className="font-bold text-green-900" /></div>
                    <div className="text-sm font-semibold">{extra.speed ?? "0.00"} km/h</div>
                    <div className="text-slate-400">Speed</div>
                </div>
                <div className="flex flex-col items-center mt-1 ">
                    <div><FaLocationArrow size={17} className="font-bold text-purple-600 -rotate-44 " /></div>
                    <div className="text-sm font-semibold">{extra.distance || "0.00"} km</div>
                    <div className="text-slate-400">Distance</div>
                </div>
                <div className="flex flex-col items-center">
                    <div><IoMdBatteryFull size={20} className="font-bold text-teal-500" /></div>
                    <div className="text-sm font-semibold">{extra.battery ?? "16"}%</div>
                    <div className="text-slate-400">Battery</div>
                </div>

                <div>
                    <div className="text-sm font-semibold">{extra.totalDistance ?? "834.89"} km</div>
                    <div className="text-slate-400">Total Distance</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">{extra.todayRunning ?? "00h:00m"}</div>
                    <div className="text-slate-400">Distance From Last Stop</div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">0h.00m</div>
                    <div className="text-slate-400">Today Running</div>
                </div>
                <div className="flex flex-col items-center mt-1 ">
                    <div className="text-sm font-semibold"> 07h:10m</div>
                    <div className="text-slate-400">Today Stopped</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">00h:00m</div>
                    <div className="text-slate-400">Today Idle</div>
                </div>

                <div>
                    <div className="text-sm font-semibold">STOPPED</div>
                    <div className="text-slate-400">Current Status</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">0.00 km/h</div>
                    <div className="text-slate-400">Today Max Speed</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">{extra.todayStopped ?? "07h:10m"}</div>
                    <div className="text-slate-400">Stopped</div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">0h.00m</div>
                    <div className="text-slate-400">Today Ignition On</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">0h.00m</div>
                    <div className="text-slate-400">Today Ignition Off</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">0h.00m</div>
                    <div className="text-slate-400">Ignition Off Since</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">0h.00m</div>
                    <div className="text-slate-400">Today AC On</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">0h.00m</div>
                    <div className="text-slate-400">Today AC Off</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">0h.00m</div>
                    <div className="text-slate-400">AC Off Since</div>
                </div>
                <div className="flex flex-col items-center mt-1 ">
                    <div className="text-sm font-semibold">16 %</div>
                    <div className="text-slate-400">Custom Value1</div>
                </div>
            </div>

            <div className="flex justify-center gap-3 text-amber-600 text-xl mt-4">
                <button className="w-12 h-8 rounded-full bg-orange-100 flex items-center justify-center"><RiKeyFill /></button>
                <button className="w-12 h-8 rounded-full bg-orange-100 flex items-center justify-center"><IoMdBatteryFull /></button>
                <button className="w-12 h-8 rounded-full bg-orange-100 flex items-center justify-center"><LuSnowflake /></button>
                <button className="w-12 h-8 rounded-full bg-orange-100 flex items-center justify-center"><BsFuelPumpFill /></button>
                <button className="w-12 h-8 rounded-full bg-orange-100 flex items-center justify-center"><IoMdLock /></button>
            </div>

        </div>
    );
}
