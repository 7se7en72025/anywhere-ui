import { useState, type ReactElement } from "react";
import { AsyncBoundary } from "@/registry/gear5/ui/async-boundary";
import { ConnectionStatus } from "@/registry/gear5/ui/connection-status";
import { AdaptiveImage } from "@/registry/gear5/ui/adaptive-image";
import { Field } from "@/registry/gear5/ui/field";
import { ResilientForm } from "@/registry/gear5/ui/resilient-form";
import { ErrorBoundary } from "@/registry/gear5/ui/error-boundary";
import { VisuallyHidden } from "@/registry/gear5/ui/visually-hidden";
import { Kbd } from "@/registry/gear5/ui/kbd";
import { Divider } from "@/registry/gear5/ui/divider";
import { Badge } from "@/registry/gear5/ui/badge";
import { StatusDot } from "@/registry/gear5/ui/status-dot";
import { Avatar } from "@/registry/gear5/ui/avatar";
import { AvatarGroup } from "@/registry/gear5/ui/avatar-group";
import { Chip } from "@/registry/gear5/ui/chip";
import { Card, CardHeader, CardTitle, CardDescription } from "@/registry/gear5/ui/card";
import { Container } from "@/registry/gear5/ui/container";
import { Alert } from "@/registry/gear5/ui/alert";
import { ProgressBar } from "@/registry/gear5/ui/progress-bar";
import { Spinner } from "@/registry/gear5/ui/spinner";
import { Skeleton } from "@/registry/gear5/ui/skeleton";
import { RelativeTime } from "@/registry/gear5/ui/relative-time";
import { PluralText } from "@/registry/gear5/ui/plural-text";
import { ListText } from "@/registry/gear5/ui/list-text";
import { CurrencyText } from "@/registry/gear5/ui/currency-text";
import { EmptyState } from "@/registry/gear5/ui/empty-state";
import { Tooltip } from "@/registry/gear5/ui/tooltip";
import { Switch } from "@/registry/gear5/ui/switch";
import { Checkbox } from "@/registry/gear5/ui/checkbox";
import { RadioGroup } from "@/registry/gear5/ui/radio-group";
import { Slider } from "@/registry/gear5/ui/slider";
import { Rating } from "@/registry/gear5/ui/rating";
import { Accordion } from "@/registry/gear5/ui/accordion";
import { Tabs } from "@/registry/gear5/ui/tabs";
import { Breadcrumb } from "@/registry/gear5/ui/breadcrumb";
import { Pagination } from "@/registry/gear5/ui/pagination";
import { Stepper } from "@/registry/gear5/ui/stepper";
import { CopyButton } from "@/registry/gear5/ui/copy-button";
import { ShareButton } from "@/registry/gear5/ui/share-button";
import { Portal } from "@/registry/gear5/ui/portal";
import { Dialog } from "@/registry/gear5/ui/dialog";
import { Drawer } from "@/registry/gear5/ui/drawer";
import { ToastProvider } from "@/registry/gear5/ui/toast";
import { Popover } from "@/registry/gear5/ui/popover";
import { Menu } from "@/registry/gear5/ui/menu";
import { ThemeToggle } from "@/registry/gear5/ui/theme-toggle";
import { LocaleSwitcher } from "@/registry/gear5/ui/locale-switcher";
import { BackToTop } from "@/registry/gear5/ui/back-to-top";
import { ScrollProgress } from "@/registry/gear5/ui/scroll-progress";
import { Timeline } from "@/registry/gear5/ui/timeline";
import { StatCard } from "@/registry/gear5/ui/stat-card";
import { SearchField } from "@/registry/gear5/ui/search-field";
import { TagInput } from "@/registry/gear5/ui/tag-input";
import { PasswordField } from "@/registry/gear5/ui/password-field";
import { OtpInput } from "@/registry/gear5/ui/otp-input";
import { NumberField } from "@/registry/gear5/ui/number-field";
import { HoneypotField } from "@/registry/gear5/ui/honeypot-field";
import { ConsentBanner } from "@/registry/gear5/ui/consent-banner";
import { ReducedMotionToggle } from "@/registry/gear5/ui/reduced-motion-toggle";
import { DataSaverToggle } from "@/registry/gear5/ui/data-saver-toggle";
import { AccessibilityMenu } from "@/registry/gear5/ui/accessibility-menu";
import { TableOfContents } from "@/registry/gear5/ui/table-of-contents";
import { CodeBlock } from "@/registry/gear5/ui/code-block";
import { QuoteBlock } from "@/registry/gear5/ui/quote-block";
import { Select } from "@/registry/gear5/ui/select";
import { VirtualList } from "@/registry/gear5/ui/virtual-list";
import { Table } from "@/registry/gear5/ui/table";
import { KeyboardShortcutsHelp } from "@/registry/gear5/ui/keyboard-shortcuts-help";
import { CommandPalette } from "@/registry/gear5/ui/command-palette";
import { FileUpload } from "@/registry/gear5/ui/file-upload";
import { InfiniteScroll } from "@/registry/gear5/ui/infinite-scroll";
import { LazyMount } from "@/registry/gear5/ui/lazy-mount";
import { ContextMenu } from "@/registry/gear5/ui/context-menu";
import { Navbar } from "@/registry/gear5/ui/navbar";
import { Footer } from "@/registry/gear5/ui/footer";
import { Sidebar } from "@/registry/gear5/ui/sidebar";
import { DirectionalIcon } from "@/registry/gear5/ui/directional-icon";
import { MasonryGrid } from "@/registry/gear5/ui/masonry-grid";
import { Calendar } from "@/registry/gear5/ui/calendar";
import { TimeField } from "@/registry/gear5/ui/time-field";
import { Combobox } from "@/registry/gear5/ui/combobox";
import { MultiSelect } from "@/registry/gear5/ui/multi-select";
import { Disclosure } from "@/registry/gear5/ui/disclosure";
import { PrintButton } from "@/registry/gear5/ui/print-button";
import { Countdown } from "@/registry/gear5/ui/countdown";
import { UnitText } from "@/registry/gear5/ui/unit-text";
import { LiveRegion } from "@/registry/gear5/ui/live-region";
import { SkipLink } from "@/registry/gear5/ui/skip-link";
import { CompactNumber } from "@/registry/gear5/ui/compact-number";
import { BytesText } from "@/registry/gear5/ui/bytes-text";
import { OrdinalText } from "@/registry/gear5/ui/ordinal-text";
import { ReadTime } from "@/registry/gear5/ui/read-time";
import { NameFields } from "@/registry/gear5/ui/name-fields";
import { AddressFields } from "@/registry/gear5/ui/address-fields";
import { SegmentedControl } from "@/registry/gear5/ui/segmented-control";
import { SaveStatus } from "@/registry/gear5/ui/save-status";
import { RetryButton } from "@/registry/gear5/ui/retry-button";
import { TextSizeControl } from "@/registry/gear5/ui/text-size-control";
import { TreeView } from "@/registry/gear5/ui/tree-view";
import { BidiText } from "@/registry/gear5/ui/bidi-text";
import { TruncateText } from "@/registry/gear5/ui/truncate-text";
import { DateRangeText } from "@/registry/gear5/ui/date-range-text";
import { CharacterCounter } from "@/registry/gear5/ui/character-counter";
import { CurrencyField } from "@/registry/gear5/ui/currency-field";
import { UnitField, DISTANCE } from "@/registry/gear5/ui/unit-field";
import { TimezoneSelect } from "@/registry/gear5/ui/timezone-select";
import { Heading, HeadingSection } from "@/registry/gear5/ui/heading-level";
import { LandmarkNav } from "@/registry/gear5/ui/landmark-nav";
import { ErrorSummary } from "@/registry/gear5/ui/error-summary";
import { SortableTable } from "@/registry/gear5/ui/sortable-table";
import { StaleDataNotice } from "@/registry/gear5/ui/stale-data-notice";
import { PasswordStrength } from "@/registry/gear5/ui/password-strength";
import { PhoneNumberField } from "@/registry/gear5/ui/phone-number-field";
import { CreditCardField } from "@/registry/gear5/ui/credit-card-field";
import { PinInput } from "@/registry/gear5/ui/pin-input";
import { ColorPicker } from "@/registry/gear5/ui/color-picker";
import { DateRangePicker } from "@/registry/gear5/ui/date-range-picker";
import { CountryPicker } from "@/registry/gear5/ui/country-picker";
import { SignaturePad } from "@/registry/gear5/ui/signature-pad";
import { RatingInput } from "@/registry/gear5/ui/rating-input";
import { SliderRange } from "@/registry/gear5/ui/slider-range";
import { FileSizeUpload } from "@/registry/gear5/ui/file-size-upload";
import { MultiStepForm } from "@/registry/gear5/ui/multi-step-form";
import { JsonEditor } from "@/registry/gear5/ui/json-editor";
import { MarkdownEditor } from "@/registry/gear5/ui/markdown-editor";
import { TagsInput } from "@/registry/gear5/ui/tags-input";
import { OtpTimer } from "@/registry/gear5/ui/otp-timer";
import { SearchAutocomplete } from "@/registry/gear5/ui/search-autocomplete";
import { QuantityInput } from "@/registry/gear5/ui/quantity-input";
import { ToggleGroup } from "@/registry/gear5/ui/toggle-group";
import { CodeInput } from "@/registry/gear5/ui/code-input";
import { UrlInput } from "@/registry/gear5/ui/url-input";
import { EmailChips } from "@/registry/gear5/ui/email-chips";
import { RangeCalendar } from "@/registry/gear5/ui/range-calendar";
import { TimeRange } from "@/registry/gear5/ui/time-range";
import { CurrencyInput } from "@/registry/gear5/ui/currency-input";
import { BottomNav } from "@/registry/gear5/ui/bottom-nav";
import { MegaMenu } from "@/registry/gear5/ui/mega-menu";
import { TabsVertical } from "@/registry/gear5/ui/tabs-vertical";
import { TreeNav } from "@/registry/gear5/ui/tree-nav";
import { FilterBar } from "@/registry/gear5/ui/filter-bar";
import { AnchorNav } from "@/registry/gear5/ui/anchor-nav";
import { PageHeader } from "@/registry/gear5/ui/page-header";
import { AppShell } from "@/registry/gear5/ui/app-shell";
import { DrawerNav } from "@/registry/gear5/ui/drawer-nav";
import { CommandBar } from "@/registry/gear5/ui/command-bar";
import { FloatingNav } from "@/registry/gear5/ui/floating-nav";
import { StepIndicator } from "@/registry/gear5/ui/step-indicator";
import { CategoryTabs } from "@/registry/gear5/ui/category-tabs";
import { DataGrid } from "@/registry/gear5/ui/data-grid";
import { KanbanBoard } from "@/registry/gear5/ui/kanban-board";
import { CalendarView } from "@/registry/gear5/ui/calendar-view";
import { TimelineAdvanced } from "@/registry/gear5/ui/timeline-advanced";
import { OrgChart } from "@/registry/gear5/ui/org-chart";
import { Sparkline } from "@/registry/gear5/ui/sparkline";
import { MetricCard } from "@/registry/gear5/ui/metric-card";
import { ComparisonTable } from "@/registry/gear5/ui/comparison-table";
import { FaqAccordion } from "@/registry/gear5/ui/faq-accordion";
import { ChangelogView } from "@/registry/gear5/ui/changelog-view";
import { ActivityFeed } from "@/registry/gear5/ui/activity-feed";
import { Leaderboard } from "@/registry/gear5/ui/leaderboard";
import { Snackbar } from "@/registry/gear5/ui/snackbar";
import { InlineAlert } from "@/registry/gear5/ui/inline-alert";
import { Banner } from "@/registry/gear5/ui/banner";
import { LoadingSkeleton } from "@/registry/gear5/ui/loading-skeleton";
import { ProgressCircular } from "@/registry/gear5/ui/progress-circular";
import { StatusBadge } from "@/registry/gear5/ui/status-badge";
import { OnlineIndicator } from "@/registry/gear5/ui/online-indicator";
import { TypingIndicator } from "@/registry/gear5/ui/typing-indicator";
import { NotificationBell } from "@/registry/gear5/ui/notification-bell";
import { UnreadDot } from "@/registry/gear5/ui/unread-dot";
import { ErrorPage } from "@/registry/gear5/ui/error-page";
import { MaintenanceBanner } from "@/registry/gear5/ui/maintenance-banner";
import { RateLimitNotice } from "@/registry/gear5/ui/rate-limit-notice";
import { CooldownTimer } from "@/registry/gear5/ui/cooldown-timer";
import { AudioPlayer } from "@/registry/gear5/ui/audio-player";
import { VideoPlayer } from "@/registry/gear5/ui/video-player";
import { ImageGallery } from "@/registry/gear5/ui/image-gallery";
import { Carousel } from "@/registry/gear5/ui/carousel";
import { BeforeAfter } from "@/registry/gear5/ui/before-after";
import { QrCode } from "@/registry/gear5/ui/qr-code";
import { IconGrid } from "@/registry/gear5/ui/icon-grid";
import { EmojiPicker } from "@/registry/gear5/ui/emoji-picker";
import { ColorSwatch } from "@/registry/gear5/ui/color-swatch";
import { FontPreview } from "@/registry/gear5/ui/font-preview";
import { VideoEmbed } from "@/registry/gear5/ui/video-embed";
import { ResponsiveGrid } from "@/registry/gear5/ui/responsive-grid";
import { MasonryLayout } from "@/registry/gear5/ui/masonry-layout";
import { StackLayout } from "@/registry/gear5/ui/stack-layout";
import { AspectRatio } from "@/registry/gear5/ui/aspect-ratio";
import { ClampText } from "@/registry/gear5/ui/clamp-text";
import { StickyHeader } from "@/registry/gear5/ui/sticky-header";
import { ScrollSpy } from "@/registry/gear5/ui/scroll-spy";
import { InfiniteList } from "@/registry/gear5/ui/infinite-list";
import { VirtualGrid } from "@/registry/gear5/ui/virtual-grid";
import { ResponsiveContainer } from "@/registry/gear5/ui/responsive-container";
import { CardGroup } from "@/registry/gear5/ui/card-group";
import { SplitPane } from "@/registry/gear5/ui/split-pane";
import { AccordionNested } from "@/registry/gear5/ui/accordion-nested";
import { CollapsiblePanel } from "@/registry/gear5/ui/collapsible-panel";
import { ScrollToTop } from "@/registry/gear5/ui/scroll-to-top";
import { AspectCard } from "@/registry/gear5/ui/aspect-card";
import { StatGrid } from "@/registry/gear5/ui/stat-grid";
import { FeaturedCard } from "@/registry/gear5/ui/featured-card";
import { PricingCard } from "@/registry/gear5/ui/pricing-card";
import { TestimonialCard } from "@/registry/gear5/ui/testimonial-card";
import { Scorecard } from "@/registry/gear5/ui/scorecard";
import { HeroSection } from "@/registry/gear5/ui/hero-section";
import { CtaBand } from "@/registry/gear5/ui/cta-band";
import { DividerSection } from "@/registry/gear5/ui/divider-section";
import { ContainerNarrow } from "@/registry/gear5/ui/container-narrow";

/** Small stateful wrappers so controlled components have somewhere to put their state in a fixture. */
function Stateful<T>({ initial, render }: { initial: T; render: (value: T, set: (v: T) => void) => ReactElement }) {
  const [value, setValue] = useState(initial);
  return render(value, setValue);
}

/**
 * One representative, minimally-propped render per `registry:ui` item.
 *
 * Deliberately shared by two consumers that must never disagree: the
 * conformance suite (axe, SSR, static scans) renders these, and the docs site
 * renders these as its live previews. A component whose documented example
 * differs from the example CI verifies is a documentation bug waiting to
 * happen; here that drift is structurally impossible.
 *
 * The cost of adding a component is one entry, which buys it both a test and
 * a docs preview.
 */
export const fixtures: Record<string, () => ReactElement> = {
  "async-boundary": () => (
    <AsyncBoundary status="ready" onRetry={() => {}}>
      <p>Loaded content</p>
    </AsyncBoundary>
  ),
  "connection-status": () => <ConnectionStatus />,
  "adaptive-image": () => (
    <AdaptiveImage src="/demo/voyage.svg" alt="A small ship sailing toward the horizon at sunset" width={640} height={360} />
  ),
  field: () => <Field name="email" label="Email" />,
  "resilient-form": () => (
    <ResilientForm formKey="fixture" onSubmit={() => {}}>
      <Field name="email" label="Email" />
    </ResilientForm>
  ),
  "error-boundary": () => (
    <ErrorBoundary>
      <p>Contained content</p>
    </ErrorBoundary>
  ),
  "visually-hidden": () => <VisuallyHidden>Screen-reader-only text</VisuallyHidden>,
  kbd: () => <Kbd>Esc</Kbd>,
  divider: () => <Divider label="or" />,
  badge: () => <Badge tone="success">Active</Badge>,
  "status-dot": () => <StatusDot tone="success" label="Online" />,
  avatar: () => <Avatar name="Aisha Khan" />,
  "avatar-group": () => (
    <AvatarGroup people={[{ name: "Aisha Khan" }, { name: "Bo Chen" }, { name: "Chidi Okafor" }, { name: "Dev Patel" }, { name: "Eva Muller" }]} />
  ),
  chip: () => <Chip onRemove={() => {}}>Design</Chip>,
  card: () => (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description text</CardDescription>
      </CardHeader>
      <p>Body</p>
    </Card>
  ),
  container: () => <Container>Content</Container>,
  alert: () => (
    <Alert tone="info" title="Heads up">
      Informational message.
    </Alert>
  ),
  "progress-bar": () => <ProgressBar value={40} label="Uploading" />,
  spinner: () => <Spinner label="Loading" />,
  skeleton: () => <Skeleton width={120} height={16} />,
  "relative-time": () => <RelativeTime value={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)} />,
  "plural-text": () => <PluralText count={3} forms={{ one: "{n} item", other: "{n} items" }} />,
  "list-text": () => <ListText items={["Aisha", "Bo", "Chidi"]} />,
  "currency-text": () => <CurrencyText value={12.5} currency="USD" />,
  "empty-state": () => <EmptyState title="No results" description="Try a different search." />,
  tooltip: () => (
    <Tooltip content="More info">
      <button type="button">Hover me</button>
    </Tooltip>
  ),
  switch: () => <Stateful initial={false} render={(v, set) => <Switch checked={v} onCheckedChange={set} label="Notifications" />} />,
  checkbox: () => <Stateful initial={false} render={(v, set) => <Checkbox checked={v} onCheckedChange={set} label="Accept terms" />} />,
  "radio-group": () => (
    <Stateful
      initial="a"
      render={(v, set) => (
        <RadioGroup name="fixture" legend="Choose one" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]} value={v} onChange={set} />
      )}
    />
  ),
  slider: () => <Stateful initial={50} render={(v, set) => <Slider value={v} label="Volume" onChange={set} />} />,
  rating: () => <Rating value={3} label="Rating" />,
  accordion: () => <Accordion items={[{ id: "a", title: "Section A", content: <p>Content A</p> }, { id: "b", title: "Section B", content: <p>Content B</p> }]} />,
  tabs: () => <Tabs items={[{ id: "a", label: "Tab A", content: <p>Content A</p> }, { id: "b", label: "Tab B", content: <p>Content B</p> }]} />,
  breadcrumb: () => <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Shoes" }]} />,
  pagination: () => <Stateful initial={1} render={(v, set) => <Pagination page={v} pageCount={5} onChange={set} />} />,
  stepper: () => <Stepper steps={[{ label: "Cart" }, { label: "Shipping" }, { label: "Payment" }]} current={1} />,
  "copy-button": () => <CopyButton value="hello" />,
  "share-button": () => <ShareButton url="https://example.com" title="Example" />,
  portal: () => (
    <Portal>
      <p>Portaled content</p>
    </Portal>
  ),
  dialog: () => (
    <Dialog open onClose={() => {}} title="Fixture dialog">
      <p>Dialog content</p>
    </Dialog>
  ),
  drawer: () => (
    <Drawer open onClose={() => {}} title="Fixture drawer">
      <p>Drawer content</p>
    </Drawer>
  ),
  toast: () => (
    <ToastProvider>
      <p>App content</p>
    </ToastProvider>
  ),
  popover: () => (
    <Popover trigger={(props) => <button type="button" {...props}>Open</button>}>
      <p>Popover content</p>
    </Popover>
  ),
  menu: () => <Menu label="Actions" actions={[{ label: "Edit", onSelect: () => {} }, { label: "Delete", onSelect: () => {} }]} />,
  "theme-toggle": () => <ThemeToggle />,
  "locale-switcher": () => (
    <Stateful
      initial="en-US"
      render={(v, set) => <LocaleSwitcher options={[{ tag: "en-US", nativeName: "English" }, { tag: "ar-EG", nativeName: "العربية" }]} value={v} onChange={set} />}
    />
  ),
  "back-to-top": () => <BackToTop />,
  "scroll-progress": () => <ScrollProgress />,
  timeline: () => <Timeline entries={[{ title: "Order placed", time: "9:00" }, { title: "Shipped", time: "10:00" }]} />,
  "stat-card": () => <StatCard label="Revenue" value="$12,400" change="+4% vs last week" changeTone="positive" />,
  "search-field": () => <Stateful initial="" render={(v, set) => <SearchField value={v} onChange={set} label="Search" />} />,
  "tag-input": () => <Stateful initial={["urgent"]} render={(v, set) => <TagInput value={v} onChange={set} label="Tags" />} />,
  "password-field": () => <Stateful initial="" render={(v, set) => <PasswordField value={v} onChange={set} name="password" label="Password" />} />,
  "otp-input": () => <Stateful initial="" render={(v, set) => <OtpInput value={v} onChange={set} label="Verification code" />} />,
  "number-field": () => <Stateful initial={1} render={(v, set) => <NumberField value={v} onChange={set} label="Quantity" min={0} />} />,
  "honeypot-field": () => <HoneypotField />,
  "consent-banner": () => <ConsentBanner storageKey={`fixture-consent-${Math.random()}`} />,
  "reduced-motion-toggle": () => <ReducedMotionToggle />,
  "data-saver-toggle": () => <DataSaverToggle />,
  "accessibility-menu": () => <AccessibilityMenu />,
  "table-of-contents": () => <TableOfContents entries={[{ id: "intro", label: "Introduction" }, { id: "usage", label: "Usage", depth: 1 }]} />,
  "code-block": () => <CodeBlock code="const x = 1;" language="js" />,
  "quote-block": () => <QuoteBlock citation="Ada Lovelace">The Analytical Engine has no pretensions to originate anything.</QuoteBlock>,
  select: () => (
    <Stateful initial="a" render={(v, set) => <Select value={v} onChange={set} label="Country" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]} />} />
  ),
  "virtual-list": () => (
    <VirtualList items={Array.from({ length: 100 }, (_, i) => i)} itemHeight={32} height={128} renderItem={(item) => <div>Row {item}</div>} />
  ),
  table: () => (
    <Table
      columns={[{ key: "name", header: "Name", render: (r: { name: string }) => r.name, sortable: true }]}
      rows={[{ name: "Aisha" }, { name: "Bo" }]}
    />
  ),
  "keyboard-shortcuts-help": () => (
    <KeyboardShortcutsHelp open onClose={() => {}} shortcuts={[{ keys: ["Ctrl", "K"], description: "Open command palette" }]} />
  ),
  "command-palette": () => <CommandPalette open onClose={() => {}} commands={[{ id: "new", label: "New file", onRun: () => {} }]} />,
  "file-upload": () => <FileUpload label="Attachment" onFiles={() => {}} />,
  "infinite-scroll": () => <InfiniteScroll onLoadMore={() => {}} hasMore loading={false} />,
  "lazy-mount": () => (
    <LazyMount eager fallback={<p>Loading…</p>}>
      <p>Mounted content</p>
    </LazyMount>
  ),
  "context-menu": () => (
    <ContextMenu actions={[{ label: "Copy", onSelect: () => {} }]}>
      <div>Right-click me</div>
    </ContextMenu>
  ),
  navbar: () => <Navbar brand="Anywhere UI" links={[{ label: "Docs", href: "/docs", current: true }, { label: "Blog", href: "/blog" }]} />,
  footer: () => <Footer copyright="© 2026 Anywhere UI" links={[{ label: "Privacy", href: "/privacy" }]} />,
  sidebar: () => <Sidebar items={[{ label: "Overview", href: "/", current: true }, { label: "Settings", href: "/settings" }]} />,
  "directional-icon": () => <DirectionalIcon>→</DirectionalIcon>,
  "masonry-grid": () => (
    <MasonryGrid columns={2}>
      <div>Card A</div>
      <div>Card B</div>
    </MasonryGrid>
  ),
  calendar: () => <Stateful initial={new Date("2026-06-15")} render={(v, set) => <Calendar value={v} onChange={set} />} />,
  "time-field": () => <Stateful initial="09:30" render={(v, set) => <TimeField value={v} onChange={set} label="Start time" />} />,
  combobox: () => (
    <Stateful initial="a" render={(v, set) => <Combobox value={v} onChange={set} label="Country" options={[{ value: "a", label: "Argentina" }, { value: "b", label: "Brazil" }]} />} />
  ),
  "multi-select": () => (
    <Stateful initial={["a"]} render={(v, set) => <MultiSelect value={v} onChange={set} label="Toppings" options={[{ value: "a", label: "Cheese" }, { value: "b", label: "Olives" }]} />} />
  ),
  disclosure: () => <Disclosure summary="More details">Extra content</Disclosure>,
  "print-button": () => <PrintButton />,
  countdown: () => <Countdown target={Date.now() + 60_000} />,
  "unit-text": () => <UnitText value={3.2} unit="kilometer" />,
  "live-region": () => <LiveRegion message="3 results loaded" />,
  "skip-link": () => <SkipLink href="#main">Skip to content</SkipLink>,
  "compact-number": () => <CompactNumber value={1234567} />,
  "bytes-text": () => <BytesText bytes={5_400_000} />,
  "ordinal-text": () => <OrdinalText value={23} />,
  "read-time": () => <ReadTime words={1400} />,
  "name-fields": () => <NameFields />,
  "address-fields": () => <AddressFields region="JP" />,
  "segmented-control": () => (
    <Stateful
      initial="week"
      render={(v, set) => (
        <SegmentedControl
          label="Range"
          value={v}
          onChange={set}
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
      )}
    />
  ),
  "save-status": () => <SaveStatus state="saved" />,
  "retry-button": () => <RetryButton onRetry={() => {}} />,
  "text-size-control": () => <TextSizeControl />,
  "tree-view": () => (
    <TreeView
      label="Project files"
      defaultExpanded={["src"]}
      nodes={[
        {
          id: "src",
          label: "src",
          children: [
            { id: "index", label: "index.ts" },
            { id: "ui", label: "ui", children: [{ id: "button", label: "button.tsx" }] },
          ],
        },
        { id: "readme", label: "README.md" },
      ]}
    />
  ),
  "bidi-text": () => (
    <p>
      Reply from <BidiText>محمد</BidiText> (3 replies)
    </p>
  ),
  "truncate-text": () => <TruncateText text="A headline long enough to need shortening 👨‍👩‍👧‍👦" limit={24} />,
  "date-range-text": () => (
    <DateRangeText start={new Date("2026-01-01")} end={new Date("2026-01-05")} />
  ),
  "character-counter": () => <CharacterCounter value="Hello 👋" limit={20} />,
  "currency-field": () => (
    <Stateful
      initial={1299.5 as number | null}
      render={(v, set) => (
        <CurrencyField label="Amount" name="amount" currency="EUR" value={v} onChange={set} />
      )}
    />
  ),
  "unit-field": () => (
    <Stateful
      initial={12 as number | null}
      render={(v, set) => (
        <UnitField label="Distance" name="distance" pair={DISTANCE} value={v} onChange={set} />
      )}
    />
  ),
  "timezone-select": () => (
    <Stateful
      initial="Europe/Berlin"
      render={(v, set) => (
        <TimezoneSelect
          label="Timezone"
          value={v}
          onChange={set}
          zones={["Europe/Berlin", "Asia/Kolkata", "America/New_York", "UTC"]}
        />
      )}
    />
  ),
  "heading-level": () => (
    <div>
      <Heading>Page title</Heading>
      <HeadingSection>
        <Heading>Section inside it</Heading>
      </HeadingSection>
    </div>
  ),
  "landmark-nav": () => (
    <LandmarkNav landmarks={[{ id: "main", label: "Main content" }, { id: "nav", label: "Navigation" }]} />
  ),
  "error-summary": () => (
    <ErrorSummary errors={[{ field: "email", message: "Enter a valid email address" }]} />
  ),
  "sortable-table": () => (
    <SortableTable
      caption="Contributors"
      rowKey={(row) => row.name}
      columns={[
        { key: "name", header: "Name", value: (row) => row.name },
        { key: "commits", header: "Commits", value: (row) => row.commits },
      ]}
      rows={[
        { name: "Ångström", commits: 12 },
        { name: "Élodie", commits: 30 },
        { name: "Zhang", commits: 7 },
      ]}
    />
  ),
  "stale-data-notice": () => <StaleDataNotice updatedAt={Date.now() - 15 * 60 * 1000} />,
  "password-strength": () => <PasswordStrength value="test123" label="Password strength" />,
  "phone-number-field": () => <PhoneNumberField label="Phone" value="" onChange={() => {}} />,
  "credit-card-field": () => <CreditCardField label="Card number" value="" onChange={() => {}} />,
  "pin-input": () => <PinInput length={4} value="" onChange={() => {}} label="PIN" />,
  "color-picker": () => <ColorPicker value="#3b82f6" onChange={() => {}} label="Color" />,
  "date-range-picker": () => <Stateful initial={{ start: null, end: null } as { start: Date | null; end: Date | null }} render={(v, set) => <DateRangePicker value={v} onChange={set} label="Date range" />} />,
  "country-picker": () => <CountryPicker value="" onChange={() => {}} label="Country" />,
  "signature-pad": () => <SignaturePad value="" onChange={() => {}} label="Signature" />,
  "rating-input": () => <RatingInput value={3} onChange={() => {}} label="Rating" />,
  "slider-range": () => <SliderRange min={0} max={100} minVal={25} maxVal={75} onChange={() => {}} label="Range" />,
  "file-size-upload": () => <FileSizeUpload label="Upload" maxSize={5000000} onFiles={() => {}} />,
  "multi-step-form": () => <MultiStepForm steps={[{label: "Step 1", content: <p>Step 1</p>}, {label: "Step 2", content: <p>Step 2</p>}]} onComplete={() => {}} label="Multi-step form" />,
  "json-editor": () => <JsonEditor value="{}" onChange={() => {}} label="JSON" />,
  "markdown-editor": () => <MarkdownEditor value="Hello" onChange={() => {}} label="Markdown" />,
  "tags-input": () => <TagsInput value={["tag1"]} onChange={() => {}} label="Tags" />,
  "otp-timer": () => <OtpTimer duration={60} onResend={() => {}} />,
  "search-autocomplete": () => <SearchAutocomplete results={[{value: "apple", label: "Apple"}, {value: "banana", label: "Banana"}]} value="" onChange={() => {}} onSelect={() => {}} label="Search" />,
  "quantity-input": () => <QuantityInput value={1} onChange={() => {}} label="Quantity" min={0} max={10} />,
  "toggle-group": () => <ToggleGroup value="a" onChange={() => {}} options={[{value:"a",label:"A"},{value:"b",label:"B"}]} label="Options" />,
  "code-input": () => <CodeInput value="const x = 1;" onChange={() => {}} label="Code" language="js" />,
  "url-input": () => <UrlInput value="" onChange={() => {}} label="URL" />,
  "email-chips": () => <EmailChips value={["a@b.com"]} onChange={() => {}} label="Emails" />,
  "range-calendar": () => <Stateful initial={{ start: null, end: null } as { start: Date | null; end: Date | null }} render={(v, set) => <RangeCalendar value={v} onChange={set} label="Range calendar" />} />,
  "time-range": () => <TimeRange start="09:00" end="17:00" onStartChange={() => {}} onEndChange={() => {}} label="Time range" />,
  "currency-input": () => <CurrencyInput value={0} onChange={() => {}} label="Amount" currency="USD" />,
  "bottom-nav": () => <BottomNav items={[{id:"home",label:"Home",icon:"🏠",href:"/"},{id:"search",label:"Search",icon:"🔍",href:"/search"}]} />,
  "mega-menu": () => <MegaMenu trigger={<span>Menu</span>} columns={[{heading:"Col1",items:[{id:"item1",label:"Item1",href:"/"}]}]} />,
  "tabs-vertical": () => <TabsVertical items={[{id:"a",label:"Tab A",content:<p>A</p>},{id:"b",label:"Tab B",content:<p>B</p>}]} />,
  "tree-nav": () => <TreeNav label="Navigation" nodes={[{id:"root",label:"Root",href:"/",children:[{id:"child",label:"Child",href:"/child"}]}]} />,
  "filter-bar": () => <FilterBar filters={[{id:"a",label:"Filter A"},{id:"b",label:"Filter B"}]} activeIds={[]} onChange={() => {}} />,
  "anchor-nav": () => <AnchorNav items={[{id:"sec1",label:"Section 1"},{id:"sec2",label:"Section 2"}]} />,
  "page-header": () => <PageHeader title="Page Title" subtitle="Description" />,
  "app-shell": () => <AppShell sidebar={<nav>Sidebar</nav>} header={<header>Header</header>}><p>Main content</p></AppShell>,
  "drawer-nav": () => <DrawerNav open onClose={() => {}}><nav>Navigation</nav></DrawerNav>,
  "command-bar": () => <CommandBar actions={[{id:"action1",label:"Action 1",icon:"📌",onClick:() => {}},{id:"action2",label:"Action 2",icon:"📌",onClick:() => {}}]} />,
  "floating-nav": () => <FloatingNav items={[{id:"home",label:"Home",href:"/"}]} />,
  "step-indicator": () => <StepIndicator steps={[{id:"step1",label:"Step 1"},{id:"step2",label:"Step 2"},{id:"step3",label:"Step 3"}]} currentId="step2" />,
  "category-tabs": () => <CategoryTabs tabs={[{id:"a",label:"Cat A"},{id:"b",label:"Cat B"}]} activeId="a" onChange={() => {}} />,
  "data-grid": () => <DataGrid columns={[{key:"name",header:"Name",render:(row: {name:string}) => row.name}]} rows={[{name:"Aisha"},{name:"Bo"}]} />,
  "kanban-board": () => <KanbanBoard columns={[{id:"todo",title:"To Do",cards:[{id:"1",title:"Task 1"}]}]} />,
  "calendar-view": () => <CalendarView events={[]} />,
  "timeline-advanced": () => <TimelineAdvanced entries={[{id:"event1",title:"Event 1",time:"9:00",group:"Group",description:"Desc"}]} />,
  "org-chart": () => <OrgChart root={{id:"ceo",name:"CEO",children:[{id:"cto",name:"CTO"}]}} />,
  "sparkline": () => <Sparkline data={[10,20,15,25,30]} label="Trend" />,
  "metric-card": () => <MetricCard label="Revenue" value="$12k" trend="up" />,
  "comparison-table": () => <ComparisonTable plans={["Pro","Free"]} features={[{name:"Feature A",values:[true,false]}]} />,
  "faq-accordion": () => <FaqAccordion items={[{id:"q1",question:"Question 1",answer:"Answer 1"}]} />,
  "changelog-view": () => <ChangelogView entries={[{version:"1.0.0",date:"2026-01-01",changes:[{type:"added",description:"Initial release"}]}]} />,
  "activity-feed": () => <ActivityFeed entries={[{id:"act1",user:{name:"Aisha"},action:"committed",timestamp:"2m ago"}]} />,
  "leaderboard": () => <Leaderboard entries={[{id:"user1",name:"Aisha",score:100}]} />,
  "snackbar": () => <Snackbar message="Changes saved" actionLabel="Undo" onAction={() => {}} />,
  "inline-alert": () => <InlineAlert tone="info">This is informational.</InlineAlert>,
  "banner": () => <Banner tone="info" dismissible onDismiss={() => {}}>New version available</Banner>,
  "loading-skeleton": () => <LoadingSkeleton variant="text" width={200} height={16} />,
  "progress-circular": () => <ProgressCircular value={60} label="Loading" />,
  "status-badge": () => <StatusBadge tone="success" label="Active" />,
  "online-indicator": () => <OnlineIndicator online={true} />,
  "typing-indicator": () => <TypingIndicator />,
  "notification-bell": () => <NotificationBell count={3} />,
  "unread-dot": () => <UnreadDot />,
  "error-page": () => <ErrorPage statusCode={404} />,
  "maintenance-banner": () => <MaintenanceBanner scheduledEnd={new Date(Date.now() + 3600000)} />,
  "rate-limit-notice": () => <RateLimitNotice retryAfterSeconds={30} />,
  "cooldown-timer": () => <CooldownTimer durationMs={10000} />,
  "audio-player": () => <AudioPlayer src="/audio.mp3" label="Audio" />,
  "video-player": () => <VideoPlayer src="/video.mp4" label="Video" />,
  "image-gallery": () => <ImageGallery images={[{src:"/img1.jpg",alt:"Image 1"}]} />,
  "carousel": () => <Carousel slides={[<p key="1">Slide 1</p>,<p key="2">Slide 2</p>]} />,
  "before-after": () => <BeforeAfter beforeSrc="/before.jpg" afterSrc="/after.jpg" beforeLabel="Before" afterLabel="After" />,
  "qr-code": () => <QrCode value="https://example.com" />,
  "icon-grid": () => <IconGrid icons={[{name:"home",path:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{name:"search",path:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"}]} onSelect={() => {}} />,
  "emoji-picker": () => <EmojiPicker onSelect={() => {}} />,
  "color-swatch": () => <ColorSwatch colors={[{name:"Red",hex:"#ff0000"},{name:"Green",hex:"#00ff00"},{name:"Blue",hex:"#0000ff"}]} />,
  "font-preview": () => <FontPreview fonts={["sans-serif","serif","monospace"]} text="Preview" />,
  "video-embed": () => <VideoEmbed src="https://example.com/video" title="Video" />,
  "responsive-grid": () => <ResponsiveGrid minColumnSize="200px"><div>A</div><div>B</div></ResponsiveGrid>,
  "masonry-layout": () => <MasonryLayout columns={2} gap="1rem"><div>A</div><div>B</div></MasonryLayout>,
  "stack-layout": () => <StackLayout gap="1rem"><div>A</div><div>B</div></StackLayout>,
  "aspect-ratio": () => <AspectRatio ratio={16/9}><div>Content</div></AspectRatio>,
  "clamp-text": () => <ClampText lines={2}>Long text to clamp</ClampText>,
  "sticky-header": () => <StickyHeader><div>Sticky</div></StickyHeader>,
  "scroll-spy": () => <ScrollSpy items={[{id:"a",label:"A"},{id:"b",label:"B"}]}><div><div id="a">Section A</div><div id="b">Section B</div></div></ScrollSpy>,
  "infinite-list": () => <InfiniteList items={[1,2,3]} renderItem={(item, index) => <div>{item}</div>} loadMore={() => Promise.resolve()} hasMore />,
  "virtual-grid": () => <VirtualGrid items={Array.from({length:20},(_, i) => i)} columns={3} rowHeight={100} renderItem={(item, index) => <div>{item}</div>} />,
  "responsive-container": () => <ResponsiveContainer>{(breakpoint) => <div>Content at {breakpoint}</div>}</ResponsiveContainer>,
  "card-group": () => <CardGroup><div>Card 1</div><div>Card 2</div></CardGroup>,
  "split-pane": () => <SplitPane left={<div>Left</div>} right={<div>Right</div>} />,
  "accordion-nested": () => <AccordionNested><div><button type="button">Section A</button><div>Content</div></div></AccordionNested>,
  "collapsible-panel": () => <CollapsiblePanel trigger={<span>Details</span>}><p>Content</p></CollapsiblePanel>,
  "scroll-to-top": () => <ScrollToTop />,
  "aspect-card": () => <AspectCard image={<img src="/img.jpg" alt="Image" />}><p>Content</p></AspectCard>,
  "stat-grid": () => <StatGrid stats={[{label:"Revenue",value:"$12k"},{label:"Users",value:"1.2k"}]} />,
  "featured-card": () => <FeaturedCard title="Featured"><p>Content</p></FeaturedCard>,
  "pricing-card": () => <PricingCard planName="Pro" price="$9/mo" features={["Feature 1","Feature 2"]} ctaText="Get Started" />,
  "testimonial-card": () => <TestimonialCard quote="Great library!" name="Aisha" role="Developer" />,
  "scorecard": () => <Scorecard stats={[{label:"Score",value:95},{label:"Rank",value:1}]} />,
  "hero-section": () => <HeroSection title="Welcome" subtitle="Description" primaryCta={{text:"Get Started",href:"/"}} />,
  "cta-band": () => <CtaBand title="Ready?" description="Start building." ctaText="Start" ctaHref="/" />,
  "divider-section": () => <DividerSection label="or" />,
  "container-narrow": () => <ContainerNarrow><p>Narrow content</p></ContainerNarrow>,
};
