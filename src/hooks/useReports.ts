import { useState, useEffect } from "react";
import { Report } from "../types";
import { reportService } from "../services/reportService";
import toast from "react-hot-toast";

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };

  const createReport = async (data: {
    title: string;
    type: "pdf" | "text";
    content?: string;
  }) => {
    setIsCreating(true);
    try {
      const newReport = await reportService.createReport(data);
      setReports((prev) => [newReport, ...prev]);
      toast.success("Report uploaded successfully!");
      return newReport;
    } catch (error) {
      toast.error("Failed to upload report");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await reportService.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success("Report deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    isLoading,
    isCreating,
    createReport,
    deleteReport,
    refetch: fetchReports,
  };
};
