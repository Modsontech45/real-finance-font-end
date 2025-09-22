import { apiClient } from "./api";
import { Report } from "../types";

export interface ReportResponse {
  success: boolean;
  data: {
    reports?: Report[];
    report?: Report;
    total?: number;
  };
  message: string;
}

class ReportService {
  async getReports(params?: {
    page?: number;
    limit?: number;
    type?: "pdf" | "text";
    search?: string;
  }): Promise<Report[]> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.search) queryParams.append("search", params.search);

    const response = await apiClient.get<Report[]>(`/reports?${queryParams}`);
    return Array.isArray(response) ? response : [];
  }

  async createReport(data: {
    title: string;
    type: "pdf" | "text";
    content?: string;
    file?: File;
  }): Promise<Report> {
    if (data.file) {
      // Handle file upload
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("type", data.type);
      formData.append("file", data.file);

      const response = await apiClient.uploadFile<Report>("/reports", formData);
      return response;
    } else {
      // Handle text report
      const response = await apiClient.post<Report>("/reports", {
        title: data.title,
        type: data.type,
        content: data.content,
      });
      return response;
    }
  }

  async deleteReport(id: string): Promise<void> {
    await apiClient.delete(`/reports/${id}`);
  }

  async downloadReport(id: string): Promise<Blob> {
    const response = await fetch(
      `${apiClient["baseURL"]}/reports/${id}/download`,
      {
        headers: {
          Authorization: `Bearer ${apiClient["_token"]}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to download report");
    }

    return response.blob();
  }
}

export const reportService = new ReportService();
