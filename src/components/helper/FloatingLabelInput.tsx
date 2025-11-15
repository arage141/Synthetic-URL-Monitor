import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";
import React from "react";

type FloatingLabelInputProps = TextFieldProps & {
  label: string;
  placeholder?: string;
  size?: "small" | "medium";
};

const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(
  (
    {
      label,
      placeholder,
      type = "text",
      size = "small",
      fullWidth = true,
      sx,
      InputProps,
      FormHelperTextProps,
      ...rest
    },
    ref
  ) => {
    const defaultSx = {
      "& .MuiOutlinedInput-root": {
        backgroundColor: "#FFFFFF",

        "& fieldset": {
          borderColor: "#D1DFFF",
        },

        "&:hover fieldset": {
          borderColor: "#5B7FFF",
        },

        "&.Mui-focused fieldset": {
          borderColor: "primary.main",
        },

        "&.Mui-error fieldset": {
          borderColor: "#d32f2f",
        },

        "& input:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
          WebkitTextFillColor: "#000000 !important",
          caretColor: "#000000 !important",
        },

        "& input:-webkit-autofill:hover": {
          WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
        },

        "& input:-webkit-autofill:focus": {
          WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
        },
      },

      "& .MuiFormHelperText-root": {
        margin: 0,
        backgroundColor: "#F9FAFF",
        fontSize: "0.8rem",
      },
    };

    return (
      <TextField
        label={label}
        placeholder={placeholder}
        type={type}
        variant="outlined"
        fullWidth={fullWidth}
        size={size}
        inputRef={ref}
        sx={{ ...defaultSx, ...sx }}
        InputProps={{
          ...InputProps,
          sx: {
            ...(InputProps?.sx || {}),
          },
        }}
        FormHelperTextProps={{
          ...FormHelperTextProps,
          sx: {
            backgroundColor: "transparent",
            ...(FormHelperTextProps?.sx || {}),
          },
        }}
        {...rest}
      />
    );
  }
);

export default FloatingLabelInput;
