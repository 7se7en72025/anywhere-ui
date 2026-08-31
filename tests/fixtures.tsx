import { useState, type ReactElement } from "react";
import { AsyncBoundary } from "@/registry/anywhere/ui/async-boundary";
import { ConnectionStatus } from "@/registry/anywhere/ui/connection-status";
import { AdaptiveImage } from "@/registry/anywhere/ui/adaptive-image";
import { Field } from "@/registry/anywhere/ui/field";
import { ResilientForm } from "@/registry/anywhere/ui/resilient-form";
import { ErrorBoundary } from "@/registry/anywhere/ui/error-boundary";
import { VisuallyHidden } from "@/registry/anywhere/ui/visually-hidden";
import { Kbd } from "@/registry/anywhere/ui/kbd";
import { Divider } from "@/registry/anywhere/ui/divider";
import { Badge } from "@/registry/anywhere/ui/badge";
import { StatusDot } from "@/registry/anywhere/ui/status-dot";
import { Avatar } from "@/registry/anywhere/ui/avatar";
import { AvatarGroup } from "@/registry/anywhere/ui/avatar-group";
import { Chip } from "@/registry/anywhere/ui/chip";
import { Card, CardHeader, CardTitle, CardDescription } from "@/registry/anywhere/ui/card";
import { Container } from "@/registry/anywhere/ui/container";
import { Alert } from "@/registry/anywhere/ui/alert";
import { ProgressBar } from "@/registry/anywhere/ui/progress-bar";
import { Spinner } from "@/registry/anywhere/ui/spinner";
import { Skeleton } from "@/registry/anywhere/ui/skeleton";
import { RelativeTime } from "@/registry/anywhere/ui/relative-time";
import { PluralText } from "@/registry/anywhere/ui/plural-text";
import { ListText } from "@/registry/anywhere/ui/list-text";
import { CurrencyText } from "@/registry/anywhere/ui/currency-text";
import { EmptyState } from "@/registry/anywhere/ui/empty-state";
import { Tooltip } from "@/registry/anywhere/ui/tooltip";
import { Switch } from "@/registry/anywhere/ui/switch";
import { Checkbox } from "@/registry/anywhere/ui/checkbox";
import { RadioGroup } from "@/registry/anywhere/ui/radio-group";
import { Slider } from "@/registry/anywhere/ui/slider";
import { Rating } from "@/registry/anywhere/ui/rating";
import { Accordion } from "@/registry/anywhere/ui/accordion";
import { Tabs } from "@/registry/anywhere/ui/tabs";
import { Breadcrumb } from "@/registry/anywhere/ui/breadcrumb";
import { Pagination } from "@/registry/anywhere/ui/pagination";
import { Stepper } from "@/registry/anywhere/ui/stepper";
import { CopyButton } from "@/registry/anywhere/ui/copy-button";
import { ShareButton } from "@/registry/anywhere/ui/share-button";
import { Portal } from "@/registry/anywhere/ui/portal";
import { Dialog } from "@/registry/anywhere/ui/dialog";
import { Drawer } from "@/registry/anywhere/ui/drawer";
import { ToastProvider } from "@/registry/anywhere/ui/toast";
import { Popover } from "@/registry/anywhere/ui/popover";
import { Menu } from "@/registry/anywhere/ui/menu";
import { ThemeToggle } from "@/registry/anywhere/ui/theme-toggle";
import { LocaleSwitcher } from "@/registry/anywhere/ui/locale-switcher";
import { BackToTop } from "@/registry/anywhere/ui/back-to-top";
import { ScrollProgress } from "@/registry/anywhere/ui/scroll-progress";
import { Timeline } from "@/registry/anywhere/ui/timeline";
import { StatCard } from "@/registry/anywhere/ui/stat-card";
import { SearchField } from "@/registry/anywhere/ui/search-field";
import { TagInput } from "@/registry/anywhere/ui/tag-input";
import { PasswordField } from "@/registry/anywhere/ui/password-field";
import { OtpInput } from "@/registry/anywhere/ui/otp-input";
import { NumberField } from "@/registry/anywhere/ui/number-field";
import { HoneypotField } from "@/registry/anywhere/ui/honeypot-field";
import { ConsentBanner } from "@/registry/anywhere/ui/consent-banner";
import { ReducedMotionToggle } from "@/registry/anywhere/ui/reduced-motion-toggle";
import { DataSaverToggle } from "@/registry/anywhere/ui/data-saver-toggle";
import { AccessibilityMenu } from "@/registry/anywhere/ui/accessibility-menu";
import { TableOfContents } from "@/registry/anywhere/ui/table-of-contents";
import { CodeBlock } from "@/registry/anywhere/ui/code-block";
import { QuoteBlock } from "@/registry/anywhere/ui/quote-block";
import { Select } from "@/registry/anywhere/ui/select";
import { VirtualList } from "@/registry/anywhere/ui/virtual-list";
import { Table } from "@/registry/anywhere/ui/table";
import { KeyboardShortcutsHelp } from "@/registry/anywhere/ui/keyboard-shortcuts-help";
import { CommandPalette } from "@/registry/anywhere/ui/command-palette";
import { FileUpload } from "@/registry/anywhere/ui/file-upload";
import { InfiniteScroll } from "@/registry/anywhere/ui/infinite-scroll";
import { LazyMount } from "@/registry/anywhere/ui/lazy-mount";
import { ContextMenu } from "@/registry/anywhere/ui/context-menu";
import { Navbar } from "@/registry/anywhere/ui/navbar";
import { Footer } from "@/registry/anywhere/ui/footer";
import { Sidebar } from "@/registry/anywhere/ui/sidebar";
import { DirectionalIcon } from "@/registry/anywhere/ui/directional-icon";
import { MasonryGrid } from "@/registry/anywhere/ui/masonry-grid";
import { Calendar } from "@/registry/anywhere/ui/calendar";
import { TimeField } from "@/registry/anywhere/ui/time-field";
import { Combobox } from "@/registry/anywhere/ui/combobox";
import { MultiSelect } from "@/registry/anywhere/ui/multi-select";
import { Disclosure } from "@/registry/anywhere/ui/disclosure";
import { PrintButton } from "@/registry/anywhere/ui/print-button";
import { Countdown } from "@/registry/anywhere/ui/countdown";
import { UnitText } from "@/registry/anywhere/ui/unit-text";
import { LiveRegion } from "@/registry/anywhere/ui/live-region";
import { SkipLink } from "@/registry/anywhere/ui/skip-link";

/** Small stateful wrappers so controlled components have somewhere to put their state in a fixture. */
function Stateful<T>({ initial, render }: { initial: T; render: (value: T, set: (v: T) => void) => ReactElement }) {
  const [value, setValue] = useState(initial);
  return render(value, setValue);
}

/**
 * One representative, minimally-propped render per `registry:ui` item.
 *
 * This is the single fixture every generic conformance check (axe, SSR,
 * static scans) renders — the cost of adding a new component to the
 * conformance suite is one entry here, not a bespoke test file.
 */
export const fixtures: Record<string, () => ReactElement> = {
  "async-boundary": () => (
    <AsyncBoundary status="ready" onRetry={() => {}}>
      <p>Loaded content</p>
    </AsyncBoundary>
  ),
  "connection-status": () => <ConnectionStatus />,
  "adaptive-image": () => (
    <AdaptiveImage src="/demo/photo.svg" alt="A wide landscape illustration" width={640} height={360} />
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
};

/** A child guaranteed to throw during render, for resilience tests. */
export function Boom(): ReactElement {
  throw new Error("fixture: deliberate render crash");
}
