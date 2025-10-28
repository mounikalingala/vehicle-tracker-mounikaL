import React from "react";
import VehicleMap from "./VehicleMap";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="h-16 flex items-center justify-between px-4 bg-white/60 backdrop-blur-sm border-b">
        <div className="w-8 h-8" />
        <div className="flex-1" />
        <div className="w-8 h-8" />
      </div>

      <main className="flex-1">
        <VehicleMap />
      </main>
    </div>
  );
}
