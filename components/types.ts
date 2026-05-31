export interface ActiveCart {
  planName: string;
  price: number;
}

export interface Subscriber {
  id: string;
  email: string;
  city: string;
  country: string;
  device: string;
  browser: string;
  os: string;
  status: "Subscribed" | "Unsubscribed";
  tags: string[];
  date: string;
}

export interface Campaign {
  id: string;
  title: string;
  message: string;
  ctaText: string;
  url: string;
  segment: string;
  sentCount: number;
  clicks: number;
  ctr: number;
  status: "Sent" | "Draft" | "Queued";
  date: string;
}

export interface SupportTicket {
  id: string;
  user: string;
  subject: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "Resolved";
  date: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  amount: number;
}

export interface SystemLog {
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  module: string;
}
