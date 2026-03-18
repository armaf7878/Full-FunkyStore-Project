function Input({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    error,
    required = false,
    className = "",
    disabled = false
}) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-n-50 font-Genos">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-4 py-2.5 bg-[#020B0A] border rounded-lg text-n-100 font-Genos placeholder:text-n-50/50 focus:outline-none focus:border-p-50 transition-colors
                    ${error ? 'border-red-500' : 'border-n-200'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            />
            {error && (
                <span className="text-sm text-red-500">{error}</span>
            )}
        </div>
    );
}

function Select({ 
    label, 
    value, 
    onChange, 
    options, 
    error,
    required = false,
    className = "",
    disabled = false
}) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-n-50 font-Genos">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-4 py-2.5 bg-[#020B0A] border rounded-lg text-n-100 font-Genos focus:outline-none focus:border-p-50 transition-colors appearance-none
                    ${error ? 'border-red-500' : 'border-n-200'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#020B0A]">
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <span className="text-sm text-red-500">{error}</span>
            )}
        </div>
    );
}

export { Input, Select };
