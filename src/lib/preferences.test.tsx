/* @vitest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { usePreferences, getStoredPreferencesSnapshot } from "./preferences";

const PREFERENCES_KEY = "clawhub-preferences";

function PreferencesProbe() {
  const { preferences, updatePreference, isAdvancedMode } = usePreferences();

  return (
    <div>
      <div data-testid="density">{preferences.layoutDensity}</div>
      <div data-testid="advanced">{String(isAdvancedMode)}</div>
      <button
        type="button"
        onClick={() => updatePreference("advancedMode", !preferences.advancedMode)}
      >
        Toggle advanced
      </button>
    </div>
  );
}

describe("preferences store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns a stable snapshot when storage has not changed", () => {
    const first = getStoredPreferencesSnapshot();
    const second = getStoredPreferencesSnapshot();

    expect(first).toBe(second);
    expect(first.layoutDensity).toBe("comfortable");
  });

  it("re-renders cleanly after a preference update", () => {
    window.localStorage.setItem(
      PREFERENCES_KEY,
      JSON.stringify({
        advancedMode: false,
      }),
    );

    render(<PreferencesProbe />);

    expect(screen.getByTestId("advanced").textContent).toBe("false");

    fireEvent.click(screen.getByRole("button", { name: /toggle advanced/i }));

    expect(screen.getByTestId("advanced").textContent).toBe("true");
    expect(JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) ?? "{}")).toMatchObject({
      advancedMode: true,
    });
  });
});
