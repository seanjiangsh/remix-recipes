import { PageLayout } from "~/components/layout/layout";

export default function App() {
  const appLinks = [
    { to: "recipes", label: "Recipes" },
    { to: "pantry", label: "Pantry" },
    { to: "grocery-list", label: "Grocery List" },
  ];
  return <PageLayout title="App" links={appLinks} />;
}
