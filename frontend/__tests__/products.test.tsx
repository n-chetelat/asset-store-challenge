import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import ProductPage from "@/app/products/[id]/page";

const mockProducts = [
  { id: "2429", name: "Sleek Wireless Router" },
  { id: "44470", name: "Lime Suede Iron" },
  { id: "30933", name: "Robot Flux Marble" },
];

const mockProduct = {
  id: "2429",
  name: "Sleek Wireless Router",
  price: 33.99,
};

describe("Home page", () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProducts),
      })
    ) as jest.Mock;
  });
  it("renders products heading", async () => {
    render(await Home());
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Product Listing",
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders a list of products", async () => {
    render(await Home());

    mockProducts.forEach((p) => {
      const product = screen.getByText(p.name);
      expect(product).toBeInTheDocument();
    });
  });
});

describe("Product page", () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProduct),
      })
    ) as jest.Mock;
  });

  it("renders product details", async () => {
    render(await ProductPage({ params: { id: "2429" } }));

    const name = screen.getByText(mockProduct.name);
    const price = screen.getByText(`Price: $${mockProduct.price}`);

    expect(name).toBeInTheDocument();
    expect(price).toBeInTheDocument();
  });
});
