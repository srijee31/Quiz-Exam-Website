import { describe, expect, it } from "vitest";
import { getAdminCredentials } from "./vaoAuth";

describe("VAO admin credentials", () => {
  it("loads the configured admin ID and password from server environment", () => {
    const credentials = getAdminCredentials();
    expect(credentials.id).toBe("admin_srijee");
    expect(credentials.password).toBe("sri.zxcvbnm.123");
  });
});
