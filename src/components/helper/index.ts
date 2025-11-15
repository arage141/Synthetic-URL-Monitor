import z from "zod";

// Add global styles for animations
export const animationStyles = `
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

export const formSchema = z.object({
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

export type FormType = z.infer<typeof formSchema>;

export interface URLObject {
  id: string;
  name: string;
  url: string;
  interval: number;
  timeout: number;
  expectedCodes: number[];
  enabled?: boolean | undefined;
}

export interface ApiResponseUrl {
  id: string;
  name: string;
  url: string;
  date: string;
  statusCode: string;
  responseTime: string;
}

export interface UrlStats {
  totalUrls: number;
  healthy: number;
  failing: number;
  lastCheck: string; // epoch string
  totalChecks: number;
  successRate: number;
  avgResponseTime: number;
}

export interface MonitoringStatus {
  id: string;
  name: string;
  url: string;
  avgResponseTime: number;
  successRate: number;
  totalChecks: number;
  status: "HEALTHY" | "FAILING" | "DEGRADED";
  lastCode: number;
}

export const urlStatsData: UrlStats = {
  totalUrls: 1,
  healthy: 1,
  failing: 0,
  lastCheck: "1762519842000",
  totalChecks: 520,
  successRate: 75.77,
  avgResponseTime: 597.97,
};

export const monitoringStatusData: MonitoringStatus[] = [
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
export interface ChartDataPoint {
  time: string;
  "Jenkins API": number;
  "Backend Service": number;
  "Frontend Server": number;
}

export const chartData: ChartDataPoint[] = [
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

export const mockApiResponse: ApiResponseUrl[] = [
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

export const formatEpoch = (epochString: string) => {
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

export interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}
