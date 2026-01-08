import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  // Home page
  index("routes/home.tsx"),

  // Demos section with layout
  layout("routes/demos/layout.tsx", [
    ...prefix("demos", [
      index("routes/demos/index.tsx"),
      route("loader", "routes/demos/loader.tsx"),
      route("action", "routes/demos/action.tsx"),
      route("client", "routes/demos/client.tsx"),
      route("error", "routes/demos/error.tsx"),

      // RSC demos
      route("rsc-actions", "routes/demos/rsc-actions.tsx"),
      route("rsc-promises", "routes/demos/rsc-promises.tsx"),

      // Nested routes demo
      layout("routes/demos/nested/layout.tsx", [
        ...prefix("nested", [
          index("routes/demos/nested/index.tsx"),
          route(":categoryId", "routes/demos/nested/category.tsx", [
            route(":itemId", "routes/demos/nested/item.tsx"),
          ]),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
