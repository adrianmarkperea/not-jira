import { test, expect } from "@playwright/test";

test("shows the heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "To get started, edit the page.tsx file.",
    }),
  ).toBeVisible();
});

test("shows sign in and sign up links when logged out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
});

test("deploy now link points to Vercel", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Deploy Now" });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", /vercel\.com/);
});

test("should navigate to the login page", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Sign in");
  await expect(page).toHaveURL("auth/login");
  await expect(page.locator("h2")).toContainText("Login");
});
