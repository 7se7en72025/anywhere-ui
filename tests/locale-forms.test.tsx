import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AddressFields } from "@/registry/anywhere/ui/address-fields";
import { ErrorSummary } from "@/registry/anywhere/ui/error-summary";
import { NameFields } from "@/registry/anywhere/ui/name-fields";
import { LocaleProvider } from "@/registry/anywhere/lib/use-locale";

/**
 * The two components whose correctness lives in a hand-maintained table rather
 * than in `Intl`. Everything else in the registry inherits its locale
 * behaviour from the platform and is covered by tests/locale.test.ts; these
 * two encode cultural convention, which no API exposes — so the table is the
 * thing that can silently rot, and the thing worth pinning.
 */

function fieldOrder(container: HTMLElement): string[] {
  return [...container.querySelectorAll("input")].map(
    (input) => input.getAttribute("autocomplete") ?? "",
  );
}

describe("AddressFields", () => {
  it("orders smallest-to-largest for the US", () => {
    const { container } = render(<AddressFields region="US" />);

    expect(fieldOrder(container)).toEqual([
      "address-line1",
      "address-line2",
      "address-level2",
      "address-level1",
      "postal-code",
      "country-name",
    ]);
  });

  it("orders largest-to-smallest with the postal code first for Japan", () => {
    const { container } = render(<AddressFields region="JP" />);

    expect(fieldOrder(container)).toEqual([
      "postal-code",
      "address-level1",
      "address-level2",
      "address-line1",
      "address-line2",
      "country-name",
    ]);
  });

  it.each(["CN", "KR", "TW"])("uses the postal-code-first order for %s", (region) => {
    const { container } = render(<AddressFields region={region} />);
    expect(fieldOrder(container)[0]).toBe("postal-code");
  });

  it("puts the postal code before the city in Germany, and asks for no region", () => {
    const { container } = render(<AddressFields region="DE" />);

    const order = fieldOrder(container);
    expect(order).not.toContain("address-level1");
    expect(order.indexOf("postal-code")).toBeLessThan(order.indexOf("address-level2"));
  });

  it.each(["NG", "KE", "GH", "AE", "HK"])(
    "does not ask %s for a postal code it does not use",
    (region) => {
      const { container } = render(<AddressFields region={region} />);
      expect(fieldOrder(container)).not.toContain("postal-code");
    },
  );

  it("puts the postal code last for the UK and asks for no region", () => {
    const { container } = render(<AddressFields region="GB" />);

    const order = fieldOrder(container);
    expect(order).not.toContain("address-level1");
    expect(order.at(-2)).toBe("postal-code");
  });

  it("leaves Ireland's optional postal code optional", () => {
    render(<AddressFields region="IE" />);

    const postal = screen.getByLabelText(/Postal code/);
    expect(postal.getAttribute("aria-required")).toBeNull();
  });

  it("falls back to a sane order for a country with no entry", () => {
    const { container } = render(<AddressFields region="ZZ" />);
    expect(fieldOrder(container)[0]).toBe("address-line1");
  });

  it("takes the country from the locale when none is given", () => {
    const { container } = render(
      <LocaleProvider locale="ja-JP">
        <AddressFields />
      </LocaleProvider>,
    );

    expect(fieldOrder(container)[0]).toBe("postal-code");
  });
});

describe("NameFields", () => {
  it.each(["en-US", "es-ES", "fr-FR", "hi-IN", "ar-EG", "ru-RU"])(
    "puts the given name first in %s",
    (locale) => {
      const { container } = render(
        <LocaleProvider locale={locale}>
          <NameFields />
        </LocaleProvider>,
      );

      expect(fieldOrder(container)).toEqual(["given-name", "family-name"]);
    },
  );

  it.each(["ja-JP", "ko-KR", "zh-CN", "hu-HU", "vi-VN", "ta-IN"])(
    "puts the family name first in %s",
    (locale) => {
      const { container } = render(
        <LocaleProvider locale={locale}>
          <NameFields />
        </LocaleProvider>,
      );

      expect(fieldOrder(container)).toEqual(["family-name", "given-name"]);
    },
  );

  it("keeps autocomplete semantic rather than positional", () => {
    // The visual order flips, but `given-name` must still mean the given name —
    // password managers and browsers rely on the token, not the position.
    const { container } = render(
      <LocaleProvider locale="ja-JP">
        <NameFields />
      </LocaleProvider>,
    );

    const inputs = [...container.querySelectorAll("input")];
    expect(inputs[0].getAttribute("name")).toBe("familyName");
    expect(inputs[0].getAttribute("autocomplete")).toBe("family-name");
  });
});

describe("ErrorSummary", () => {
  // Regression: the default heading was a template string with `{count}` in
  // it, which produced "There are 1 problems with this form" — the exact
  // hardcoded-plural failure this library exists to stop shipping.
  it("uses the singular for one error", () => {
    render(<ErrorSummary errors={[{ field: "email", message: "Enter a valid email address" }]} />);

    expect(screen.getByRole("heading").textContent).toBe("There is 1 problem with this form");
  });

  it("uses the plural for several", () => {
    render(
      <ErrorSummary
        errors={[
          { field: "email", message: "Enter a valid email address" },
          { field: "name", message: "Enter your name" },
        ]}
      />,
    );

    expect(screen.getByRole("heading").textContent).toBe("There are 2 problems with this form");
  });

  it("renders nothing when there are no errors", () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("lets a caller supply a heading in their own language", () => {
    render(
      <ErrorSummary
        errors={[{ field: "email", message: "..." }]}
        title={(count) => `${count} त्रुटि`}
      />,
    );

    expect(screen.getByRole("heading").textContent).toBe("1 त्रुटि");
  });
});
