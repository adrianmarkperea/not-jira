import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

afterEach(cleanup);
import Home from "./page";

vi.mock("@/components/auth-button", () => ({
  AuthButton: () => <div data-testid="auth-button" />,
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}));

test("renders the heading", () => {
  render(<Home />);
  expect(
    screen.getByText("To get started, edit the page.tsx file."),
  ).toBeDefined();
});

test("renders the auth button", () => {
  render(<Home />);
  expect(screen.getByTestId("auth-button")).toBeDefined();
});

test("renders the Deploy Now link", () => {
  render(<Home />);
  expect(screen.getByRole("link", { name: /deploy now/i })).toBeDefined();
});

test("renders the Documentation link", () => {
  render(<Home />);
  expect(screen.getByRole("link", { name: /documentation/i })).toBeDefined();
});
