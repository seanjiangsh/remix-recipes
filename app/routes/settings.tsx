import { PageLayout } from "~/components/layout/layout";

export default function Settings() {
  const settingsLinks = [{ to: "app", label: "App" }];
  return <PageLayout title="Settings" links={settingsLinks} />;
}
