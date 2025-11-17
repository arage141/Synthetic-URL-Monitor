import { Box, Button, Stack, Typography } from "@mui/material";
import { formatEpoch } from "..";
import type { URLObject } from "..";

interface MonitoringStatusProps {
  urlArray: URLObject[];
  handleCheckNow: (id: string) => void;
  handleEditFromStatus: (item: URLObject) => void;
  handleDeleteClick: (id: string) => void;
  checkingUrls: Set<string>;
}
const MonitoringStatus = ({
  urlArray,
  handleCheckNow,
  handleEditFromStatus,
  handleDeleteClick,
  checkingUrls,
}: MonitoringStatusProps) => {
  return (
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
          {urlArray.length} URLs Monitored
        </Typography>
      </Box>

      {/* Single URL Card with everything inside */}
      {urlArray.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 4 }}
        >
          No URLs configured yet. Add a URL to start monitoring.
        </Typography>
      ) : (
        urlArray.map((item) => {
          const getStatusColor = (status?: string) => {
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

          const status = item.status || "FAILING";
          const avgResponseTime = item.avgResponseTime || 0;
          const successRate = item.successRate || 0;
          const totalChecks = item.totalChecks || 0;
          const lastCode = item.lastCode || 0;
          const checkHistory = item.checkHistory || [];

          return (
            <Box key={item.id}>
              {/* URL Header Row with Title and Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", md: "center" },
                  p: { xs: 1.25, md: 2 },
                  bgcolor: "#FFFFFF",
                  borderRadius: 1,
                  border: "1px solid #D1DFFF",
                  borderBottom: "none",
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: 1.5, md: 0 },
                }}
              >
                <Box
                  display="flex"
                  gap={1.5}
                  alignItems="flex-start"
                  flex={1}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      bgcolor: getStatusColor(status),
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

                {/* Edit, Delete, and Check Now Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: { xs: 1, md: 0 },
                    width: { xs: "100%", md: "auto" },
                    justifyContent: { xs: "flex-end", md: "flex-start" },
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.75rem",
                      background:
                        "linear-gradient(90deg, #0CB65A 0%, #4ADE80 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #0AA84F 0%, #3FD370 100%)",
                      },
                      px: 2,
                      width: { xs: "48%", sm: "auto" },
                    }}
                    onClick={() => handleCheckNow(item.id)}
                    disabled={checkingUrls.has(item.id)}
                  >
                    {checkingUrls.has(item.id) ? "Checking..." : "Check Now"}
                  </Button>
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
                      width: { xs: "48%", sm: "auto" },
                    }}
                    onClick={() => handleEditFromStatus(item)}
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
                      width: { xs: "48%", sm: "auto" },
                    }}
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>

              {/* Stats Grid - 5 columns in one row */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(5, 1fr)",
                  },
                  gap: { xs: 1, md: 1 },
                  p: { xs: 1.5, md: 2 },
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
                    {avgResponseTime}ms
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
                    {successRate}%
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
                    {totalChecks}
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
                    sx={{ color: getStatusColor(status) }}
                  >
                    {status}
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
                        lastCode >= 200 && lastCode < 300
                          ? "#0CB65A"
                          : lastCode >= 400 && lastCode < 500
                          ? "#FFA500"
                          : "#d32f2f",
                    }}
                  >
                    {lastCode || "N/A"}
                  </Typography>
                </Box>
              </Box>

              {/* Recent Checks Section - Inside same card */}
              <Box
                sx={{
                  p: { xs: 1.5, md: 2 },
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
                  {checkHistory.length === 0 ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 2 }}
                    >
                      No checks yet. Click "Check Now" to start monitoring.
                    </Typography>
                  ) : (
                    checkHistory
                      .slice()
                      .reverse()
                      .slice(0, 10)
                      .map((check) => {
                        const statusColor =
                          check.statusCode >= 200 && check.statusCode < 300
                            ? "#0CB65A"
                            : check.statusCode >= 400 && check.statusCode < 500
                            ? "#FFA500"
                            : "#d32f2f";

                        return (
                          <Box
                            key={check.id}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: {
                                xs: "flex-start",
                                sm: "center",
                              },
                              flexDirection: { xs: "column", sm: "row" },
                              p: 1,
                              bgcolor: "#F5F7FB",
                              borderRadius: 0.5,
                              gap: 1,
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
                                  bgcolor: statusColor,
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                }}
                              />
                              <Typography variant="caption" fontWeight="500">
                                {check.statusCode} {item.url}{" "}
                                {check.responseTime}ms
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                ml: { xs: 0, sm: 2 },
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatEpoch(check.date)}
                            </Typography>
                          </Box>
                        );
                      })
                  )}
                </Stack>
              </Box>
            </Box>
          );
        })
      )}
    </Stack>
  );
};

export default MonitoringStatus;
