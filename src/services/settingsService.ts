import { apiClient } from "./api";

export interface UserSettings {
  theme: "light" | "dark" | "auto";
  compactView: boolean;
  animationEffects: boolean;
  currency: string;
  timezone: string;
  dateFormat: string;
  language: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  transactionAlerts: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

export interface SettingsResponse {
  success: boolean;
  data: {
    settings?: UserSettings;
    preferences?: NotificationPreferences;
  };
  message: string;
}

class SettingsService {
  async getSettings(): Promise<UserSettings> {
    // Mocked response - in real app would call API
    return {
      theme: "dark",
      compactView: false,
      animationEffects: true,
      currency: "XOF",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      language: "en",
    };
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    // Mocked response - in real app would call API
    return {
      theme: "dark",
      compactView: false,
      animationEffects: true,
      currency: "XOF",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      language: "en",
    };
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<SettingsResponse>("/notifications");
    return (
      response.data.preferences || {
        emailNotifications: true,
        transactionAlerts: true,
        weeklyReports: false,
        securityAlerts: true,
        marketingEmails: false,
      }
    );
  }

  async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>,
  ): Promise<NotificationPreferences> {
    const response = await apiClient.put<SettingsResponse>(
      "/notifications",
      preferences,
    );
    return response.data.preferences!;
  }
}

export const settingsService = new SettingsService();
