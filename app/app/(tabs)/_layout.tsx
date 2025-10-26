import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs'

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="log">
        <Icon sf="book" drawable="custom_settings_drawable" />
        <Label>Log</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="scanner">
        <Icon sf="camera" drawable="custom_settings_drawable" />
        <Label>Scanner</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chat">
        <Icon sf="message" drawable="custom_settings_drawable" />
        <Label>Chat</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <Icon sf="person" drawable="custom_seettings_drawable" />
        <Label>Account</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
