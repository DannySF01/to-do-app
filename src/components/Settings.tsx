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
import { useTheme } from "../hooks/useTheme";
import Toggle from "./Toggle";
import { usePWA } from "../hooks/usePWA";
import Select from "./Select";
import { useNotifications } from "../hooks/useNotifications";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  const { theme, setTheme } = useTheme();

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.split("-")[0];

  const { isInstallable, install } = usePWA();

  const { supported, subscribed, enableNotifications, disableNotifications } =
    useNotifications();

  const handleChange = async () => {
    if (subscribed) {
      await disableNotifications();
    } else {
      await enableNotifications();
    }
  };

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
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("settings.title")}
        </h1>

        <p className="mt-1 text-sm text-muted">{t("settings.subtitle")}</p>
      </div>

      <div className="space-y-8">
        {/* Appearance */}
        <SettingsSection title={t("settings.appearance.section")}>
          <SettingsRow
            icon={<Palette size={17} />}
            title={t("settings.appearance.theme")}
            description={t("settings.appearance.themeDescription")}
          >
            <ThemeSelector value={theme} onChange={setTheme} />
          </SettingsRow>
        </SettingsSection>

        {/* Language */}
        <SettingsSection title={t("settings.language.section")}>
          <SettingsRow
            icon={<Monitor size={17} />}
            title={t("settings.language.label")}
            description={t("settings.language.description")}
          >
            <Select
              value={currentLanguage}
              options={[
                { value: "en", label: t("settings.language.options.en") },
                { value: "pt", label: t("settings.language.options.pt") },
              ]}
              onSelect={(lang) => i18n.changeLanguage(lang)}
            />
          </SettingsRow>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title={t("settings.notifications.section")}>
          <SettingsRow
            icon={<Bell size={17} />}
            title={t("settings.notifications.enable")}
            description={t("settings.notifications.description")}
          >
            {supported ? (
              <Toggle checked={subscribed} onChange={handleChange} />
            ) : (
              <span className="text-sm font-medium text-muted">
                {t("common.notSupported")}
              </span>
            )}
          </SettingsRow>
        </SettingsSection>

        {/* App */}
        <SettingsSection title={t("settings.app.section")}>
          <SettingsRow
            icon={<Download size={17} />}
            title={t("settings.app.install")}
            description={t("settings.app.installDescription")}
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
                <span className="text-sm font-medium text-muted">
                  {t("common.notSupported")}
                </span>
              )}
            </span>
          </SettingsRow>

          <SettingsRow
            icon={<Info size={17} />}
            title={t("settings.app.about")}
            description={t("settings.app.aboutDescription")}
          >
            <span className="text-sm font-medium text-muted">v0.0.1</span>
          </SettingsRow>
        </SettingsSection>

        {/* Data & Storage */}
        <SettingsSection title={t("settings.dataStorage.section")}>
          <SettingsRow
            icon={<Info size={17} />}
            title={t("settings.dataStorage.eraseData")}
            description={t("settings.dataStorage.eraseDataDescription")}
          >
            <button
              onClick={() => {}}
              className="text-sm rounded-lg border text-white border-border bg-red-500 px-4 py-2 font-medium"
            >
              {t("settings.dataStorage.eraseData")}
            </button>
          </SettingsRow>
          <SettingsRow
            icon={<Info size={17} />}
            title={t("settings.dataStorage.storageUsage")}
            description={t("settings.dataStorage.storageUsageDescription")}
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
          {t("settings.resetSettings")}
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

      <div className="rounded-2xl border border-border bg-surface">
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
      label: t("settings.appearance.system"),
      icon: Monitor,
    },
    {
      value: "light" as const,
      label: t("settings.appearance.light"),
      icon: Sun,
    },
    {
      value: "dark" as const,
      label: t("settings.appearance.dark"),
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
