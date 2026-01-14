// __tests__/Rows.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Rows from "../components/Rows";

// Mock API
const server = setupServer(
  rest.get("*/movie/*", (req, res, ctx) => {
    return res(
      ctx.json({
        results: [{ id: 1, title: "Test Movie", poster_path: "/test.jpg" }],
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders movie cards", async () => {
  render(<Rows title="Test Row" fetchUrl="/test" />);

  await waitFor(() => {
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });
});

test("shows trailer on hover", async () => {
  render(<Rows title="Test Row" fetchUrl="/test" />);

  await waitFor(() => {
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  const card = screen.getByTestId("row-card");
  fireEvent.mouseEnter(card);

  // Assert trailer loads...
});
