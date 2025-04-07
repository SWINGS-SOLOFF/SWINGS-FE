const GroupButton = ({ onClick, children, disabled = false, className = "" }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-6 py-3 rounded-2xl font-semibold border transition
                ${disabled
                ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                : "bg-white text-black border-black hover:bg-black hover:text-white"}
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default GroupButton;
