import { Minus, Plus } from "lucide-react";
import React from "react";

function ParticipantCounter({ label, icon, value, onChange, max = 10, other = 0, type = "generic" }) {
    const increment = () => {
        if (type === "gender") {
            if (value + other < max) onChange(value + 1);
        } else {
            if (value < max) onChange(value + 1);
        }
    };

    const decrement = () => {
        if (value > 0) onChange(value - 1);
    };

    return (
        <div className="flex flex-col w-full">
            <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
        <span className={label === "여성" ? "text-pink-500" : label === "남성" ? "text-blue-500" : "text-gray-600"}>
          {icon}
        </span>
                {label}
            </label>
            <div className="flex items-center justify-between border rounded-md px-3 py-2">
                <button
                    type="button"
                    onClick={decrement}
                    className="text-gray-500 hover:text-gray-800 disabled:text-gray-300"
                    disabled={value === 0}
                >
                    <Minus size={18} />
                </button>
                <span className="text-sm font-medium">{value}명</span>
                <button
                    type="button"
                    onClick={increment}
                    className="text-gray-500 hover:text-gray-800 disabled:text-gray-300"
                    disabled={type === "gender" ? value + other >= max : value >= max}
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
}


export default function ParticipantCounters({ max, female, male, onMaxChange, onFemaleChange, onMaleChange }) {
    return (
        <div className="space-y-3">
                <ParticipantCounter label="최대 인원" value={max} onChange={onMaxChange} max={10} type="max" />
            <div className="grid grid-cols-2 gap-4">
                <ParticipantCounter
                    label="여성"
                    icon="♀"
                    value={female}
                    other={male}
                    max={max}
                    onChange={onFemaleChange}
                    type="gender"
                />
                <ParticipantCounter
                    label="남성"
                    icon="♂"
                    value={male}
                    other={female}
                    max={max}
                    onChange={onMaleChange}
                    type="gender"
                />
            </div>
        </div>
    );
}