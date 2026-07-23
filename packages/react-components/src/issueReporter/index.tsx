import {
  createElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from "react";
import { Camera, CheckCircle2, Paperclip } from "lucide-react";
import {
  Button,
  Combobox,
  FileUpload,
  Inline,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetTrigger,
  SidePanel,
  Stack,
  Text,
  Textarea,
  type ComboboxGroup,
  type ComboboxOption,
  type FileUploadRejection,
} from "@bota-apps/react-ui";
import type { FeatureNodeDef } from "@bota-apps/types/fm";
import { captureScreenFrame, isScreenCaptureSupported } from "./capture";
import type { CreateIssuePayload } from "./types";

export {
  defaultIssueStatusAppearance,
  type CreateIssuePayload,
  type Issue,
  type IssueScreenshotRef,
  type IssueStatusAppearance,
} from "./types";

export type IssueReporterTranslations = {
  title: string;
  description: string;
  featureLabel: string;
  featurePlaceholder: string;
  featureSearchPlaceholder: string;
  featureNoResults: string;
  /** Group heading for app-wide (root) options in the feature picker. */
  generalGroupLabel: string;
  featureRequiredError: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  descriptionRequiredError: string;
  reproStepsLabel: string;
  reproStepsPlaceholder: string;
  screenshotsLabel: string;
  /** Label for the built-in screen-capture button (shown when supported). */
  captureLabel: string;
  /** Hint shown when a screen capture fails for a technical reason. */
  captureFailedHint: string;
  /** Hint shown when a selection exceeds the screenshot count limit. */
  screenshotsLimitHint: string;
  /** Prefix for the hint listing files rejected by type/size validation. */
  screenshotsRejectedHint: string;
  /** Notice that machine-captured diagnostics ride along with the report. */
  technicalContextNotice: string;
  contactNameLabel: string;
  contactEmailLabel: string;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel: string;
  successMessage: string;
  /** Fallback error message when the submit handler rejects without one. */
  errorMessage: string;
  /** Accessible labels for the panel-variant chrome. */
  closePanelLabel: string;
  widenPanelLabel: string;
  narrowPanelLabel: string;
};

export type IssueReporterProps = {
  /**
   * The host app's feature tree (or a list of top-level nodes). Never
   * serialized — `meta.icon` may be a component and is rendered as-is.
   */
  featureTree: FeatureNodeDef | readonly FeatureNodeDef[];
  /** Persists the issue however the host chooses; resolve = success, reject = inline error. */
  onCreateIssue: (payload: CreateIssuePayload) => Promise<void>;
  /** Feature preselected each time the sheet opens (e.g. the current page). */
  defaultFeatureId?: string;
  /** Prefill for the description field each time the sheet opens (editable). */
  defaultDescription?: string;
  /** Prefill for the repro-steps field each time the sheet opens (editable). */
  defaultReproSteps?: string;
  /**
   * Machine-captured diagnostics to attach to the report (e.g. a classified
   * error's raw detail). Not rendered into any form field — the user sees a
   * short notice that details are attached, triage sees the content.
   */
  defaultTechnicalContext?: string;
  /**
   * Presentation: `sheet` (default) is the modal side-sheet; `panel` renders
   * a non-modal SidePanel meant for an app-shell `panel` slot — the app stays
   * navigable while it is open, and the draft survives close/reopen.
   */
  variant?: "sheet" | "panel";
  /**
   * Panel variant only: bump this key to force the (persistent) draft to be
   * replaced with the current defaults — e.g. each time an error surface
   * opens the reporter with fresh prefills. Without a bump, reopening keeps
   * whatever the user had typed.
   */
  prefillKey?: string | number;
  /** Offer the one-click screen capture when the browser supports it. Default true. */
  enableScreenCapture?: boolean;
  /** Controlled open state; omit to use the uncontrolled trigger. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled mode: content for a built-in sheet trigger (sheet variant only). */
  trigger?: ReactNode;
  /** Show the optional contact fields. Default true. */
  collectContact?: boolean;
  /** Default 5. */
  maxScreenshots?: number;
  /** Default 5 MB. */
  maxScreenshotSizeBytes?: number;
  translations?: Partial<IssueReporterTranslations>;
};

const defaultMaxScreenshots = 5;
const defaultMaxScreenshotSizeBytes = 5 * 1024 * 1024;
// Brief success confirmation before the sheet closes itself.
const successCloseDelayMs = 800;

const defaultTranslations: IssueReporterTranslations = {
  title: "Report an issue",
  description: "Tell us what went wrong and where. Screenshots help a lot.",
  featureLabel: "Feature",
  featurePlaceholder: "Select a feature",
  featureSearchPlaceholder: "Search features...",
  featureNoResults: "No matching features.",
  generalGroupLabel: "General",
  featureRequiredError: "Select the feature the issue relates to.",
  descriptionLabel: "What happened?",
  descriptionPlaceholder: "Describe the problem",
  descriptionRequiredError: "Describe the problem before submitting.",
  reproStepsLabel: "Steps to reproduce (optional)",
  reproStepsPlaceholder: "1. Go to...\n2. Click...",
  screenshotsLabel: "Screenshots (optional)",
  captureLabel: "Capture screen",
  captureFailedHint: "Screen capture didn't work — you can still upload a file.",
  screenshotsLimitHint: "Screenshot limit reached — extra files were not added.",
  screenshotsRejectedHint: "Some files could not be added:",
  technicalContextNotice: "Technical error details will be attached to this report automatically.",
  contactNameLabel: "Your name (optional)",
  contactEmailLabel: "Your email (optional)",
  submitLabel: "Submit issue",
  submittingLabel: "Submitting...",
  cancelLabel: "Cancel",
  successMessage: "Issue reported — thank you!",
  errorMessage: "Something went wrong while submitting. Please try again.",
  closePanelLabel: "Close panel",
  widenPanelLabel: "Widen panel",
  narrowPanelLabel: "Narrow panel",
};

function nodeLabel(node: FeatureNodeDef): string {
  return node.label ?? node.id;
}

/**
 * Renders `meta.icon` only when it plausibly is a React component (function,
 * or an exotic component object like memo/forwardRef) or an already-created
 * element. Anything else in the free-form meta record is ignored.
 */
function nodeIcon(node: FeatureNodeDef): ReactNode {
  const icon = node.meta?.icon;
  if (isValidElement(icon)) {
    return icon;
  }
  const componentLike =
    typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon);
  if (!componentLike) {
    return undefined;
  }
  return createElement(icon as ComponentType<{ className?: string }>, {
    className: "h-4 w-4",
  });
}

// Options for every descendant, with parent context prefixed once nesting
// goes deeper than the module's direct children ("Archive / Restore").
function appendDescendantOptions(
  node: FeatureNodeDef,
  prefix: string | undefined,
  options: ComboboxOption[],
): void {
  for (const child of node.children ?? []) {
    const label = prefix === undefined ? nodeLabel(child) : `${prefix} / ${nodeLabel(child)}`;
    options.push({ value: child.id, label, description: child.description, icon: nodeIcon(child) });
    appendDescendantOptions(child, label, options);
  }
}

/**
 * Flattens the tree into Combobox groups: one group per top-level module
 * (the module itself is the first option, followed by its descendants), plus
 * a trailing "General" group holding app-root nodes so app-wide issues can
 * be filed without picking a specific feature. Node `description`s ride along
 * so the picker explains each entry, not just names it.
 */
function buildFeatureGroups(
  featureTree: FeatureNodeDef | readonly FeatureNodeDef[],
  generalGroupLabel: string,
): ComboboxGroup[] {
  const roots: readonly FeatureNodeDef[] = Array.isArray(featureTree)
    ? featureTree
    : [featureTree as FeatureNodeDef];
  const modules: FeatureNodeDef[] = [];
  const generalOptions: ComboboxOption[] = [];
  for (const root of roots) {
    if (root.target === "app") {
      generalOptions.push({
        value: root.id,
        label: nodeLabel(root),
        description: root.description,
        icon: nodeIcon(root),
      });
      modules.push(...(root.children ?? []));
    } else {
      modules.push(root);
    }
  }
  const groups: ComboboxGroup[] = modules.map((module) => {
    const options: ComboboxOption[] = [
      {
        value: module.id,
        label: nodeLabel(module),
        description: module.description,
        icon: nodeIcon(module),
      },
    ];
    appendDescendantOptions(module, undefined, options);
    return { label: nodeLabel(module), options };
  });
  if (generalOptions.length > 0) {
    groups.push({ label: generalGroupLabel, options: generalOptions });
  }
  return groups;
}

type SubmitState = "idle" | "pending" | "success" | "error";

/**
 * Issue-report form anchored to a feature-tree node, in one of two chromes:
 * a modal side-sheet (default) or a non-modal docked SidePanel. Dumb by
 * design: the tree and the async create handler come from the host; this
 * component only collects and validates the payload.
 */
export function IssueReporter({
  featureTree,
  onCreateIssue,
  defaultFeatureId,
  defaultDescription,
  defaultReproSteps,
  defaultTechnicalContext,
  variant = "sheet",
  prefillKey,
  enableScreenCapture = true,
  open: openProp,
  onOpenChange,
  trigger,
  collectContact = true,
  maxScreenshots = defaultMaxScreenshots,
  maxScreenshotSizeBytes = defaultMaxScreenshotSizeBytes,
  translations,
}: IssueReporterProps) {
  const t = { ...defaultTranslations, ...translations };

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? openProp : uncontrolledOpen;

  const [featureId, setFeatureId] = useState<string | undefined>(defaultFeatureId);
  const [description, setDescription] = useState(defaultDescription ?? "");
  const [reproSteps, setReproSteps] = useState(defaultReproSteps ?? "");
  const [technicalContext, setTechnicalContext] = useState(defaultTechnicalContext);
  const [files, setFiles] = useState<File[]>([]);
  const [fileHint, setFileHint] = useState<string | undefined>(undefined);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [featureError, setFeatureError] = useState<string | undefined>(undefined);
  const [descriptionError, setDescriptionError] = useState<string | undefined>(undefined);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [capturing, setCapturing] = useState(false);

  const hadRejection = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const previouslyOpen = useRef(open);
  // Panel drafts persist across close/reopen; a pristine form still tracks
  // the (route-dependent) defaults on each open, an edited one is kept.
  const dirty = useRef(false);
  const previousPrefillKey = useRef(prefillKey);
  const captureCounter = useRef(0);

  const formId = useId();
  const featureFieldId = useId();
  const descriptionFieldId = useId();
  const reproStepsFieldId = useId();
  const contactNameFieldId = useId();
  const contactEmailFieldId = useId();
  const featureErrorId = useId();
  const descriptionErrorId = useId();

  const resetForm = () => {
    setFeatureId(defaultFeatureId);
    setDescription(defaultDescription ?? "");
    setReproSteps(defaultReproSteps ?? "");
    setTechnicalContext(defaultTechnicalContext);
    setFiles([]);
    setFileHint(undefined);
    setContactName("");
    setContactEmail("");
    setFeatureError(undefined);
    setDescriptionError(undefined);
    setSubmitState("idle");
    setSubmitError(undefined);
    dirty.current = false;
  };

  // Reset policy. Sheet: fresh form on every open (modal sessions are
  // throwaway). Panel: the draft is durable — replace it only when the opener
  // supplies new prefills (prefillKey bump) or when it is pristine anyway.
  useEffect(() => {
    const justOpened = open && !previouslyOpen.current;
    previouslyOpen.current = open;
    const prefillChanged = prefillKey !== previousPrefillKey.current;
    previousPrefillKey.current = prefillKey;
    if (variant === "sheet") {
      if (justOpened) {
        resetForm();
      }
      return;
    }
    if (prefillChanged || (justOpened && !dirty.current)) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetForm reads the latest defaults by closure; running on open/prefill transitions only is the contract.
  }, [open, prefillKey, variant]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  const featureGroups = buildFeatureGroups(featureTree, t.generalGroupLabel);
  const pending = submitState === "pending";
  const succeeded = submitState === "success";
  const captureAvailable = enableScreenCapture && isScreenCaptureSupported();

  const handleFilesChange = (next: File[]) => {
    dirty.current = true;
    const overLimit = next.length > maxScreenshots;
    setFiles(overLimit ? next.slice(0, maxScreenshots) : next);
    if (overLimit) {
      setFileHint(t.screenshotsLimitHint);
    } else if (!hadRejection.current) {
      setFileHint(undefined);
    }
    hadRejection.current = false;
  };

  const handleInvalidFiles = (rejections: FileUploadRejection[]) => {
    hadRejection.current = true;
    const names = rejections.map((rejection) => rejection.file.name).join(", ");
    setFileHint(`${t.screenshotsRejectedHint} ${names}`);
  };

  const handleCapture = async () => {
    setCapturing(true);
    try {
      captureCounter.current += 1;
      const file = await captureScreenFrame(`screen-capture-${captureCounter.current}.png`);
      if (file !== null) {
        handleFilesChange([...files, file]);
      }
    } catch {
      setFileHint(t.captureFailedHint);
    } finally {
      setCapturing(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFeatureError = featureId === undefined ? t.featureRequiredError : undefined;
    const nextDescriptionError =
      description.trim().length === 0 ? t.descriptionRequiredError : undefined;
    setFeatureError(nextFeatureError);
    setDescriptionError(nextDescriptionError);
    if (featureId === undefined || nextDescriptionError !== undefined) {
      return;
    }

    setSubmitState("pending");
    setSubmitError(undefined);
    const trimmedRepro = reproSteps.trim();
    const trimmedTechnicalContext = technicalContext?.trim() ?? "";
    const trimmedName = contactName.trim();
    const trimmedEmail = contactEmail.trim();
    try {
      await onCreateIssue({
        featureId,
        description: description.trim(),
        reproSteps: trimmedRepro.length > 0 ? trimmedRepro : undefined,
        technicalContext: trimmedTechnicalContext.length > 0 ? trimmedTechnicalContext : undefined,
        screenshots: files,
        contactName: collectContact && trimmedName.length > 0 ? trimmedName : undefined,
        contactEmail: collectContact && trimmedEmail.length > 0 ? trimmedEmail : undefined,
      });
      setSubmitState("success");
      dirty.current = false;
      closeTimer.current = window.setTimeout(() => setOpen(false), successCloseDelayMs);
    } catch (error) {
      setSubmitState("error");
      setSubmitError(
        error instanceof Error && error.message.length > 0 ? error.message : t.errorMessage,
      );
    }
  };

  // In the panel the actions live in the SidePanel's pinned footer (outside
  // the <form> element — the submit button targets it via the form id), so
  // they stay visible however long the form scrolls.
  const actions = (
    <Inline gap="sm" justify="end">
      <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
        {t.cancelLabel}
      </Button>
      <Button type="submit" form={formId} disabled={pending || succeeded}>
        {pending ? t.submittingLabel : t.submitLabel}
      </Button>
    </Inline>
  );

  const form = (
    <form id={formId} onSubmit={handleSubmit} noValidate>
      <Stack gap="lg">
        <Stack gap="xs">
          <Label htmlFor={featureFieldId}>{t.featureLabel}</Label>
          <Combobox
            id={featureFieldId}
            options={featureGroups}
            value={featureId}
            onValueChange={(value) => {
              dirty.current = true;
              setFeatureId(value);
              setFeatureError(undefined);
            }}
            placeholder={t.featurePlaceholder}
            searchPlaceholder={t.featureSearchPlaceholder}
            emptyMessage={t.featureNoResults}
            disabled={pending}
          />
          {featureError !== undefined && (
            <Text id={featureErrorId} size="sm" tone="destructive">
              {featureError}
            </Text>
          )}
        </Stack>

        <Stack gap="xs">
          <Label htmlFor={descriptionFieldId}>{t.descriptionLabel}</Label>
          <Textarea
            id={descriptionFieldId}
            value={description}
            onChange={(event) => {
              dirty.current = true;
              setDescription(event.target.value);
              setDescriptionError(undefined);
            }}
            placeholder={t.descriptionPlaceholder}
            rows={4}
            disabled={pending}
            aria-invalid={descriptionError !== undefined || undefined}
            aria-describedby={descriptionError !== undefined ? descriptionErrorId : undefined}
          />
          {descriptionError !== undefined && (
            <Text id={descriptionErrorId} size="sm" tone="destructive">
              {descriptionError}
            </Text>
          )}
        </Stack>

        <Stack gap="xs">
          <Label htmlFor={reproStepsFieldId}>{t.reproStepsLabel}</Label>
          <Textarea
            id={reproStepsFieldId}
            value={reproSteps}
            onChange={(event) => {
              dirty.current = true;
              setReproSteps(event.target.value);
            }}
            placeholder={t.reproStepsPlaceholder}
            rows={3}
            disabled={pending}
          />
        </Stack>

        <Stack gap="xs">
          <Text size="sm" weight="medium" as="span">
            {t.screenshotsLabel}
          </Text>
          <FileUpload
            files={files}
            onFilesChange={handleFilesChange}
            onInvalidFiles={handleInvalidFiles}
            accept="image/*"
            multiple
            maxSizeBytes={maxScreenshotSizeBytes}
            busy={pending}
            size="sm"
          />
          {captureAvailable && (
            <Inline gap="sm">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pending || capturing || files.length >= maxScreenshots}
                onClick={() => void handleCapture()}
              >
                <Camera />
                {t.captureLabel}
              </Button>
            </Inline>
          )}
          {fileHint !== undefined && (
            <Text size="sm" tone="muted">
              {fileHint}
            </Text>
          )}
        </Stack>

        {technicalContext !== undefined && technicalContext.trim().length > 0 && (
          <Text size="sm" tone="muted" className="flex items-start gap-2">
            <Paperclip className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {t.technicalContextNotice}
          </Text>
        )}

        {collectContact && (
          <Stack gap="md">
            <Stack gap="xs">
              <Label htmlFor={contactNameFieldId}>{t.contactNameLabel}</Label>
              <Input
                id={contactNameFieldId}
                value={contactName}
                onChange={(event) => {
                  dirty.current = true;
                  setContactName(event.target.value);
                }}
                autoComplete="name"
                disabled={pending}
              />
            </Stack>
            <Stack gap="xs">
              <Label htmlFor={contactEmailFieldId}>{t.contactEmailLabel}</Label>
              <Input
                id={contactEmailFieldId}
                type="email"
                value={contactEmail}
                onChange={(event) => {
                  dirty.current = true;
                  setContactEmail(event.target.value);
                }}
                autoComplete="email"
                disabled={pending}
              />
            </Stack>
          </Stack>
        )}

        {submitState === "error" && submitError !== undefined && (
          <Text size="sm" tone="destructive" role="alert">
            {submitError}
          </Text>
        )}
        {succeeded && (
          <Text size="sm" tone="success" role="status" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {t.successMessage}
          </Text>
        )}

        {variant !== "panel" && actions}
      </Stack>
    </form>
  );

  if (variant === "panel") {
    return (
      <SidePanel
        open={open}
        onOpenChange={setOpen}
        title={t.title}
        description={t.description}
        closeLabel={t.closePanelLabel}
        widenLabel={t.widenPanelLabel}
        narrowLabel={t.narrowPanelLabel}
        footer={actions}
      >
        {form}
      </SidePanel>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger !== undefined && (
        <SheetTrigger asChild>
          {isValidElement(trigger) ? (
            trigger
          ) : (
            <Button type="button" variant="outline">
              {trigger}
            </Button>
          )}
        </SheetTrigger>
      )}
      <SheetContent title={t.title} description={t.description} className="overflow-y-auto">
        {form}
      </SheetContent>
    </Sheet>
  );
}
