import { Link } from "react-router";
import type { Route } from "./+types/item";
import { data } from "react-router";

// Sample item details
const itemsData: Record<
  string,
  Record<
    string,
    { name: string; price: number; description: string; inStock: boolean; rating: number }
  >
> = {
  electronics: {
    laptop: {
      name: "MacBook Pro",
      price: 1999,
      description: "Powerful laptop with M3 chip",
      inStock: true,
      rating: 4.8,
    },
    phone: {
      name: "iPhone 15",
      price: 999,
      description: "Latest smartphone with Dynamic Island",
      inStock: true,
      rating: 4.7,
    },
    headphones: {
      name: "AirPods Pro",
      price: 249,
      description: "Wireless earbuds with noise cancellation",
      inStock: false,
      rating: 4.6,
    },
    tablet: {
      name: "iPad Air",
      price: 599,
      description: "Versatile tablet for work and play",
      inStock: true,
      rating: 4.5,
    },
  },
  books: {
    fiction: {
      name: "The Great Gatsby",
      price: 15,
      description: "Classic American novel by F. Scott Fitzgerald",
      inStock: true,
      rating: 4.4,
    },
    programming: {
      name: "Clean Code",
      price: 45,
      description: "A handbook of agile software craftsmanship",
      inStock: true,
      rating: 4.9,
    },
    science: {
      name: "A Brief History of Time",
      price: 18,
      description: "Stephen Hawking's exploration of cosmology",
      inStock: true,
      rating: 4.7,
    },
    biography: {
      name: "Steve Jobs",
      price: 25,
      description: "Walter Isaacson's biography of Apple's co-founder",
      inStock: false,
      rating: 4.6,
    },
  },
  clothing: {
    shirt: {
      name: "Cotton T-Shirt",
      price: 25,
      description: "Comfortable everyday basic",
      inStock: true,
      rating: 4.2,
    },
    jeans: {
      name: "Denim Jeans",
      price: 79,
      description: "Classic fit blue jeans",
      inStock: true,
      rating: 4.3,
    },
    jacket: {
      name: "Leather Jacket",
      price: 199,
      description: "Genuine leather biker jacket",
      inStock: false,
      rating: 4.8,
    },
    shoes: {
      name: "Running Shoes",
      price: 129,
      description: "Lightweight athletic footwear",
      inStock: true,
      rating: 4.5,
    },
  },
  sports: {
    ball: {
      name: "Soccer Ball",
      price: 35,
      description: "Official size and weight",
      inStock: true,
      rating: 4.4,
    },
    racket: {
      name: "Tennis Racket",
      price: 159,
      description: "Professional grade racket",
      inStock: true,
      rating: 4.6,
    },
    weights: {
      name: "Dumbbell Set",
      price: 89,
      description: "Adjustable weight set",
      inStock: true,
      rating: 4.7,
    },
    yoga: {
      name: "Yoga Mat",
      price: 29,
      description: "Non-slip exercise mat",
      inStock: true,
      rating: 4.3,
    },
  },
};

export function meta({ params }: Route.MetaArgs) {
  const categoryItems = itemsData[params.categoryId];
  const item = categoryItems?.[params.itemId];
  return [{ title: `${item?.name || "Item"} | Nested Routes Demo` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const categoryItems = itemsData[params.categoryId];
  const item = categoryItems?.[params.itemId];

  if (!item) {
    throw data("Item not found", { status: 404 });
  }

  return {
    categoryId: params.categoryId,
    itemId: params.itemId,
    ...item,
  };
}

export default function ItemPage({ loaderData }: Route.ComponentProps) {
  const { categoryId, itemId, name, price, description, inStock, rating } = loaderData;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Link to="/demos/nested" className="hover:text-orange-600">
          Nested
        </Link>
        <span>/</span>
        <Link to={`/demos/nested/${categoryId}`} className="hover:text-orange-600 capitalize">
          {categoryId}
        </Link>
        <span>/</span>
        <span className="text-gray-700">{itemId}</span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-2xl font-semibold text-orange-600 mb-3">${price}</p>

      <p className="text-gray-600 text-sm mb-4">{description}</p>

      <div className="flex items-center gap-4 mb-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
        <span className="text-sm text-gray-600">⭐ {rating}/5</span>
      </div>

      <button
        disabled={!inStock}
        className="w-full py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {inStock ? "Add to Cart" : "Notify When Available"}
      </button>

      <div className="mt-4 p-3 bg-white rounded border border-gray-200 text-xs">
        <div className="font-semibold text-gray-700 mb-1">Route Params:</div>
        <code className="text-gray-600">
          {`{ categoryId: "${categoryId}", itemId: "${itemId}" }`}
        </code>
      </div>
    </div>
  );
}
