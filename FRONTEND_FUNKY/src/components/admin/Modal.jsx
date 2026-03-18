function Modal({ isOpen, onClose, title, children, size = "md" }) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className={`relative w-full ${sizeClasses[size]} mx-4 bg-[#020B0A] border border-n-200 rounded-xl shadow-2xl`}>
                <div className="flex items-center justify-between p-6 border-b border-n-200">
                    <h2 className="text-2xl font-semibold text-n-100 font-Genos">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-n-50 hover:text-n-100 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
