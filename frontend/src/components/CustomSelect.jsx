import { useEffect, useMemo, useRef, useState } from "react";

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Vali",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  fullWidth = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? "w-full" : "inline-block"} ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        className={`rounded-xl bg-[#ebebeb] text-black px-4 pr-10 text-left flex items-center justify-between ${fullWidth ? "w-full" : "min-w-42.5"} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${buttonClassName}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <svg
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 2L10 10L18 2"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div
          className={`absolute z-40 mt-2 ${fullWidth ? "w-full" : "min-w-full"} ${menuClassName}`}
        >
          <div className="rounded-xl">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`w-full text-left px-4 py-2.5 text-[20px] text-black bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] hover:bg-[#cecece] transition-colors ${isSelected ? "font-semibold" : ""}`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="truncate block">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
