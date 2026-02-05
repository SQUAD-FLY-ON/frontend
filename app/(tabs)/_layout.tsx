import AirFloatingButton from "@/components/CustomTabBar/AirFloatingButton";
import CreateFloatingButton from "@/components/CustomTabBar/CreateFloatingButton";
import CustomTabButton from "@/components/CustomTabBar/CustomTabButton";
import { CustomTabList } from "@/components/CustomTabBar/CustomTabList";
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
          <TabTrigger name="my-schedules" href="/my-schedules" asChild>
            <CustomTabButton routeName="my-schedules" />
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
