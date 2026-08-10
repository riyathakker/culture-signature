import namer from "color-namer";

export function hexToColorName(hex: string): string {
  try {
    const result = namer(hex, { pick: ["ntc"] });
    return result.ntc?.[0]?.name ?? "";
  } catch {
    return "";
  }
}
