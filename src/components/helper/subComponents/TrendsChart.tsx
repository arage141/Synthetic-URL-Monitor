import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { ChartDataPoint } from "..";

interface TrendsChartProps {
  selectedUrlForChart: string;
  setSelectedUrlForChart: (url: string) => void;
  chartData: ChartDataPoint[];
}
const TrendsChart = ({
  selectedUrlForChart,
  setSelectedUrlForChart,
  chartData,
}: TrendsChartProps) => {
  return (
    <Stack spacing={2}>
      {/* Header with Dropdown Filter */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
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
        <FormControl
          sx={{ minWidth: { xs: 140, sm: 220 }, width: { xs: "auto" } }}
        >
          <Select
            fullWidth
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
              width: "100%",
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
          height: { xs: 260, sm: 320, md: 380 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#FFFFFF",
          borderRadius: { xs: "8px", md: "10px" },
          border: "1.5px solid #E0E7FF",
          p: { xs: 2, md: 3 },
          // animation: {
          //   xs: "none",
          //   md: "chartFadeInSlide 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          // },
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
  );
};

export default TrendsChart;
