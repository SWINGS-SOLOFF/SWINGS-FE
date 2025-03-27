export function GolfButton({ children, variant = "primary", className }) {
    const baseStyle = "w-full text-lg font-medium py-3 rounded-lg transition-all duration-300";
    const variantStyle = variant === "primary" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 hover:bg-gray-400 text-black";

    return (
        <button className={`${baseStyle} ${variantStyle} ${className}`}>{children}</button>
    );
}