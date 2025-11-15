import {
  Box,
  Button,
  Checkbox,
  Paper,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardContent,
  Card,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import FloatingLabelInput from "../helper/FloatingLabelInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Add global styles for animations
const animationStyles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      max-height: 1000px;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      max-height: 1000px;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      max-height: 0;
      transform: translateY(-20px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes chartFadeInSlide {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes chartPulse {
    0% {
      box-shadow: 0px 8px 32px rgba(91, 127, 255, 0.12);
    }
    50% {
      box-shadow: 0px 12px 40px rgba(91, 127, 255, 0.28);
    }
    100% {
      box-shadow: 0px 8px 32px rgba(91, 127, 255, 0.12);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

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
  enabled: z.boolean().optional(),
});

type FormType = z.infer<typeof formSchema>;

interface URLObject {
  id: string;
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

interface UrlStats {
  totalUrls: number;
  healthy: number;
  failing: number;
  lastCheck: string; // epoch string
  totalChecks: number;
  successRate: number;
  avgResponseTime: number;
}

interface MonitoringStatus {
  id: string;
  name: string;
  url: string;
  avgResponseTime: number;
  successRate: number;
  totalChecks: number;
  status: "HEALTHY" | "FAILING" | "DEGRADED";
  lastCode: number;
}

const urlStatsData: UrlStats = {
  totalUrls: 1,
  healthy: 1,
  failing: 0,
  lastCheck: "1762519842000",
  totalChecks: 520,
  successRate: 75.77,
  avgResponseTime: 597.97,
};

const monitoringStatusData: MonitoringStatus[] = [
  {
    id: "1",
    name: "Jenkins API",
    url: "https://jenkins.cloudtuner.ai",
    avgResponseTime: 243,
    successRate: 92,
    totalChecks: 100,
    status: "HEALTHY",
    lastCode: 403,
  },
  // {
  //   id: "2",
  //   name: "Backend Service",
  //   url: "https://api.example.com",
  //   avgResponseTime: 156,
  //   successRate: 98,
  //   totalChecks: 100,
  //   status: "HEALTHY",
  //   lastCode: 200,
  // },
  // {
  //   id: "3",
  //   name: "Frontend Server",
  //   url: "https://app.example.com",
  //   avgResponseTime: 320,
  //   successRate: 85,
  //   totalChecks: 100,
  //   status: "DEGRADED",
  //   lastCode: 500,
  // },
];

// Chart data structure for Daily Response Time Trends
interface ChartDataPoint {
  time: string;
  "Jenkins API": number;
  "Backend Service": number;
  "Frontend Server": number;
}

const chartData: ChartDataPoint[] = [
  {
    time: "12:00",
    "Jenkins API": 245,
    "Backend Service": 142,
    "Frontend Server": 310,
  },
  {
    time: "13:00",
    "Jenkins API": 218,
    "Backend Service": 158,
    "Frontend Server": 295,
  },
  {
    time: "14:00",
    "Jenkins API": 267,
    "Backend Service": 131,
    "Frontend Server": 342,
  },
  {
    time: "15:00",
    "Jenkins API": 189,
    "Backend Service": 165,
    "Frontend Server": 278,
  },
  {
    time: "16:00",
    "Jenkins API": 301,
    "Backend Service": 144,
    "Frontend Server": 398,
  },
  {
    time: "17:00",
    "Jenkins API": 242,
    "Backend Service": 176,
    "Frontend Server": 321,
  },
  {
    time: "18:00",
    "Jenkins API": 215,
    "Backend Service": 128,
    "Frontend Server": 289,
  },
  {
    time: "19:00",
    "Jenkins API": 256,
    "Backend Service": 152,
    "Frontend Server": 356,
  },
];

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

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  return (
    <Card
      sx={{
        background: color ?? "linear-gradient(135deg, #94A3B8, #64748B)",
        color: "white",
        minWidth: 250,
        borderRadius: 1,
        padding: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "0.25s ease",
        "&:hover": {
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          // transform: "translateY(-3px)",
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const UrlMonitor = () => {
  const [urlArray, setUrlArray] = useState<URLObject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedUrlForChart, setSelectedUrlForChart] =
    useState<string>("Jenkins API");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
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
    if (editingId) {
      // Edit mode
      setUrlArray((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: data.name,
                url: data.url,
                interval: Number(data.interval),
                timeout: Number(data.timeout),
                expectedCodes:
                  data.expectedCodes
                    ?.split(",")
                    .map((v) => Number(v.trim()))
                    .filter((n) => !isNaN(n)) || [],
                enabled: data.enabled,
              }
            : item
        )
      );
      setEditingId(null);
    } else {
      // Add mode
      const payload = {
        ...data,
        id: crypto.randomUUID(),
        interval: Number(data.interval),
        timeout: Number(data.timeout),
        expectedCodes:
          data.expectedCodes
            ?.split(",")
            .map((v) => Number(v.trim()))
            .filter((n) => !isNaN(n)) || [],
      };
      setUrlArray((prev) => [...prev, payload]);
    }
    reset();
    setShowForm(false);
  };

  const handleEditClick = (item: URLObject) => {
    setEditingId(item.id);
    setValue("name", item.name);
    setValue("url", item.url);
    setValue("interval", item.interval.toString());
    setValue("timeout", item.timeout.toString());
    setValue("expectedCodes", item.expectedCodes.join(", "));
    setValue("enabled", item.enabled);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setUrlArray((prev) => prev.filter((item) => item.id !== deleteId));
    }
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const handleCancelForm = () => {
    reset();
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Box py={3} px={12}>
      <Box>
        <Typography variant="h6">Synthetic URL Monitor</Typography>
        <Typography variant="body1">
          Monitor your URLs and get alerted when they go down or return errors
        </Typography>
      </Box>

      {/* Url configurations & Recent Results divs */}
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

                {urlArray.length > 0 && (
                  <Button
                    type="button"
                    variant="contained"
                    sx={{ fontSize: "0.9rem", width: "100px" }}
                    onClick={() => {
                      reset();
                      setEditingId(null);
                      setShowForm(!showForm);
                    }}
                  >
                    {showForm ? "Cancel" : "Add URL"}
                  </Button>
                )}
              </Box>

              {(showForm || urlArray.length === 0) && (
                <Stack
                  spacing={1}
                  sx={{
                    animation:
                      showForm || urlArray.length === 0
                        ? "slideDown 0.4s ease-out forwards"
                        : "slideUp 0.4s ease-out forwards",
                    overflow: "hidden",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {editingId ? "Edit URL" : "Add New URL"}
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
                      {editingId ? "Update URL" : "Add URL"}
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{ fontSize: "0.9rem", px: 3 }}
                      onClick={handleCancelForm}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Stack>
              )}

              <Stack
                spacing={2}
                mt={2}
                maxHeight={showForm ? 130 : 320}
                overflow="auto"
              >
                {urlArray &&
                  urlArray?.length > 0 &&
                  urlArray.map(
                    ({ id, name, url, interval, timeout, expectedCodes }) => (
                      <Box
                        key={id}
                        sx={{
                          py: 1,
                          px: 2,
                          bgcolor: "#FFFFFF",
                          borderRadius: 1,
                          border: "1px solid #D1DFFF",
                          animation: "fadeIn 0.3s ease-out forwards",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0px 2px 8px rgba(91, 127, 255, 0.2)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
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
                              <Typography variant="subtitle1">{url}</Typography>
                            </Box>

                            <Box display="flex" gap={1}>
                              <Typography variant="subtitle1">
                                Expected codes&#58;
                              </Typography>
                              {expectedCodes.map((code, idx) => (
                                <Typography key={idx} variant="subtitle1">
                                  {code}
                                  {idx !== expectedCodes.length - 1 && ","}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                          <Box display="flex" gap={1}>
                            <Typography variant="body2" color="text.secondary">
                              Interval&#58;{interval}s
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Timeout&#58;{timeout}s
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                          mt={2}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "0.9rem",
                              px: 3,
                              py: 0.5,
                            }}
                            onClick={() => {
                              const item: URLObject = {
                                id,
                                name,
                                url,
                                interval,
                                timeout,
                                expectedCodes,
                              };
                              handleEditClick(item);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "0.9rem",
                              px: 3,
                              py: 0.5,
                              background: "red",
                              "&:hover": {
                                background: "red",
                              },
                            }}
                            onClick={() => handleDeleteClick(id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    )
                  )}
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

      {/* Url Stats Cards */}
      <Box display="flex" flexWrap="wrap" gap={2} mt={4}>
        {Object.entries(urlStatsData).map(([key, value]) => {
          const formattedValue =
            key === "successRate"
              ? `${Number(value).toFixed(2)}%`
              : key === "lastCheck"
              ? formatEpoch(String(value))
              : value;

          const gradients: Record<string, string> = {
            healthy: "linear-gradient(135deg, #4ADE80, #22C55E)",
            failing: "linear-gradient(135deg, #F87171, #EF4444)",
            avgResponseTime: "linear-gradient(135deg, #A78BFA, #7C3AED)",
            lastCheck: "linear-gradient(135deg, #C084FC, #9333EA)",
            successRate: "linear-gradient(135deg, #4ADE80, #22C55E)",
          };

          const color =
            gradients[key] ?? "linear-gradient(135deg, #94A3B8, #64748B)";

          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          return (
            <StatCard
              key={key}
              label={label}
              value={formattedValue}
              color={color}
            />
          );
        })}
      </Box>

      {/* Daily Response Time Trends Chart */}
      <Paper
        sx={{
          bgcolor: "#F9FAFF",
          border: "1px solid #D1DFFF",
          p: 3,
          mt: 4,
          borderRadius: 1,
          width: "100%",
          boxShadow: "0px 2.5px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack spacing={2}>
          {/* Header with Dropdown Filter */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #5B7FFF, #7B9FFF)",
                }}
              />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#0F172A", letterSpacing: "0.3px" }}
              >
                Daily Response Time Trends
              </Typography>
            </Box>

            {/* URL Dropdown Filter */}
            <FormControl sx={{ minWidth: 220 }}>
              <Select
                value={selectedUrlForChart}
                onChange={(e) => setSelectedUrlForChart(e.target.value)}
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1px solid #D1DFFF",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D1DFFF",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#5B7FFF",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#5B7FFF",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#0F172A",
                  },
                }}
              >
                <MenuItem value="Jenkins API" sx={{ fontSize: "0.9rem" }}>
                  Jenkins API
                </MenuItem>
                <MenuItem value="Backend Service" sx={{ fontSize: "0.9rem" }}>
                  Backend Service
                </MenuItem>
                <MenuItem value="Frontend Server" sx={{ fontSize: "0.9rem" }}>
                  Frontend Server
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Chart Container with Animation */}
          <Box
            key={selectedUrlForChart}
            sx={{
              width: "100%",
              height: 380,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#FFFFFF",
              borderRadius: "10px",
              border: "1.5px solid #E0E7FF",
              p: 3,
              // animation:
              //   "chartFadeInSlide 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 1.5, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B7FFF" stopOpacity={0.9} />
                    <stop offset="50%" stopColor="#7B9FFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#A5C4FF" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#E8EFFF"
                  vertical={false}
                  strokeOpacity={0.6}
                />
                <XAxis
                  dataKey="time"
                  stroke="#94A3B8"
                  style={{ fontSize: "0.85rem", fontWeight: 500 }}
                  tick={{ fill: "#64748B" }}
                />
                <YAxis
                  stroke="#94A3B8"
                  style={{ fontSize: "0.85rem", fontWeight: 500 }}
                  tick={{ fill: "#64748B" }}
                  label={{
                    value: "Response Time (ms)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: "#64748B" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "2px solid #5B7FFF",
                    borderRadius: "10px",
                    boxShadow: "0px 8px 24px rgba(91, 127, 255, 0.25)",
                    padding: "12px 16px",
                  }}
                  labelStyle={{ color: "#0F172A", fontWeight: 600 }}
                  cursor={{
                    stroke: "#5B7FFF",
                    strokeWidth: 2.5,
                    opacity: 0.8,
                  }}
                  formatter={(value: number) => [`${value}ms`, "Response Time"]}
                  wrapperStyle={{
                    outline: "none",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedUrlForChart}
                  stroke="#5B7FFF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTrend)"
                  dot={{
                    fill: "#5B7FFF",
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#FFFFFF",
                  }}
                  activeDot={{
                    fill: "#5B7FFF",
                    r: 8,
                    strokeWidth: 3,
                    stroke: "#FFFFFF",
                  }}
                  animationDuration={600}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </Paper>

      {/* URL Monitoring Status Section */}
      <Paper
        sx={{
          border: "1px solid #D1DFFF",
          p: 3,
          mt: 4,
          borderRadius: 1,
          bgcolor: "#F9FAFF",
          boxShadow: "0px 2.5px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack spacing={2}>
          {/* Main Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
              borderBottom: "1px solid #D1DFFF",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              URL Monitoring Status
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {monitoringStatusData.length} URLs Monitored
            </Typography>
          </Box>

          {/* Single URL Card with everything inside */}
          {monitoringStatusData.map((item) => {
            const getStatusColor = (status: string) => {
              switch (status) {
                case "HEALTHY":
                  return "#0CB65A";
                case "DEGRADED":
                  return "#FFA500";
                case "FAILING":
                  return "#d32f2f";
                default:
                  return "#64748B";
              }
            };

            return (
              <Box key={item.id}>
                {/* URL Header Row with Title and Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#FFFFFF",
                    borderRadius: 1,
                    border: "1px solid #D1DFFF",
                    borderBottom: "none",
                  }}
                >
                  <Box
                    display="flex"
                    gap={1.5}
                    alignItems="flex-start"
                    flex={1}
                  >
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        bgcolor: getStatusColor(item.status),
                        borderRadius: "50%",
                        mt: 0.25,
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "500px",
                        }}
                      >
                        {item.url}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Edit and Delete Buttons */}
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        background:
                          "linear-gradient(90deg, #5B7FFF 0%, #7B9FFF 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #4B6FEF 0%, #6B8FEF 100%)",
                        },
                        px: 2,
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        background: "#d32f2f",
                        "&:hover": {
                          background: "#b71c1c",
                        },
                        px: 2,
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>

                {/* Stats Grid - 5 columns in one row */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 1,
                    p: 2,
                    bgcolor: "#FFFFFF",
                    border: "1px solid #D1DFFF",
                    borderTop: "none",
                    borderBottom: "none",
                  }}
                >
                  {/* AVG RESPONSE */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#F5F7FB",
                      borderRadius: 0.75,
                      border: "1px solid #E0E7FF",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.75, fontSize: "0.7rem" }}
                    >
                      AVG RESPONSE
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.avgResponseTime}ms
                    </Typography>
                  </Box>

                  {/* SUCCESS RATE */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#F5F7FB",
                      borderRadius: 0.75,
                      border: "1px solid #E0E7FF",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.75, fontSize: "0.7rem" }}
                    >
                      SUCCESS RATE
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: "#0CB65A" }}
                    >
                      {item.successRate}%
                    </Typography>
                  </Box>

                  {/* TOTAL CHECKS */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#F5F7FB",
                      borderRadius: 0.75,
                      border: "1px solid #E0E7FF",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.75, fontSize: "0.7rem" }}
                    >
                      TOTAL CHECKS
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.totalChecks}
                    </Typography>
                  </Box>

                  {/* STATUS */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#F5F7FB",
                      borderRadius: 0.75,
                      border: "1px solid #E0E7FF",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.75, fontSize: "0.7rem" }}
                    >
                      STATUS
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: getStatusColor(item.status) }}
                    >
                      {item.status}
                    </Typography>
                  </Box>

                  {/* LAST CODE */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#F5F7FB",
                      borderRadius: 0.75,
                      border: "1px solid #E0E7FF",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.75, fontSize: "0.7rem" }}
                    >
                      LAST CODE
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        color:
                          item.lastCode >= 200 && item.lastCode < 300
                            ? "#0CB65A"
                            : item.lastCode >= 400 && item.lastCode < 500
                            ? "#FFA500"
                            : "#d32f2f",
                      }}
                    >
                      {item.lastCode}
                    </Typography>
                  </Box>
                </Box>

                {/* Recent Checks Section - Inside same card */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#FFFFFF",
                    borderRadius: "0 0 8px 8px",
                    border: "1px solid #D1DFFF",
                    borderTop: "none",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1.5 }}
                  >
                    Recent Checks
                  </Typography>
                  <Stack spacing={1}>
                    {mockApiResponse.map((check) => (
                      <Box
                        key={check.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          bgcolor: "#F5F7FB",
                          borderRadius: 0.5,
                        }}
                      >
                        <Box
                          display="flex"
                          gap={1}
                          alignItems="center"
                          flex={1}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              bgcolor:
                                Number(check.statusCode) >= 200 &&
                                Number(check.statusCode) < 300
                                  ? "#0CB65A"
                                  : Number(check.statusCode) >= 400 &&
                                    Number(check.statusCode) < 500
                                  ? "#FFA500"
                                  : "#d32f2f",
                              borderRadius: "50%",
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant="caption" fontWeight="500">
                            {check.statusCode} {check.url}
                            {check.responseTime}ms
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 2, whiteSpace: "nowrap" }}
                        >
                          {formatEpoch(check.date)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete URL</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this URL configuration?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UrlMonitor;
