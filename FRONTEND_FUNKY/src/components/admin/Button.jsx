function Button({ 
    children, 
    onClick, 
    variant = "primary", 
    size = "md", 
    className = "",
    disabled = false,
    type = "button"
}) {
    const baseClasses = "font-Genos font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";
    
    const variants = {
        primary: "bg-p-50 text-[#020B0A] hover:bg-p-50/80",
        secondary: "bg-n-200 text-n-100 hover:bg-n-200/80",
        outline: "border-2 border-n-200 text-n-100 hover:border-n-100 hover:text-n-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
        ghost: "text-n-50 hover:text-n-100 hover:bg-n-200/30"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;
