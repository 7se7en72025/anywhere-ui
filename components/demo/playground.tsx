"use client";

import { useState } from "react";
import { AdaptiveImage } from "@/registry/anywhere/ui/adaptive-image";
import { AsyncBoundary, type AsyncStatus } from "@/registry/anywhere/ui/async-boundary";
import { ConnectionStatus } from "@/registry/anywhere/ui/connection-status";
import { Field } from "@/registry/anywhere/ui/field";
import { ResilientForm } from "@/registry/anywhere/ui/resilient-form";
import { LocaleProvider } from "@/registry/anywhere/lib/use-locale";
import { formatRelative } from "@/registry/anywhere/lib/format";
import { dateTimeFormat, numberFormat } from "@/registry/anywhere/lib/format";
import { getCalendar } from "@/registry/anywhere/lib/locale";
import { simulateNetwork, type SimulatedNetwork } from "./simulator";

const LOCALES = [
  { tag: "en-US", name: "English" },
  { tag: "ar-EG", name: "العربية" },
  { tag: "he-IL", name: "עברית" },
  { tag: "fa-IR", name: "فارسی" },
  { tag: "ur-PK", name: "اردو" },
  { tag: "hi-IN", name: "हिन्दी" },
  { tag: "bn-BD", name: "বাংলা" },
  { tag: "th-TH", name: "ไทย" },
  { tag: "zh-CN", name: "中文" },
  { tag: "ja-JP", name: "日本語" },
] as const;

const NETWORKS: Array<{ mode: SimulatedNetwork; name: string }> = [
  { mode: "fast", name: "Fast 4G" },
  { mode: "slow", name: "Slow 2G / Save-Data" },
  { mode: "offline", name: "Offline" },
];

const STRINGS: Record<
  string,
  {
    boundary: { loading: string; error: string; offline: string; empty: string; retry: string; ready: string };
    form: { email: string; note: string; submit: string; hint: string };
    result: string;
  }
> = {
  "en-US": {
    boundary: {
      loading: "Loading…",
      error: "Something went wrong.",
      offline: "You're offline. We'll retry when you're back.",
      empty: "Nothing here yet.",
      retry: "Try again",
      ready: "Content loaded",
    },
    form: {
      email: "Email",
      note: "Message",
      submit: "Send",
      hint: "Type something, then switch to Offline and press Send.",
    },
    result: "Your order shipped",
  },
  "ar-EG": {
    boundary: {
      loading: "جارٍ التحميل…",
      error: "حدث خطأ ما.",
      offline: "أنت غير متصل. سنعيد المحاولة عند عودتك.",
      empty: "لا يوجد شيء هنا بعد.",
      retry: "أعد المحاولة",
      ready: "تم تحميل المحتوى",
    },
    form: {
      email: "البريد الإلكتروني",
      note: "الرسالة",
      submit: "إرسال",
      hint: "اكتب شيئًا ثم انتقل إلى وضع عدم الاتصال واضغط إرسال.",
    },
    result: "تم شحن طلبك",
  },
  "hi-IN": {
    boundary: {
      loading: "लोड हो रहा है…",
      error: "कुछ गड़बड़ हो गई।",
      offline: "आप ऑफ़लाइन हैं। कनेक्शन आते ही दोबारा कोशिश करेंगे।",
      empty: "अभी यहाँ कुछ नहीं है।",
      retry: "फिर कोशिश करें",
      ready: "सामग्री लोड हो गई",
    },
    form: {
      email: "ईमेल",
      note: "संदेश",
      submit: "भेजें",
      hint: "कुछ लिखें, फिर ऑफ़लाइन पर जाकर भेजें दबाएँ।",
    },
    result: "आपका ऑर्डर भेज दिया गया",
  },
  "fa-IR": {
    boundary: {
      loading: "در حال بارگذاری…",
      error: "مشکلی پیش آمد.",
      offline: "آفلاین هستید. پس از اتصال دوباره تلاش می‌کنیم.",
      empty: "هنوز چیزی اینجا نیست.",
      retry: "دوباره تلاش کنید",
      ready: "محتوا بارگذاری شد",
    },
    form: {
      email: "ایمیل",
      note: "پیام",
      submit: "ارسال",
      hint: "چیزی بنویسید، سپس به حالت آفلاین بروید و ارسال را بزنید.",
    },
    result: "سفارش شما ارسال شد",
  },
  "th-TH": {
    boundary: {
      loading: "กำลังโหลด…",
      error: "เกิดข้อผิดพลาด",
      offline: "คุณออฟไลน์อยู่ เราจะลองใหม่เมื่อกลับมาออนไลน์",
      empty: "ยังไม่มีอะไรที่นี่",
      retry: "ลองอีกครั้ง",
      ready: "โหลดเนื้อหาแล้ว",
    },
    form: {
      email: "อีเมล",
      note: "ข้อความ",
      submit: "ส่ง",
      hint: "พิมพ์อะไรสักอย่าง แล้วสลับเป็นออฟไลน์และกดส่ง",
    },
    result: "จัดส่งคำสั่งซื้อของคุณแล้ว",
  },
  "he-IL": {
    boundary: {
      loading: "טוען…",
      error: "משהו השתבש.",
      offline: "אין חיבור. ננסה שוב כשתחזור.",
      empty: "אין כאן עדיין כלום.",
      retry: "נסה שוב",
      ready: "התוכן נטען",
    },
    form: {
      email: "דוא\"ל",
      note: "הודעה",
      submit: "שליחה",
      hint: "כתוב משהו, עבור למצב לא מקוון ולחץ שליחה.",
    },
    result: "ההזמנה נשלחה",
  },
  "ur-PK": {
    boundary: {
      loading: "لوڈ ہو رہا ہے…",
      error: "کچھ غلط ہو گیا۔",
      offline: "آپ آف لائن ہیں۔ رابطہ بحال ہوتے ہی دوبارہ کوشش کریں گے۔",
      empty: "یہاں ابھی کچھ نہیں ہے۔",
      retry: "دوبارہ کوشش کریں",
      ready: "مواد لوڈ ہو گیا",
    },
    form: {
      email: "ای میل",
      note: "پیغام",
      submit: "بھیجیں",
      hint: "کچھ لکھیں، پھر آف لائن پر جا کر بھیجیں دبائیں۔",
    },
    result: "آپ کا آرڈر بھیج دیا گیا",
  },
  "bn-BD": {
    boundary: {
      loading: "লোড হচ্ছে…",
      error: "কিছু একটা ভুল হয়েছে।",
      offline: "আপনি অফলাইনে আছেন। সংযোগ ফিরলে আবার চেষ্টা করব।",
      empty: "এখানে এখনো কিছু নেই।",
      retry: "আবার চেষ্টা করুন",
      ready: "কনটেন্ট লোড হয়েছে",
    },
    form: {
      email: "ইমেইল",
      note: "বার্তা",
      submit: "পাঠান",
      hint: "কিছু লিখুন, তারপর অফলাইনে গিয়ে পাঠান চাপুন।",
    },
    result: "আপনার অর্ডার পাঠানো হয়েছে",
  },
  "zh-CN": {
    boundary: {
      loading: "加载中…",
      error: "出了点问题。",
      offline: "您已离线。恢复连接后我们会重试。",
      empty: "这里还没有内容。",
      retry: "重试",
      ready: "内容已加载",
    },
    form: {
      email: "电子邮件",
      note: "留言",
      submit: "发送",
      hint: "输入一些内容，然后切换到离线并点击发送。",
    },
    result: "您的订单已发货",
  },
  "ja-JP": {
    boundary: {
      loading: "読み込み中…",
      error: "問題が発生しました。",
      offline: "オフラインです。接続が戻り次第、再試行します。",
      empty: "ここにはまだ何もありません。",
      retry: "再試行",
      ready: "コンテンツを読み込みました",
    },
    form: {
      email: "メールアドレス",
      note: "メッセージ",
      submit: "送信",
      hint: "何か入力し、オフラインに切り替えて送信を押してください。",
    },
    result: "ご注文を発送しました",
  },
};

/** Fixed once per page load so rendering stays pure and the demo stays stable. */
const sample = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

function Panel({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 mb-4 text-sm text-neutral-600 dark:text-neutral-400">{note}</p>
      {children}
    </section>
  );
}

export function Playground() {
  const [locale, setLocale] = useState<string>("en-US");
  const [network, setNetwork] = useState<SimulatedNetwork>("fast");
  const [status, setStatus] = useState<AsyncStatus>("ready");
  const [submitted, setSubmitted] = useState<string | null>(null);

  // Falls back rather than throwing: a locale added to the switcher without
  // a translation should show English copy, not a blank page.
  const strings = STRINGS[locale] ?? STRINGS["en-US"];

  function changeNetwork(mode: SimulatedNetwork) {
    setNetwork(mode);
    simulateNetwork(mode);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Simulated network</legend>
          <span className="me-2 text-sm font-medium">Network</span>
          {NETWORKS.map(({ mode, name }) => (
            <button
              key={mode}
              type="button"
              onClick={() => changeNetwork(mode)}
              aria-pressed={network === mode}
              className={
                network === mode
                  ? "rounded-full bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "rounded-full border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
              }
            >
              {name}
            </button>
          ))}
        </fieldset>

        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Language</legend>
          <span className="me-2 text-sm font-medium">Language</span>
          {LOCALES.map(({ tag, name }) => (
            <button
              key={tag}
              type="button"
              onClick={() => setLocale(tag)}
              aria-pressed={locale === tag}
              lang={tag}
              className={
                locale === tag
                  ? "rounded-full bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "rounded-full border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
              }
            >
              {name}
            </button>
          ))}
        </fieldset>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Nothing below is re-rendered by the switcher with different code paths — these are the
          same components reading the same APIs your users&apos; browsers report.
        </p>
      </div>

      <LocaleProvider locale={locale}>
        <ConnectionStatus className="rounded-lg" />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel
            title="AsyncBoundary"
            note="Four states, announced to screen readers, with height reserved so nothing jumps."
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {(["loading", "error", "empty", "ready"] as const).map((next) => (
                <button
                  key={next}
                  type="button"
                  onClick={() => setStatus(next)}
                  aria-pressed={status === next}
                  className={
                    status === next
                      ? "rounded-md bg-blue-600 px-2.5 py-1 text-sm text-white"
                      : "rounded-md border border-neutral-300 px-2.5 py-1 text-sm dark:border-neutral-700"
                  }
                >
                  {next}
                </button>
              ))}
            </div>

            <AsyncBoundary
              status={status}
              minHeight="7rem"
              onRetry={() => setStatus("ready")}
              labels={strings.boundary}
            >
              <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                <p className="font-medium">{strings.result}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {formatRelative(sample, locale)} ·{" "}
                  {dateTimeFormat(locale, {
                    dateStyle: "long",
                    calendar: getCalendar(locale),
                  }).format(sample)}
                </p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {numberFormat(locale, { style: "currency", currency: "USD" }).format(1299.5)}
                </p>
              </div>
            </AsyncBoundary>
          </Panel>

          <Panel
            title="AdaptiveImage"
            note="On Save-Data or 2G it refuses to spend the user's data until they ask."
          >
            <AdaptiveImage
              src="/demo/voyage.svg"
              alt="A small ship sailing toward the horizon at sunset"
              width={640}
              height={360}
              loadLabel="Load image"
            />
          </Panel>

          <Panel
            title="ResilientForm"
            note={strings.form.hint}
          >
            <ResilientForm
              formKey="playground"
              onSubmit={(data) => setSubmitted(String(data.get("email") ?? ""))}
            >
              <Field name="email" label={strings.form.email} type="email" autoComplete="email" />
              <Field name="note" label={strings.form.note} multiline rows={3} />
              <button
                type="submit"
                className="self-start rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                {strings.form.submit}
              </button>
            </ResilientForm>

            {submitted && (
              <p className="mt-3 text-sm text-green-700 dark:text-green-400">
                Submitted: {submitted}
              </p>
            )}
          </Panel>

          <Panel
            title="Locale facts"
            note="Direction, calendar, digits, and week start — resolved from the tag, not hardcoded."
          >
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-neutral-600 dark:text-neutral-400">Direction</dt>
              <dd className="font-mono">{locale === "ar-EG" || locale === "fa-IR" ? "rtl" : "ltr"}</dd>
              <dt className="text-neutral-600 dark:text-neutral-400">Calendar</dt>
              <dd className="font-mono">{getCalendar(locale)}</dd>
              <dt className="text-neutral-600 dark:text-neutral-400">Number</dt>
              <dd className="font-mono">{numberFormat(locale).format(1234567.89)}</dd>
              <dt className="text-neutral-600 dark:text-neutral-400">Date</dt>
              <dd className="font-mono">
                {dateTimeFormat(locale, { dateStyle: "full", calendar: getCalendar(locale) }).format(
                  sample,
                )}
              </dd>
            </dl>
          </Panel>
        </div>
      </LocaleProvider>
    </div>
  );
}
