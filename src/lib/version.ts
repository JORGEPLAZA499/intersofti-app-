import { version } from "../../package.json";

export function packageVersion(): string {
  return version || "0.0.0";
}
