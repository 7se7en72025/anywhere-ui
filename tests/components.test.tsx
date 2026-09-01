import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { AsyncBoundary, statusOf } from "@/registry/gear5/ui/async-boundary";
import { Field } from "@/registry/gear5/ui/field";
import { ResilientForm } from "@/registry/gear5/ui/resilient-form";
import { LocaleProvider } from "@/registry/gear5/lib/use-locale";
import { resetAnnouncer } from "@/registry/gear5/lib/announce";

describe("statusOf", () => {
  it("ranks error above every other state", () => {
    expect(statusOf({ error: new Error("x"), isLoading: true, data: [1] })).toBe("error");
  });

  it("reports an empty array as empty, not ready", () => {
    expect(statusOf({ data: [] })).toBe("empty");
  });

  it("reports nullish data as empty", () => {
    expect(statusOf({ data: null })).toBe("empty");
  });

  it("accepts an explicit emptiness override", () => {
    expect(statusOf({ data: { total: 0 }, isEmpty: true })).toBe("empty");
    expect(statusOf({ data: [], isEmpty: false })).toBe("ready");
  });

  it("reports present data as ready", () => {
    expect(statusOf({ data: [1, 2] })).toBe("ready");
  });
});

describe("AsyncBoundary", () => {
  it("has no axe violations in any state", async () => {
    for (const status of ["loading", "error", "empty", "ready"] as const) {
      const { container, unmount } = render(
        <AsyncBoundary status={status} onRetry={() => {}}>
          <p>Result</p>
        </AsyncBoundary>,
      );

      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });

  it("marks the region busy only while loading", () => {
    const { rerender } = render(
      <AsyncBoundary status="loading">
        <p>Result</p>
      </AsyncBoundary>,
    );
    expect(document.querySelector("[aria-busy='true']")).not.toBeNull();

    rerender(
      <AsyncBoundary status="ready">
        <p>Result</p>
      </AsyncBoundary>,
    );
    expect(document.querySelector("[aria-busy='true']")).toBeNull();
  });

  it("moves focus to the error so retry is the next thing reached", async () => {
    const { rerender } = render(
      <AsyncBoundary status="loading" onRetry={() => {}}>
        <p>Result</p>
      </AsyncBoundary>,
    );

    rerender(
      <AsyncBoundary status="error" onRetry={() => {}}>
        <p>Result</p>
      </AsyncBoundary>,
    );

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("role")).toBe("group");
    });
  });

  it("announces transitions to assistive technology", async () => {
    resetAnnouncer();

    const { rerender } = render(
      <AsyncBoundary status="loading">
        <p>Result</p>
      </AsyncBoundary>,
    );

    rerender(
      <AsyncBoundary status="ready">
        <p>Result</p>
      </AsyncBoundary>,
    );

    await waitFor(() => {
      const regions = Array.from(document.querySelectorAll("[aria-live='polite']"));
      expect(regions.some((r) => r.textContent === "Content loaded")).toBe(true);
    });
  });

  it("does not announce on first paint", () => {
    resetAnnouncer();
    render(
      <AsyncBoundary status="loading">
        <p>Result</p>
      </AsyncBoundary>,
    );

    const regions = Array.from(document.querySelectorAll("[aria-live]"));
    expect(regions.every((r) => !r.textContent)).toBe(true);
  });

  it("reserves height while not ready, and releases it once ready", () => {
    const { container, rerender } = render(
      <AsyncBoundary status="loading" minHeight={200}>
        <p>Result</p>
      </AsyncBoundary>,
    );
    expect((container.firstChild as HTMLElement).style.minHeight).toBe("200px");

    rerender(
      <AsyncBoundary status="ready" minHeight={200}>
        <p>Result</p>
      </AsyncBoundary>,
    );
    expect((container.firstChild as HTMLElement).style.minHeight).toBe("");
  });

  it("renders right-to-left inside an RTL locale", () => {
    const { container } = render(
      <LocaleProvider locale="ar-EG">
        <AsyncBoundary status="ready">
          <p>نتيجة</p>
        </AsyncBoundary>
      </LocaleProvider>,
    );

    expect((container.firstChild as HTMLElement).getAttribute("dir")).toBe("rtl");
  });

  it("uses translated labels verbatim", () => {
    render(
      <AsyncBoundary status="empty" labels={{ empty: "अभी कुछ नहीं है" }}>
        <p>Result</p>
      </AsyncBoundary>,
    );

    expect(screen.getByText("अभी कुछ नहीं है")).toBeTruthy();
  });
});

describe("Field", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Field name="email" label="Email" description="We never share it." required />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("links label, description, and error to the control", () => {
    render(
      <Field
        name="email"
        label="Email"
        description="We never share it."
        error="Enter a valid email address"
      />,
    );

    const input = screen.getByLabelText(/Email/);
    expect(input.getAttribute("aria-invalid")).toBe("true");

    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    const described = describedBy
      .map((id) => document.getElementById(id)?.textContent)
      .join(" ");

    expect(described).toContain("We never share it.");
    expect(described).toContain("Enter a valid email address");
  });

  it("exposes the required state to assistive tech, not just visually", () => {
    render(<Field name="email" label="Email" required />);
    expect(screen.getByLabelText(/Email/).getAttribute("aria-required")).toBe("true");
  });

  it("is not invalid when there is no error", () => {
    render(<Field name="email" label="Email" />);
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBeNull();
  });
});

describe("ResilientForm", () => {
  it("has no axe violations, including with an error summary", async () => {
    const { container } = render(
      <ResilientForm
        formKey="test"
        onSubmit={() => {}}
        errors={{ email: "Enter a valid email address" }}
      >
        <Field name="email" label="Email" error="Enter a valid email address" />
        <button type="submit">Continue</button>
      </ResilientForm>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("saves a draft as the user types and restores it on remount", async () => {
    const user = userEvent.setup();

    const { unmount } = render(
      <ResilientForm formKey="signup" onSubmit={() => {}}>
        <Field name="email" label="Email" />
      </ResilientForm>,
    );

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await waitFor(() => {
      expect(localStorage.getItem("gear5-ui:draft:signup")).toContain("a@b.com");
    });

    unmount();

    render(
      <ResilientForm formKey="signup" onSubmit={() => {}}>
        <Field name="email" label="Email" />
      </ResilientForm>,
    );

    await waitFor(() => {
      expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("a@b.com");
    });
  });

  it("never writes a password to disk", async () => {
    const user = userEvent.setup();

    render(
      <ResilientForm formKey="login" onSubmit={() => {}}>
        <Field name="email" label="Email" />
        <Field name="password" label="Password" type="password" />
      </ResilientForm>,
    );

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "hunter2");

    await waitFor(() => {
      expect(localStorage.getItem("gear5-ui:draft:login")).toContain("a@b.com");
    });
    expect(localStorage.getItem("gear5-ui:draft:login")).not.toContain("hunter2");
  });

  it("clears the draft after a successful submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <ResilientForm formKey="signup" onSubmit={onSubmit}>
        <Field name="email" label="Email" />
        <button type="submit">Continue</button>
      </ResilientForm>,
    );

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(localStorage.getItem("gear5-ui:draft:signup")).toBeNull();
    });
  });

  it("moves focus to the error summary when errors arrive", async () => {
    const { rerender } = render(
      <ResilientForm formKey="signup" onSubmit={() => {}}>
        <Field name="email" label="Email" />
      </ResilientForm>,
    );

    rerender(
      <ResilientForm formKey="signup" onSubmit={() => {}} errors={{ email: "Required" }}>
        <Field name="email" label="Email" error="Required" />
      </ResilientForm>,
    );

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("role")).toBe("alert");
    });
  });

  it("honours persistDraft={false}", async () => {
    const user = userEvent.setup();

    render(
      <ResilientForm formKey="private" onSubmit={() => {}} persistDraft={false}>
        <Field name="email" label="Email" />
      </ResilientForm>,
    );

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    expect(localStorage.getItem("gear5-ui:draft:private")).toBeNull();
  });
});
