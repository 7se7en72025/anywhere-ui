import { describe, expect, it } from "vitest";
import {
  applyDraft,
  clearDraft,
  isPersistable,
  loadDraft,
  readForm,
  saveDraft,
} from "@/registry/anywhere/lib/draft-storage";

function buildForm(html: string): HTMLFormElement {
  const form = document.createElement("form");
  form.innerHTML = html;
  document.body.appendChild(form);
  return form;
}

describe("isPersistable", () => {
  it("refuses passwords, files, and hidden inputs", () => {
    const form = buildForm(`
      <input name="password" type="password" />
      <input name="avatar" type="file" />
      <input name="token" type="hidden" />
    `);

    for (const name of ["password", "avatar", "token"]) {
      expect(isPersistable(form.elements.namedItem(name) as Element)).toBe(false);
    }
  });

  it("refuses payment and one-time-code autocomplete hints", () => {
    const form = buildForm(`
      <input name="card" autocomplete="cc-number" />
      <input name="otp" autocomplete="one-time-code" />
    `);

    expect(isPersistable(form.elements.namedItem("card") as Element)).toBe(false);
    expect(isPersistable(form.elements.namedItem("otp") as Element)).toBe(false);
  });

  it("respects an explicit data-no-persist opt-out", () => {
    const form = buildForm(`<input name="secret" data-no-persist />`);
    expect(isPersistable(form.elements.namedItem("secret") as Element)).toBe(false);
  });

  it("accepts ordinary named text fields", () => {
    const form = buildForm(`<input name="email" type="email" />`);
    expect(isPersistable(form.elements.namedItem("email") as Element)).toBe(true);
  });
});

describe("readForm", () => {
  it("collects only persistable values", () => {
    const form = buildForm(`
      <input name="email" value="a@b.com" />
      <textarea name="note">hello</textarea>
      <input name="password" type="password" value="hunter2" />
    `);

    expect(readForm(form)).toEqual({ email: "a@b.com", note: "hello" });
  });
});

describe("applyDraft", () => {
  it("fills empty fields and reports what it restored", () => {
    const form = buildForm(`<input name="email" /><input name="city" />`);

    expect(applyDraft(form, { email: "a@b.com", city: "Pilani" }).sort()).toEqual([
      "city",
      "email",
    ]);
    expect((form.elements.namedItem("email") as HTMLInputElement).value).toBe("a@b.com");
  });

  it("never overwrites what the user has already typed", () => {
    const form = buildForm(`<input name="email" value="live@value.com" />`);

    expect(applyDraft(form, { email: "stale@draft.com" })).toEqual([]);
    expect((form.elements.namedItem("email") as HTMLInputElement).value).toBe("live@value.com");
  });

  it("ignores draft keys for non-persistable fields", () => {
    const form = buildForm(`<input name="password" type="password" />`);

    expect(applyDraft(form, { password: "leaked" })).toEqual([]);
    expect((form.elements.namedItem("password") as HTMLInputElement).value).toBe("");
  });
});

describe("saveDraft / loadDraft", () => {
  it("round-trips a draft", () => {
    saveDraft("checkout", { email: "a@b.com" });
    expect(loadDraft("checkout")).toEqual({ email: "a@b.com" });
  });

  it("removes the entry when the draft becomes empty", () => {
    saveDraft("checkout", { email: "a@b.com" });
    saveDraft("checkout", {});
    expect(loadDraft("checkout")).toBeNull();
  });

  it("returns null for corrupt stored JSON instead of throwing", () => {
    localStorage.setItem("anywhere-ui:draft:broken", "{not json");
    expect(loadDraft("broken")).toBeNull();
  });

  it("drops non-string values from stored data", () => {
    localStorage.setItem(
      "anywhere-ui:draft:mixed",
      JSON.stringify({ email: "a@b.com", count: 3 }),
    );
    expect(loadDraft("mixed")).toEqual({ email: "a@b.com" });
  });

  it("clears on demand", () => {
    saveDraft("checkout", { email: "a@b.com" });
    clearDraft("checkout");
    expect(loadDraft("checkout")).toBeNull();
  });
});
