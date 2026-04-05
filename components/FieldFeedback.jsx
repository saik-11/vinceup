import { CircleCheckBig, CircleX } from "lucide-react";

/**
 * Inline feedback for form fields.
 *
 * @param {"error" | "success" | "hint" | "block-error" | "block-success"} variant
 * @param {string} message
 */
const FieldFeedback = ({ variant = "hint", message }) => {
  if (!message) return null;

  const styles = {
    error: {
      wrapper: "text-destructive",
      Icon: CircleX,
    },
    success: {
      wrapper: "text-emerald-600",
      Icon: CircleCheckBig,
    },
    hint: {
      wrapper: "text-muted-foreground",
      Icon: null,
    },
    "block-success": {
      wrapper:
        "flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700",
      Icon: CircleCheckBig,
    },
    "block-error": {
      wrapper:
        "flex items-start gap-3 rounded-xl bg-destructive/10 p-4 text-destructive",
      Icon: CircleX,
    },
  };

  const { wrapper, Icon } = styles[variant];

  if (variant === "block-success" || variant === "block-error") {
    return (
      <div className={wrapper}>
        {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0" />}
        <div className="text-sm leading-relaxed">{message}</div>
      </div>
    );
  }

  return (
    <p className={`mt-1.5 flex items-center gap-1.5 text-sm ${wrapper}`}>
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {message}
    </p>
  );
};

export default FieldFeedback;
