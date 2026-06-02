import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-brand-navy">SiteStack</Text>
        <Text className="mt-2 text-gray-500">Civil Construction ERP</Text>
      </View>
    </SafeAreaView>
  );
}
