const GroupButton = ({ onClick, children, disabled = false, className = "" }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-6 py-3 rounded-xl text-white font-semibold transition shadow-md 
                ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} 
                ${className}`}
        >
            {children}
        </button>
    );
};
export default GroupButton;