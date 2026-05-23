import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <div>{element}</div>
}), { virtual: true });

jest.mock("./pages/Home", () => () => <div>Home page</div>);
jest.mock("./pages/ProductDetail", () => () => <div>Product detail page</div>);
jest.mock("./pages/Login", () => () => <div>Login page</div>);
jest.mock("./pages/Orders", () => () => <div>Orders page</div>);
jest.mock("./pages/Checkout", () => () => <div>Checkout page</div>);
jest.mock("./pages/Cart", () => () => <div>Cart page</div>);
jest.mock("./pages/OrderDetail", () => () => <div>Order detail page</div>);
jest.mock("./pages/AdminLogin", () => () => <div>Admin login page</div>);
jest.mock("./pages/AdminDashboard", () => () => <div>Admin dashboard page</div>);

test("renders the application routes", () => {
  render(<App />);

  expect(screen.getByText("Home page")).toBeInTheDocument();
  expect(screen.getByText("Checkout page")).toBeInTheDocument();
  expect(screen.getByText("Cart page")).toBeInTheDocument();
  expect(screen.getByText("Admin dashboard page")).toBeInTheDocument();
});
