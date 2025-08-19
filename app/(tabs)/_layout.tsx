import AirFloatingButton from "@/conponents/CustomTabBar/AirFloatingButton";
import CreateFloatingButton from "@/conponents/CustomTabBar/CreateFloatingButton";
import CustomTabButton from "@/conponents/CustomTabBar/CustomTabButton";
import { CustomTabList } from "@/conponents/CustomTabBar/CustomTabList";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";

export default function TabLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <CustomTabButton routeName="home" />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <CustomTabButton routeName="explore" />
          </TabTrigger>
          <TabTrigger name="air" href="/air" reset="always" asChild>
            <AirFloatingButton />
          </TabTrigger>
          <TabTrigger name="community" href="/community" asChild>
            <CustomTabButton routeName="community" />
          </TabTrigger>
          <TabTrigger name="user" href="/user" asChild>
            <CustomTabButton routeName="user" />
          </TabTrigger>
          <TabTrigger name="schedule" href="/schedule" asChild>
            <CreateFloatingButton />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}
