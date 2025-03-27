export function Avatar({ src, fallback, className }) {
    return (
        <div className={`relative w-10 h-10 rounded-full overflow-hidden border-2 border-white ring-2 ring-white ${className}`}>
            {src ? <img src={src} alt="avatar" className="w-full h-full object-cover" /> : fallback}
        </div>
    );
}