export function Card({ children, className }) {
    return <div className={`bg-white rounded-xl shadow-md p-4 ${className}`}>{children}</div>
}

export function CardHeader({ children }) {
    return <div className="mb-4">{children}</div>;
}

export function CardTitle({ children }) {
    return <h2 className="text-lg font-bold text-gray-900">{children}</h2>;
}

export function CardDescription({ children }) {
    return <p className="text-sm text-gray-600">{children}</p>;
}

export function CardContent({ children }) {
    return <div className="mb-4">{children}</div>;
}

export function CardFooter({ children }) {
    return <div className="pt-4 border-t">{children}</div>;
}