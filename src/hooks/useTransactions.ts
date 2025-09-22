import { useState, useEffect } from "react";
import { Transaction, TransactionFormData } from "../types";
import { transactionService } from "../services/transactionService";
import toast from "react-hot-toast";
import { getAdminData, setAdminData } from "../utils/sessionUtils";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };
  const cachedUser = getAdminData();
  ////////////////////////////////////////////////////////////
  const createTransaction = async (data: TransactionFormData) => {
    setIsCreating(true);
    try {
      //console.log(cachedUser )
      const newTransaction = await transactionService.createTransaction(data);
      setTransactions((prev) => [newTransaction, ...prev]);

      const label = data.type === "income" ? "Income" : "Expense";
      toast.success(`${label} added successfully!`);

      return newTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    isLoading,
    isCreating,
    createTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
};
