// Inline stroked SVG icons, transcribed path-for-path from design_handoff_warbler/Warbler v4.dc.html
// (the README specifies the stroke style — 1.6–1.8px, round caps/joins — but not path data;
// these paths are copied directly from the prototype markup, not redrawn).
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type TabIconProps = { size?: number; color: string };

export function NowIcon({ size = 26, color }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11.5c0 4.1-3.6 7.4-8 7.4-.9 0-1.8-.1-2.6-.4L5 20l1.2-3.2A7 7 0 0 1 4 11.5C4 7.4 7.6 4.1 12 4.1s8 3.3 8 7.4Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PlanIcon({ size = 26, color }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={5.5} width={16} height={14.5} rx={3} stroke={color} strokeWidth={1.8} />
      <Path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function NearbyIcon({ size = 26, color }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.2} stroke={color} strokeWidth={1.8} />
      <Path
        d="M15.2 8.8 13.6 13.6 8.8 15.2l1.6-4.8 4.8-1.6Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function MoneyIcon({ size = 26, color }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8} stroke={color} strokeWidth={1.8} />
      <Path
        d="M12 7.5v9M14.4 9.8c-.5-.8-1.4-1.2-2.4-1.2-1.3 0-2.3.7-2.3 1.8 0 2.5 4.8 1.3 4.8 3.8 0 1.1-1 1.9-2.4 1.9-1.1 0-2-.5-2.5-1.3"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SupportIcon({ size = 26, color }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5 19 6.3v5.6c0 4.3-3 7.6-7 8.9-4-1.3-7-4.6-7-8.9V6.3L12 3.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronBackIcon({ color = '#2A7BA4' }: { color?: string }) {
  return (
    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none">
      <Path d="M10 2 2 10l8 8" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function DisclosureIcon({ color = 'rgba(22,50,63,.3)' }: { color?: string }) {
  return (
    <Svg width={8} height={13} viewBox="0 0 8 13" fill="none">
      <Path d="M1.5 1.5 6.5 6.5l-5 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CheckmarkIcon({ color, size = 17 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={(size * 13) / 17} viewBox="0 0 17 13" fill="none">
      <Path d="M1.5 6.6 6 11.4 15.5 1.5" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function LocationPinIcon({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={(size * 18) / 15} viewBox="0 0 15 18" fill="none">
      <Path
        d="M7.5 1C4.5 1 2 3.4 2 6.4 2 10.5 7.5 17 7.5 17S13 10.5 13 6.4C13 3.4 10.5 1 7.5 1Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Circle cx={7.5} cy={6.3} r={1.9} fill={color} />
    </Svg>
  );
}

export function ShieldIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={(size * 18) / 16} viewBox="0 0 16 18" fill="none">
      <Path
        d="M8 1 14.5 3.6v5.2c0 4-2.8 7-6.5 8.2C4.3 15.8 1.5 12.8 1.5 8.8V3.6L8 1Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DownloadCloudIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 13.4V3.6M10 13.4 6.4 9.8M10 13.4l3.6-3.6M3.4 14.8v1.2a1.4 1.4 0 0 0 1.4 1.4h10.4a1.4 1.4 0 0 0 1.4-1.4v-1.2"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ReplayIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx={10} cy={10} r={7.2} stroke={color} strokeWidth={1.6} />
      <Circle cx={10} cy={10} r={2.4} fill={color} />
    </Svg>
  );
}

export function MessageBubbleIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={(size * 18) / 20} viewBox="0 0 20 18" fill="none">
      <Path
        d="M2 4.2A2.2 2.2 0 0 1 4.2 2h11.6A2.2 2.2 0 0 1 18 4.2v7.6a2.2 2.2 0 0 1-2.2 2.2H7l-4 3.2v-3.2H4.2A2.2 2.2 0 0 1 2 11.8V4.2Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WarningTriangleIcon({ color = '#D92B1F', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2.8 18.2 17H1.8L10 2.8ZM10 8v3.4M10 14.2h.01"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PlusIcon({ color, size = 17 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path d="M9 2.5v13M2.5 9h13" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

type CategoryIconProps = { color: string; size?: number };

export function ShieldOutlineIcon({ color, size = 18 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M10 2.5 17 5.3v5.2c0 4-3 7.1-7 8.2-4-1.1-7-4.2-7-8.2V5.3L10 2.5Z" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShieldWarningIcon({ color, size = 18 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2.5 17 5.3v5.2c0 4-3 7.1-7 8.2-4-1.1-7-4.2-7-8.2V5.3L10 2.5ZM10 7v3.6M10 13.4h.01"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SuitcaseIcon({ color, size = 18 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M6 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM4 10h12M7 15l-2 2M13 15l2 2"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SuitcaseHandleIcon({ color, size = 18 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M6 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM4 10h12M7 15l-2 2M13 15l2 2M7 7h6"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WalletIcon({ color, size = 18 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M3 6h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM10 8.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WifiIcon({ color, size = 18 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 15.5h.01M3 7.4a10 10 0 0 1 14 0M5.6 10.3a6.3 6.3 0 0 1 8.8 0"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HelpCircleIcon({ color, size = 18 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M10 13.8v-2.2a3.2 3.2 0 1 0-3.2-3.2M10 17h.01" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SendArrowIcon({ color = '#fff', size = 15 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
      <Path d="M7.5 13V2M7.5 2 3 6.6M7.5 2l4.5 4.6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MicIcon({ color = '#2A7BA4', size = 17 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={(size * 21) / 17} viewBox="0 0 17 21" fill="none">
      <Rect x={5.5} y={1} width={6} height={11} rx={3} fill={color} />
      <Path d="M2 9.5a6.5 6.5 0 0 0 13 0M8.5 16v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function RefreshIcon({ color, size = 16 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path d="M15.5 9a6.5 6.5 0 1 1-2.1-4.8M15.5 2.2V6h-3.8" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BellIcon({ color, size = 16 }: CategoryIconProps) {
  return (
    <Svg width={size} height={(size * 18) / 16} viewBox="0 0 16 18" fill="none">
      <Path
        d="M8 1.5a5 5 0 0 0-5 5v3.2L1.6 13h12.8L13 9.7V6.5a5 5 0 0 0-5-5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path d="M6.2 15.4a2 2 0 0 0 3.6 0" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function XIcon({ color, size = 11 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path d="M2 2l8 8M10 2l-8 8" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckAgreeIcon({ color = '#2F7D57', size = 11 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={(size * 9) / 17} viewBox="0 0 17 13" fill="none">
      <Path d="M1.5 6.6 6 11.4 15.5 1.5" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
