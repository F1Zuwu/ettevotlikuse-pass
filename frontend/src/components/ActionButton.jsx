const ActionButton = ({
  label,
  accent = "bg-main-pink",
  onClick,
  disabled = false,
  type = "button",
  iconSrc,
  iconNode,
  iconAlt = "",
  className = "",
  textClassName = "",
  iconClassName = "h-5 w-5",
}) => {
  const outerClasses = [
    "rounded-full p-px",
    accent,
    disabled && "opacity-50 cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const middleClasses = ["block rounded-full p-px pl-3", accent].join(" ");

  const innerClasses = [
  "block rounded-full bg-black text-white leading-none px-4 py-2 text-[20px]",
  textClassName,
]
  .filter(Boolean)
  .join(" ");

  const icon = iconNode || (
    iconSrc ? <img src={iconSrc} alt={iconAlt} className={iconClassName} /> : null
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={outerClasses}
    >
      <span className={middleClasses}>
        <span className={innerClasses}>
          <span className="flex items-center justify-start gap-2 whitespace-nowrap">
            {icon && <span className="flex items-center leading-none">{icon}</span>}
            <span className="leading-none">{label}</span>
          </span>
        </span>
      </span>
    </button>
  );
};

export default ActionButton;