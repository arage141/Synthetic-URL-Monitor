import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardContent,
  Card,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useMemo } from "react";
import {
  animationStyles,
  chartData,
  formatEpoch,
  formSchema,
  type FormType,
  type StatCardProps,
  type URLObject,
  type CheckResult,
  generateMockData,
} from "../helper";
import AddUrlForm from "../helper/subComponents/AddUrlForm";
import MonitoringStatus from "../helper/subComponents/MonitoringStatus";
import TrendsChart from "../helper/subComponents/TrendsChart";
import RecentResults from "../helper/subComponents/RecentResults";

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  return (
    <Card
      sx={{
        background: color ?? "linear-gradient(135deg, #94A3B8, #64748B)",
        color: "white",
        minWidth: { xs: "100%", sm: 200, md: 250, xl: 280 },
        width: { xs: "100%", sm: "auto" },
        borderRadius: 1,
        padding: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "0.25s ease",
        "&:hover": {
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
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

const computeUrlStats = (urls: URLObject[]) => {
  const stats = {
    totalUrls: urls.length,
    healthy: 0,
    failing: 0,
    totalChecks: 0,
    avgResponseTime: 0,
    successRate: 0,
    lastCheck: 0,
  };

  let responseSum = 0;
  let responseCount = 0;
  let successCount = 0;
  let totalEvents = 0;
  let latestCheck = 0;

  urls.forEach((url) => {
    if (url.status === "HEALTHY") {
      stats.healthy += 1;
    } else if (url.status === "FAILING") {
      stats.failing += 1;
    }

    const history = url.checkHistory || [];
    const historyCount = history.length;
    stats.totalChecks += url.totalChecks ?? historyCount;

    if (typeof url.avgResponseTime === "number") {
      responseSum += url.avgResponseTime;
      responseCount += 1;
    }

    history.forEach((check) => {
      totalEvents += 1;
      const isSuccess =
        url.expectedCodes && url.expectedCodes.length > 0
          ? url.expectedCodes.includes(check.statusCode)
          : check.statusCode >= 200 && check.statusCode < 300;

      if (isSuccess) {
        successCount += 1;
      }

      const checkDate = Number(check.date);
      if (!Number.isNaN(checkDate)) {
        latestCheck = Math.max(latestCheck, checkDate);
      }
    });
  });

  stats.avgResponseTime = responseCount
    ? Math.round(responseSum / responseCount)
    : 0;

  stats.successRate = totalEvents
    ? Number(((successCount / totalEvents) * 100).toFixed(2))
    : 0;

  stats.lastCheck = latestCheck;

  return stats;
};

const UrlMonitor = () => {
  const [urlArray, setUrlArray] = useState<URLObject[]>(generateMockData());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedUrlForChart, setSelectedUrlForChart] =
    useState<string>("Jenkins API");
  const [checkingUrls, setCheckingUrls] = useState<Set<string>>(new Set());
  const formRef = useRef<HTMLDivElement>(null);
  const urlStats = useMemo(() => computeUrlStats(urlArray), [urlArray]);

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
      const payload: URLObject = {
        ...data,
        id: crypto.randomUUID(),
        interval: Number(data.interval),
        timeout: Number(data.timeout),
        expectedCodes:
          data.expectedCodes
            ?.split(",")
            .map((v) => Number(v.trim()))
            .filter((n) => !isNaN(n)) || [],
        checkHistory: [],
        totalChecks: 0,
        avgResponseTime: 0,
        successRate: 0,
        status: "FAILING",
        lastCode: 0,
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

  // Simulate URL check (in real app, this would be an API call)
  const checkUrl = async (
    url: string,
    timeout: number
  ): Promise<CheckResult> => {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout * 1000);

      await fetch(url, {
        method: "GET",
        signal: controller.signal,
        mode: "no-cors", // For CORS issues, we'll simulate
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      // Simulate response since no-cors doesn't give us status
      const statusCode =
        Math.random() > 0.1 ? 200 : Math.random() > 0.5 ? 500 : 404;

      return {
        id: crypto.randomUUID(),
        date: Date.now().toString(),
        statusCode,
        responseTime: Math.min(responseTime, timeout * 1000),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        id: crypto.randomUUID(),
        date: Date.now().toString(),
        statusCode: 0, // Network error
        responseTime: Math.min(responseTime, timeout * 1000),
      };
    }
  };

  // Calculate metrics from check history
  const calculateMetrics = (
    checkHistory: CheckResult[],
    expectedCodes: number[]
  ): {
    avgResponseTime: number;
    successRate: number;
    status: "HEALTHY" | "FAILING" | "DEGRADED";
    lastCode: number;
  } => {
    if (checkHistory.length === 0) {
      return {
        avgResponseTime: 0,
        successRate: 0,
        status: "FAILING",
        lastCode: 0,
      };
    }

    const totalChecks = checkHistory.length;
    const successfulChecks = checkHistory.filter(
      (check) =>
        expectedCodes.includes(check.statusCode) ||
        (check.statusCode >= 200 && check.statusCode < 300)
    ).length;

    const avgResponseTime = Math.round(
      checkHistory.reduce((sum, check) => sum + check.responseTime, 0) /
        totalChecks
    );

    const successRate = Math.round((successfulChecks / totalChecks) * 100);

    const lastCheck = checkHistory[checkHistory.length - 1];
    const lastCode = lastCheck.statusCode;

    let status: "HEALTHY" | "FAILING" | "DEGRADED";
    if (successRate >= 95) {
      status = "HEALTHY";
    } else if (successRate >= 70) {
      status = "DEGRADED";
    } else {
      status = "FAILING";
    }

    return {
      avgResponseTime,
      successRate,
      status,
      lastCode,
    };
  };

  // Check Now functionality
  const handleCheckNow = async (urlId: string) => {
    const urlItem = urlArray.find((item) => item.id === urlId);
    if (!urlItem) return;

    setCheckingUrls((prev) => new Set(prev).add(urlId));

    try {
      const checkResult = await checkUrl(urlItem.url, urlItem.timeout);

      setUrlArray((prev) =>
        prev.map((item) => {
          if (item.id === urlId) {
            const updatedHistory = [
              ...(item.checkHistory || []),
              checkResult,
            ].slice(-100); // Keep last 100 checks
            const metrics = calculateMetrics(
              updatedHistory,
              item.expectedCodes
            );

            return {
              ...item,
              checkHistory: updatedHistory,
              totalChecks: updatedHistory.length,
              ...metrics,
            };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Error checking URL:", error);
    } finally {
      setCheckingUrls((prev) => {
        const newSet = new Set(prev);
        newSet.delete(urlId);
        return newSet;
      });
    }
  };

  // Check all URLs
  const handleCheckAll = async () => {
    const enabledUrls = urlArray.filter((item) => item.enabled !== false);
    for (const urlItem of enabledUrls) {
      await handleCheckNow(urlItem.id);
    }
  };

  // Smooth scroll to form
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle edit from URL Monitoring Status
  const handleEditFromStatus = (item: URLObject) => {
    handleEditClick(item);
    setTimeout(() => {
      scrollToForm();
    }, 100);
  };

  return (
    <Box sx={{ py: 3, px: { xs: 2, sm: 4, md: 8, lg: 12 } }}>
      <Box>
        <Typography variant="h6">Synthetic URL Monitor</Typography>
        <Typography variant="body1">
          Monitor your URLs and get alerted when they go down or return errors
        </Typography>
      </Box>

      {/* Url configurations & Recent Results divs */}
      <Box
        ref={formRef}
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Paper
          sx={{
            border: "1px solid #D1DFFF",
            py: { xs: 1.5, lg: 2 },
            px: { xs: 0.5, lg: 1 },
            mt: 2,
            borderRadius: 1,
            bgcolor: "#F9FAFF",
            width: { xs: "100%", lg: "40%" },
            boxShadow: "0px 2.5px 5px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            // Keep overall paper height stable on larger screens so inner
            // form/list can grow/scroll without shifting the surrounding layout
            height: { xs: "auto", md: "545px" },
            overflow: "hidden",
          }}
        >
          <AddUrlForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            urlArray={urlArray}
            reset={reset}
            setEditingId={setEditingId}
            setShowForm={setShowForm}
            showForm={showForm}
            editingId={editingId}
            control={control}
            errors={errors}
            handleCancelForm={handleCancelForm}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </Paper>

        <Paper
          sx={{
            border: "1px solid #D1DFFF",
            p: { xs: 1.5, lg: 2 },
            mt: 2,
            borderRadius: 1,
            bgcolor: "#F9FAFF",
            width: { xs: "100%", lg: "60%" },
            boxShadow: "0px 2.5px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <RecentResults
            urlArray={urlArray}
            handleCheckAll={handleCheckAll}
            checkingUrls={checkingUrls}
          />
        </Paper>
      </Box>

      {/* Url Stats Cards */}
      <Box display="flex" flexWrap="wrap" gap={2} mt={4}>
        {Object.entries(urlStats).map(([key, value]) => {
          const formattedValue =
            key === "successRate"
              ? `${Number(value).toFixed(2)}%`
              : key === "avgResponseTime"
              ? `${Number(value)}ms`
              : key === "lastCheck"
              ? Number(value)
                ? formatEpoch(String(value))
                : "No checks yet"
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
        <TrendsChart
          selectedUrlForChart={selectedUrlForChart}
          setSelectedUrlForChart={setSelectedUrlForChart}
          chartData={chartData}
        />
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
        <MonitoringStatus
          urlArray={urlArray}
          handleCheckNow={handleCheckNow}
          handleEditFromStatus={handleEditFromStatus}
          handleDeleteClick={handleDeleteClick}
          checkingUrls={checkingUrls}
        />
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
