import {cva} from "class-variance-authority";
import {cn} from "../../utils/cn.js";  // class-variance-authority


const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                success: "border-transparent bg-golf-green-500 text-white hover:bg-golf-green-600",
                warning: "border-transparent bg-golf-sand-500 text-white hover:bg-golf-sand-600",
                info: "border-transparent bg-golf-sky-500 text-white hover:bg-golf-sky-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }