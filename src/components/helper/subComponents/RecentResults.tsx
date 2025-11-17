import { Box, Button, Stack, Typography } from "@mui/material";
import { formatEpoch } from "..";
import type { URLObject } from "..";

interface RecentResultsProps {
  urlArray: URLObject[];
  handleCheckAll: () => void;
  checkingUrls: Set<string>;
}
const RecentResults = ({
  urlArray,
  handleCheckAll,
  checkingUrls,
}: RecentResultsProps) => {
  return (
    <Stack spacing={4} px={1} pb={2}>
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
            background: "linear-gradient(90deg, #0CB65A 0%, #4ADE80 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #0AA84F 0%, #3FD370 100%)",
            },
          }}
          onClick={handleCheckAll}
          disabled={urlArray.length === 0 || checkingUrls.size > 0}
        >
          {checkingUrls.size > 0 ? "Checking..." : "Check Now"}
        </Button>
      </Box>

      <Stack
        spacing={2}
        sx={{
          maxHeight: { xs: "60vh", md: "420px" },
          overflow: "auto",
          px: 1,
        }}
      >
        {(() => {
          // Collect all checks from all URLs, sorted by date (newest first)
          const allChecks = urlArray
            .flatMap((urlItem) =>
              (urlItem.checkHistory || []).map((check) => ({
                ...check,
                urlName: urlItem.name,
                url: urlItem.url,
              }))
            )
            .sort((a, b) => Number(b.date) - Number(a.date))
            .slice(0, 8); // Show last 8 checks

          if (allChecks.length === 0) {
            return (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No checks yet. Click "Check Now" to start monitoring.
              </Typography>
            );
          }

          return allChecks.map((check) => {
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
                  alignItems: { xs: "flex-start", sm: "end" },
                  flexDirection: { xs: "column", sm: "row" },
                  py: 1,
                  px: 2,
                  bgcolor: "#FFFFFF",
                  borderRadius: 1,
                  border: "1px solid #D1DFFF",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <Box display="flex" gap={1} alignItems="center">
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: statusColor,
                        borderRadius: "50%",
                        mt: 0.5,
                      }}
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {check.urlName}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1">{check.url}</Typography>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Typography variant="subtitle1">
                      {check.statusCode}
                    </Typography>
                    <Typography variant="subtitle1">
                      {check.responseTime}ms
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {formatEpoch(check.date)}
                </Typography>
              </Box>
            );
          });
        })()}
      </Stack>
    </Stack>
  );
};

export default RecentResults;
