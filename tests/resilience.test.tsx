import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ErrorBoundary } from "@/registry/anywhere/ui/error-boundary";
import { Boom } from "./fixtures";

/**
 * Axis: resilience.
 *
 * A crash in one part of a page should cost the user that part, not the page.
 * `ErrorBoundary` is the primitive that makes this true; these tests assert
 * the containment, the announcement, and the recovery path, since none of
 * that is visible to axe or to a plain render-without-throwing check.
 */
describe("ErrorBoundary", () => {
  it("contains a throwing child instead of crashing the test render", () => {
    render(
      <div>
        <p>Sibling content, outside the boundary</p>
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      </div>,
    );

    expect(screen.getByText("Sibling content, outside the boundary")).toBeTruthy();
  });

  it("shows an announced, focusable fallback", () => {
    const { container } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    // Scoped to the render's own container: the shared assertive live region
    // (see announce.ts) also carries role="alert", so an unscoped query
    // matches both.
    expect(within(container).getByRole("alert")).toBeTruthy();
  });

  it("has no axe violations in its fallback state", async () => {
    const { container } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("recovers when retry is pressed and the cause is gone", async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    function Flaky() {
      if (shouldThrow) throw new Error("flaky");
      return <p>Recovered</p>;
    }

    render(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );

    shouldThrow = false;
    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(screen.getByText("Recovered")).toBeTruthy();
  });

  it("supports a custom fallback renderer", () => {
    render(
      <ErrorBoundary fallback={(error) => <p>Custom: {error.message}</p>}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom: fixture: deliberate render crash")).toBeTruthy();
  });
});
