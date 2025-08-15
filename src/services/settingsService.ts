import { apiClient } from './api';

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  compact_view: boolean;
  animation_effects: boolean;
  currency: string;
  timezone: string;
  date_format: string;
  language: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  transaction_alerts: boolean;
  weekly_reports: boolean;
  security_alerts: boolean;
  marketing_emails: boolean;
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
    // const response = await apiClient.get<SettingsResponse>('/settings');
    // return response.data.settings || {
    //   theme: 'dark',
    //   compact_view: false,
    //   animation_effects: true,
    //   currency: 'USD',
    //   timezone: 'UTC',
    //   date_format: 'MM/DD/YYYY',
    //   language: 'en'
    // };

    // Mocked response
    return {
      theme: 'dark',
      compact_view: false,
      animation_effects: true,
      currency: 'USD',
      timezone: 'UTC',
      date_format: 'MM/DD/YYYY',
      language: 'en'
    };
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    // const response = await apiClient.put<SettingsResponse>('/settings', settings);
    // return response.data.settings!;
    return  {
      theme: 'dark',
      compact_view: false,
      animation_effects: true,
      currency: 'USD',
      timezone: 'UTC',
      date_format: 'MM/DD/YYYY',
      language: 'en'
    };
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<SettingsResponse>('/notifications');
    return response.data.preferences || {
      email_notifications: true,
      transaction_alerts: true,
      weekly_reports: false,
      security_alerts: true,
      marketing_emails: false
    };
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await apiClient.put<SettingsResponse>('/notifications', preferences);
    return response.data.preferences!;
  }
}

export const settingsService = new SettingsService();