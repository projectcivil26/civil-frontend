import { Redirect } from "expo-router";

// Redirect root to the auth flow — auth middleware will decide where to go
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
