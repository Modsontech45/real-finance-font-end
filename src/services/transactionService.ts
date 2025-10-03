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
  /**
   * Fetch a single page of transactions
   */
  private async getTransactions(params?: {
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
      pagination?: { page: number; limit: number; total: number };
    }>(`/transactions?${queryParams.toString()}`);

    return response.data || [];
  }

  /**
   * Fetch all transactions across all pages
   */
  async getAllTransactions(limit = 200): Promise<Transaction[]> {
    let all: Transaction[] = [];
    let page = 1;

    while (true) {
      const transactions = await this.getTransactions({ page, limit });
      if (!transactions.length) break;

      all = all.concat(transactions);
      page++;
    }

    console.log(`[FETCHED ALL] Total transactions: ${all.length}`);
    return all;
  }

  /**
   * Create a new transaction
   */
  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    const admin = getAdminData();
    if (!admin?.id) {
      throw new Error("Cannot create transaction: Admin user ID not found.");
    }

    const payload = {
      name: data.name,
      amount: Number(data.amount),
      type: data.type.trim().toLowerCase(),
      comment: data.comment,
      department: data.department,
      transactionDate: new Date(data.date).toISOString(),
    };

    const response = await apiClient.post<Transaction>("/transactions", payload);
    console.log("[POST] /transactions payload:", payload);

    return response;
  }

  /**
   * Update a transaction by ID
   */
  async updateTransaction(
    id: string,
    data: Partial<TransactionFormData>,
  ): Promise<Transaction> {
    const updateData: Partial<Record<string, any>> = {};

    if (data.name) updateData.name = data.name;
    if (data.amount) updateData.amount = Number(data.amount);
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

  /**
   * Delete a transaction by ID
   */
  async deleteTransaction(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
    console.log(`[DELETE] /transactions/${id}`);
  }

  /**
   * Get income/expense summary from ALL transactions
   */
  async getSummary(): Promise<TransactionSummary> {
    const transactions = await this.getAllTransactions(200);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    };
  }
}

export const transactionService = new TransactionService();
