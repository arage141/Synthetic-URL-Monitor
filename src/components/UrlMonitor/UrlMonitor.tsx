import { Box, Button, Checkbox, Paper, Stack, Typography } from "@mui/material";
import FloatingLabelInput from "../helper/FloatingLabelInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.url("Invalid URL"),
  interval: z
    .string()
    .refine((val) => val !== "", "Interval is required")
    .refine((val) => Number(val) >= 0, "Interval must be >= 0"),
  timeout: z
    .string()
    .refine((val) => val !== "", "Timeout is required")
    .refine((val) => Number(val) >= 0, "Timeout must be >= 0"),
  expectedCodes: z
    .string()
    .min(1, "Expected codes are required")
    .refine((val) => {
      const codes = val.split(",").map((v) => v.trim());
      return codes.every((code) => /^\d{3}$/.test(code));
    }, "Must be comma-separated 3-digit codes (e.g., 200, 201, 404)"),
  enabled: z.boolean().optional(), // no validation, but required for resolver
});

type FormType = z.infer<typeof formSchema>;

interface URLObject {
  name: string;
  url: string;
  interval: number;
  timeout: number;
  expectedCodes: number[];
  enabled?: boolean | undefined;
}

interface ApiResponseUrl {
  id: string;
  name: string;
  url: string;
  date: string;
  statusCode: string;
  responseTime: string;
}

const mockApiResponse: ApiResponseUrl[] = [
  {
    id: "1",
    name: "test 1",
    url: "https://example1.com",
    date: "1730970720000",
    responseTime: "150",
    statusCode: "200",
  },
  {
    id: "2",
    name: "test 2",
    url: "https://example2.com",
    date: "1730972520000",
    responseTime: "320",
    statusCode: "500",
  },
  {
    id: "3",
    name: "test 3",
    url: "https://example3.com",
    date: "1830972520000",
    responseTime: "420",
    statusCode: "403",
  },
];

const formatEpoch = (epochString: string) => {
  const date = new Date(Number(epochString));
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const UrlMonitor = () => {
  const [urlArray, setUrlArray] = useState<URLObject[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      interval: "",
      timeout: "",
      expectedCodes: "",
      enabled: false,
    },
  });

  const onSubmit = (data: FormType) => {
    const payload = {
      ...data,
      interval: Number(data.interval),
      timeout: Number(data.timeout),
      expectedCodes:
        data.expectedCodes
          ?.split(",")
          .map((v) => Number(v.trim()))
          .filter((n) => !isNaN(n)) || [],
    };

    console.log("Final Payload:", payload);
    setUrlArray((prev) => [...prev, payload]);
    reset();
  };

  console.log(urlArray);

  return (
    <Box py={3} px={12}>
      <Box>
        <Typography variant="h6">Synthetic URL Monitor</Typography>
        <Typography variant="body1">
          Monitor your URLs and get alerted when they go down or return errors
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper
          sx={{
            border: "1px solid #D1DFFF",
            p: 2,
            mt: 2,
            borderRadius: 1,
            bgcolor: "#F9FAFF",
            width: "40%",
            boxShadow: "0px 2.5px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} px={1}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1">URL Configurations</Typography>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ fontSize: "0.9rem", width: "100px" }}
                >
                  Add URL
                </Button>
              </Box>

              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Add New URL
                </Typography>

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FloatingLabelInput
                      {...field}
                      label="Name"
                      placeholder="Enter URL Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ py: 0, bgcolor: "#FFFFFF" }}
                    />
                  )}
                />

                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <FloatingLabelInput
                      {...field}
                      label="URL"
                      placeholder="Enter URL"
                      error={!!errors.url}
                      helperText={errors.url?.message}
                      sx={{ py: 0, bgcolor: "#FFFFFF" }}
                    />
                  )}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Controller
                    name="interval"
                    control={control}
                    render={({ field }) => (
                      <FloatingLabelInput
                        {...field}
                        type="number"
                        inputProps={{ min: 0 }}
                        label="Interval"
                        placeholder="Enter interval in seconds"
                        error={!!errors.interval}
                        helperText={errors.interval?.message}
                        sx={{ flex: 1, py: 0, bgcolor: "#FFFFFF" }}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") field.onChange("");
                          else if (/^\d+$/.test(v)) {
                            field.onChange(Math.max(0, Number(v)).toString());
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                              "Tab",
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="timeout"
                    control={control}
                    render={({ field }) => (
                      <FloatingLabelInput
                        {...field}
                        type="number"
                        inputProps={{ min: 0 }}
                        label="Timeout"
                        placeholder="Enter timeout in seconds"
                        error={!!errors.timeout}
                        helperText={errors.timeout?.message}
                        sx={{ flex: 1, py: 0, bgcolor: "#FFFFFF" }}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") field.onChange("");
                          else if (/^\d+$/.test(v)) {
                            field.onChange(Math.max(0, Number(v)).toString());
                          }
                        }}
                        onKeyDown={(e) => {
                          // Prevent typing letters, special characters (except Backspace, Delete, Arrow keys, Tab)
                          if (
                            !/[0-9]/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                              "Tab",
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                  />
                </Box>

                <Controller
                  name="expectedCodes"
                  control={control}
                  render={({ field }) => (
                    <FloatingLabelInput
                      {...field}
                      label="Expected Codes"
                      placeholder="Enter expected codes"
                      error={!!errors.expectedCodes}
                      helperText={errors.expectedCodes?.message}
                      sx={{ py: 0, bgcolor: "#FFFFFF" }}
                    />
                  )}
                />

                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        sx={{
                          ml: -1.5,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Enabled (in maintenance if unchecked)
                      </Typography>
                    </Box>
                  )}
                />

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ fontSize: "0.9rem", px: 3 }}
                  >
                    Add URL
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{ fontSize: "0.9rem", px: 3 }}
                    onClick={() => reset()}
                  >
                    Cancel
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </form>
        </Paper>

        <Paper
          sx={{
            border: "1px solid #D1DFFF",
            p: 2,
            mt: 2,
            borderRadius: 1,
            bgcolor: "#F9FAFF",
            width: "60%",
            boxShadow: "0px 2.5px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack spacing={4} px={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1">Recent Results</Typography>
              <Button
                variant="contained"
                sx={{
                  fontSize: "0.9rem",
                  width: "120px",
                  background:
                    "linear-gradient(90deg, #0CB65A 0%, #4ADE80 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #0AA84F 0%, #3FD370 100%)",
                  },
                }}
              >
                Check Now
              </Button>
            </Box>

            <Stack spacing={2}>
              {mockApiResponse.map(
                ({ id, name, url, date, statusCode, responseTime }) => (
                  <Box
                    key={id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "end",
                      py: 1,
                      px: 2,
                      bgcolor: "#FFFFFF",
                      borderRadius: 1,
                      border: "1px solid #D1DFFF",
                    }}
                  >
                    <Box>
                      <Box display="flex" gap={1} alignItems="center">
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            bgcolor: "#0CB65A",
                            borderRadius: "50%",
                            mt: 0.5,
                          }}
                        />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {name}
                        </Typography>
                      </Box>

                      <Typography variant="subtitle1">{url}</Typography>

                      <Box display="flex" gap={1}>
                        <Typography variant="subtitle1">
                          {statusCode}
                        </Typography>
                        <Typography variant="subtitle1">
                          {responseTime}ms
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {formatEpoch(date)}
                    </Typography>
                  </Box>
                )
              )}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default UrlMonitor;
