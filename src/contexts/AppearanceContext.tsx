import React, { createContext, useContext, useState, useEffect } from "react";
import { settingsService } from "../services/settingsService";

export type Theme = "light" | "dark" | "auto";

interface AppearanceSettings {
  theme: Theme;
  compactView: boolean;
  animationEffects: boolean;
  currency: string;
}

interface AppearanceContextType {
  settings: AppearanceSettings;
  updateTheme: (theme: Theme) => void;
  updateCompactView: (compact: boolean) => void;
  updateAnimationEffects: (enabled: boolean) => void;
  updateCurrency: (currency: string) => void;
  isDarkMode: boolean;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(
  undefined
);

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
};

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    const stored = localStorage.getItem("appearanceSettings");
    return stored
      ? JSON.parse(stored)
      : {
          theme: "dark",
          compactView: false,
          animationEffects: true,
          currency: "XOF",
        };
  });

  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const backendSettings = await settingsService.getSettings();
        setSettings((prev) => ({
          ...prev,
          theme: backendSettings.theme,
          compactView: backendSettings.compact_view,
          animationEffects: backendSettings.animation_effects,
          currency: backendSettings.currency,
        }));
      } catch (error) {
        console.error("Failed to load settings from backend:", error);
      }
    };

    loadSettings();
  }, []);

  // Determine if dark mode should be active
  useEffect(() => {
    const updateDarkMode = () => {
      if (settings.theme === "auto") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDarkMode(prefersDark);
      } else {
        setIsDarkMode(settings.theme === "dark");
      }
    };

    updateDarkMode();

    if (settings.theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateDarkMode);
      return () => mediaQuery.removeEventListener("change", updateDarkMode);
    }
  }, [settings.theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    // Apply compact view
    if (settings.compactView) {
      root.classList.add("compact");
    } else {
      root.classList.remove("compact");
    }

    // Apply animation effects
    if (settings.animationEffects) {
      root.classList.add("animations-enabled");
    } else {
      root.classList.remove("animations-enabled");
    }
  }, [isDarkMode, settings.compactView, settings.animationEffects]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("appearanceSettings", JSON.stringify(settings));

    // Also save to backend
    const saveToBackend = async () => {
      try {
        await settingsService.updateSettings({
          theme: settings.theme,
          compact_view: settings.compactView,
          animation_effects: settings.animationEffects,
          currency: settings.currency,
        });
      } catch (error) {
        console.error("Failed to save settings to backend:", error);
      }
    };

    saveToBackend();
  }, [settings]);

  const updateTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const updateCompactView = (compactView: boolean) => {
    setSettings((prev) => ({ ...prev, compactView }));
  };

  const updateAnimationEffects = (animationEffects: boolean) => {
    setSettings((prev) => ({ ...prev, animationEffects }));
  };

  const updateCurrency = (currency: string) => {
    setSettings((prev) => ({ ...prev, currency }));
  };
  const value = {
    settings,
    updateTheme,
    updateCompactView,
    updateAnimationEffects,
    updateCurrency,
    isDarkMode,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
};
