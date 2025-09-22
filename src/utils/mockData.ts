import { Transaction, Report, User, UserRole } from "../types";

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    name: "Product Sales",
    amount: 5000,
    type: "income",
    comment: "Q1 product sales revenue",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    date: "2024-01-20",
    name: "Office Rent",
    amount: 2000,
    type: "expense",
    comment: "Monthly office rent payment",
    created_at: "2024-01-20T14:00:00Z",
  },
  {
    id: "3",
    date: "2024-01-25",
    name: "Service Revenue",
    amount: 3500,
    type: "income",
    comment: "Consulting services",
    created_at: "2024-01-25T09:15:00Z",
  },
  {
    id: "4",
    date: "2024-02-01",
    name: "Equipment Purchase",
    amount: 1200,
    type: "expense",
    comment: "New computers and hardware",
    created_at: "2024-02-01T11:45:00Z",
  },
  {
    id: "5",
    date: "2024-02-10",
    name: "License Sales",
    amount: 8000,
    type: "income",
    comment: "Software license revenue",
    created_at: "2024-02-10T16:20:00Z",
  },
];

export const mockReports: Report[] = [
  {
    id: "1",
    title: "Q1 Financial Summary",
    type: "pdf",
    file_url: "#",
    upload_date: "2024-01-31",
    keywords: ["Q1", "financial", "summary"],
  },
  {
    id: "2",
    title: "Monthly Expense Report",
    type: "text",
    content:
      "Detailed breakdown of monthly expenses including office rent, utilities, and operational costs.",
    upload_date: "2024-02-15",
    keywords: ["monthly", "expenses", "operational"],
  },
  {
    id: "3",
    title: "Revenue Analysis",
    type: "pdf",
    file_url: "#",
    upload_date: "2024-02-28",
    keywords: ["revenue", "analysis", "growth"],
  },
];

export const mockMembers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Admin",
    fullName: "John Admin",
    email: "admin@company.com",
    company: {
      id: "1",
      name: "Tech Corp",
    },
    country: "US",
    phoneNumber: "+1234567890",
    roles: [UserRole.SUPER_ADMIN],
    isEmailVerified: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john@company.com",
    company: {
      id: "1",
      name: "Tech Corp",
    },
    country: "US",
    phoneNumber: "+1234567891",
    roles: [UserRole.MEMBER],
    isEmailVerified: true,
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    email: "jane@company.com",
    company: {
      id: "1",
      name: "Tech Corp",
    },
    country: "CA",
    phoneNumber: "+1234567892",
    roles: [UserRole.MEMBER],
    isEmailVerified: true,
    created_at: "2024-02-01T00:00:00Z",
  },
];
