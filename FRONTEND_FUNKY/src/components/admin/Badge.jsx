function Badge({ children, variant = "default" }) {
    const variants = {
        default: "bg-n-200/30 text-n-100",
        success: "bg-green-500/20 text-green-400",
        warning: "bg-yellow-500/20 text-yellow-400",
        danger: "bg-red-500/20 text-red-400",
        info: "bg-blue-500/20 text-blue-400",
        purple: "bg-purple-500/20 text-purple-400"
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-Genos ${variants[variant]}`}>
            {children}
        </span>
    );
}

export default Badge;
