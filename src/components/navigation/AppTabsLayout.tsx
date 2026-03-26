import { AppTabButton } from "@/components/navigation/AppTabButton";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabItem = {
  name: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  hidden?: boolean;
};

type Props = {
  tabs: TabItem[];
  activeColor?: string;
  inactiveColor?: string;
  activeBackgroundColor?: string;
};

export function AppTabsLayout({
  tabs,
  activeColor = Colors.accent,
  inactiveColor = Colors.textSecondary,
  activeBackgroundColor = "rgba(20, 184, 166, 0.18)",
}: Props) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isTabFocused = (tabName: string) => {
    const normalized = pathname.replace(/\/$/, "");

    return normalized === `/${tabName}` || normalized.endsWith(`/${tabName}`);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 78 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        tabBarItemStyle: {
          height: 58,
        },
      }}
    >
      {tabs.map((tab) => {
        if (tab.hidden) {
          return (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.label,
                href: null,
              }}
            />
          );
        }

        const focused = isTabFocused(tab.name);

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.label,
              tabBarButton: (props) => (
                <AppTabButton
                  {...props}
                  focused={focused}
                  label={tab.label}
                  iconName={tab.iconName}
                  activeColor={activeColor}
                  inactiveColor={inactiveColor}
                  activeBackgroundColor={activeBackgroundColor}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
