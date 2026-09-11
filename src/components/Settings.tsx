import {
  Bell,
  Download,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  Monitor,
  Info,
  MonitorDown,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import Toggle from "./Toggle";
import { usePWA } from "../hooks/usePWA";
import Select from "./Select";

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);

  const { isInstallable, install } = usePWA();

  return (
    <div className=" w-full max-w-3xl px-6 pb-26 pt-18 md:px-10 md:py-6">
      <button
        type="button"
        onClick={onBack}
        className="h-9 w-9 mb-3 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground hidden md:flex"
        aria-label="Back"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

        <p className="mt-1 text-sm text-muted">Manage your preferences</p>
      </div>

      <div className="space-y-8">
        {/* Appearance */}
        <SettingsSection title="Appearance">
          <SettingsRow
            icon={<Palette size={17} />}
            title="Theme"
            description="Choose how the app looks"
          >
            <ThemeSelector value={theme} onChange={setTheme} />
          </SettingsRow>
        </SettingsSection>

        {/* Language */}
        <SettingsSection title="Language">
          <SettingsRow
            icon={<Monitor size={17} />}
            title="Language"
            description="Choose your preferred language"
          >
            <Select
              value={language}
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
              ]}
              onSelect={(lang) => setLanguage(lang)}
            />
          </SettingsRow>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsRow
            icon={<Bell size={17} />}
            title="Enable Notifications"
            description="Receive notifications for upcoming tasks"
          >
            <Toggle checked={notifications} onChange={setNotifications} />
          </SettingsRow>
        </SettingsSection>

        {/* App */}
        <SettingsSection title="App">
          <SettingsRow
            icon={<Download size={17} />}
            title="Install App"
            description="Install To-Do-App on your device"
          >
            <span className="text-sm font-medium text-muted">
              {isInstallable ? (
                <button
                  onClick={install}
                  className="btn text-muted hover:text-foreground"
                >
                  <MonitorDown size={18} />
                </button>
              ) : (
                <span>Not available</span>
              )}
            </span>
          </SettingsRow>

          <SettingsRow
            icon={<Info size={17} />}
            title="About"
            description="Information about this app"
          >
            <span className="text-sm font-medium text-muted">v0.0.1</span>
          </SettingsRow>
        </SettingsSection>

        {/* Data & Storage */}
        <SettingsSection title="Data & Storage">
          <SettingsRow
            icon={<Info size={17} />}
            title="Erase Data"
            description="Permanently erase all data"
          >
            <button
              onClick={() => {}}
              className="text-sm rounded-lg border text-white border-border bg-red-500 px-4 py-2 font-medium"
            >
              Erase
            </button>
          </SettingsRow>
          <SettingsRow
            icon={<Info size={17} />}
            title="Storage Usage"
            description="Total storage used by this app"
          >
            <span className="flex items-center gap-2 text-muted">
              <span className="text-sm font-medium">0 B</span>
            </span>
          </SettingsRow>
        </SettingsSection>

        {/* Reset */}
        <button
          type="button"
          className="
            flex w-full items-center justify-center gap-2
            rounded-xl border border-border
            px-4 py-3
            text-sm font-medium text-muted
            transition
            hover:bg-foreground/5
            hover:text-foreground
          "
        >
          <RotateCcw size={15} />
          Reset settings
        </button>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted">
        {title}
      </h2>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {children}
      </div>
    </section>
  );
}

function SettingsRow({
  icon,
  title,
  description,
  children,
  onClick,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      {icon && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-muted">
          {icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>

      {children}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          flex w-full items-center gap-3
          border-b border-border
          px-4 py-3.5
          text-left
          transition
          last:border-b-0
          hover:bg-foreground/3
        "
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className="
        flex items-center gap-3
        border-b border-border
        px-4 py-3.5
        last:border-b-0
      "
    >
      {content}
    </div>
  );
}

function ThemeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: "system" | "light" | "dark") => void;
}) {
  const options = [
    {
      value: "system" as const,
      label: "System",
      icon: Monitor,
    },
    {
      value: "light" as const,
      label: "Light",
      icon: Sun,
    },
    {
      value: "dark" as const,
      label: "Dark",
      icon: Moon,
    },
  ];

  return (
    <div className="flex rounded-lg bg-background p-0.5">
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex items-center gap-1.5
              rounded-md px-2.5 py-1.5
              text-xs font-medium
              transition
              ${
                active
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }
            `}
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
