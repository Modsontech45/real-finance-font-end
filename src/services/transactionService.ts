import { apiClient } from "./api";
import { Transaction, TransactionFormData } from "../types";
import { getAdminData } from "../utils/sessionUtils";

export interface TransactionResponse {
  success: boolean;
  data: {
    transactions?: Transaction[];
    transaction?: Transaction;
    total?: number;
    page?: number;
    limit?: number;
  };
  message: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
}

class TransactionService {
 async getTransactions(params?: {
  page?: number;
  limit?: number;
  type?: "income" | "expense";
  startDate?: string;
  endDate?: string;
}): Promise<Transaction[]> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.type) queryParams.append("type", params.type);
  if (params?.startDate) queryParams.append("start_date", params.startDate);
  if (params?.endDate) queryParams.append("end_date", params.endDate);

  const response = await apiClient.get<{
    success: boolean;
    data: Transaction[];
    pagination: any;
  }>(`/transactions?${queryParams.toString()}`);

  console.log("[GET] /transactions response:", response);

  // ✅ unwrap response.data
  return response.data || [];
}


  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    const admin = getAdminData();

    if (!admin?.id) {
      throw new Error("Cannot create transaction: Admin user ID not found.");
    }

    const payload = {
      name: data.name,
      amount: data.amount,
      type: data.type.trim().toLowerCase(), // "income" or "expense"
      comment: data.comment,
      department: data.department,
      transactionDate: new Date(data.date).toISOString(), // ISO string
    };

    const response = await apiClient.post<Transaction>(
      "/transactions",
      payload,
    );
    console.log("[POST] /transactions payload:", payload);

    return response;
  }

  async updateTransaction(
    id: string,
    data: Partial<TransactionFormData>,
  ): Promise<Transaction> {
    const updateData: Partial<Record<string, any>> = {};

    if (data.name) updateData.name = data.name;
    if (data.amount) updateData.amount = data.amount;
    if (data.type) updateData.type = data.type;
    if (data.date) updateData.transaction_date = data.date;
    if (data.comment) updateData.comment = data.comment;

    const response = await apiClient.put<Transaction>(
      `/transactions/${id}`,
      updateData,
    );
    console.log(`[PUT] /transactions/${id} payload:`, updateData);

    return response;
  }

  async deleteTransaction(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
    console.log(`[DELETE] /transactions/${id}`);
  }

  async getSummary(): Promise<TransactionSummary> {
    const transactions = await this.getTransactions();

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    };
  }
}

export const transactionService = new TransactionService();
