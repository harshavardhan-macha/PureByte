import { describe, it, expect } from "vitest";
import { getEffectiveSeverity } from "./severity";

describe("getEffectiveSeverity", () => {
  it("returns severity_level when present and non-empty (case-insensitive)", () => {
    const ingredient = { severity_level: "High" };
    expect(getEffectiveSeverity(ingredient)).toBe("high");
  });

  it("falls back to nova_group when severity_level is missing (nova_group=4 -> severe)", () => {
    const ingredient = { nova_group: 4 };
    expect(getEffectiveSeverity(ingredient)).toBe("severe");
  });

  it("returns unknown when neither severity_level nor valid nova_group present", () => {
    expect(getEffectiveSeverity({})).toBe("unknown");
    expect(getEffectiveSeverity({ nova_group: 9 })).toBe("unknown");
    expect(getEffectiveSeverity({ nova_group: null })).toBe("unknown");
  });
});
import { describe, it, expect } from 'vitest'
import { getEffectiveSeverity } from './severity'

describe('getEffectiveSeverity', () => {
  it('returns existing severity_level when present (case-insensitive)', () => {
    const ing = { severity_level: 'High' }
    expect(getEffectiveSeverity(ing)).toBe('high')
  })

  it('falls back to nova_group for missing severity_level (numeric)', () => {
    const ing = { nova_group: 4 }
    expect(getEffectiveSeverity(ing)).toBe('severe')
  })

  it('falls back to nova_group for numeric-string values', () => {
    const ing = { nova_group: '2' }
    expect(getEffectiveSeverity(ing)).toBe('medium')
  })

  it('returns unknown when neither severity nor valid nova_group present', () => {
    expect(getEffectiveSeverity({})).toBe('unknown')
    expect(getEffectiveSeverity({ nova_group: null })).toBe('unknown')
    expect(getEffectiveSeverity({ nova_group: 99 })).toBe('unknown')
  })
})
