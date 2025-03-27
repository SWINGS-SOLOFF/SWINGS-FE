export function Badge({ children, className }) {
    return <span className={`px-3 py-1 text-sm rounded-full text-white ${className}`}>{children}</span>;
}