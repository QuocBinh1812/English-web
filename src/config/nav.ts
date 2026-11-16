import {
  BookA,
  BookOpen,
  ClipboardCheck,
  Gamepad2,
  GraduationCap,
  Headphones,
  Layers,
  LayoutDashboard,
  Library,
  Mic,
  Radio,
  Settings,
  Trophy,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Short description, used by the "coming soon" page and tooltips. */
  description: string;
  /** false = route exists but module is not built yet */
  ready: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Học",
    items: [
      { title: "Tổng quan", href: "/dashboard", icon: LayoutDashboard, description: "Tiến độ, mục tiêu và chuỗi ngày học.", ready: true },
      { title: "Thư viện bài học", href: "/topics", icon: Library, description: "Tìm bài theo trình độ, chủ đề và phương pháp.", ready: true },
      { title: "Nghe chép", href: "/dictation", icon: Headphones, description: "Nghe từng câu và gõ lại, chấm lỗi từng từ.", ready: false },
      { title: "Shadowing", href: "/shadowing", icon: Mic, description: "Nói nhại theo người bản xứ và nhận điểm phát âm.", ready: false },
    ],
  },
  {
    label: "Từ vựng",
    items: [
      { title: "Từ vựng", href: "/vocabulary", icon: BookA, description: "Từ theo chủ đề, phiên âm IPA, ví dụ và nghĩa tiếng Việt.", ready: false },
      { title: "Ôn tập", href: "/review", icon: Layers, description: "Flashcard với lịch ôn ngắt quãng (SRS).", ready: false },
    ],
  },
  {
    label: "Khám phá",
    items: [
      { title: "Podcast", href: "/podcast", icon: Radio, description: "Nghe podcast theo trình độ.", ready: false },
      { title: "Truyện", href: "/stories", icon: BookOpen, description: "Truyện có giọng đọc và highlight theo câu.", ready: false },
      { title: "Trò chơi", href: "/games", icon: Gamepad2, description: "Ôn từ vựng qua trò chơi ngắn.", ready: false },
    ],
  },
  {
    label: "Luyện thi",
    items: [
      { title: "IELTS", href: "/exams/ielts", icon: GraduationCap, description: "Đề luyện IELTS có bấm giờ và chấm tự động.", ready: false },
      { title: "TOEIC", href: "/exams/toeic", icon: ClipboardCheck, description: "Đề luyện TOEIC 7 phần, kết quả chi tiết.", ready: false },
    ],
  },
  {
    label: "Cộng đồng",
    items: [
      { title: "Cộng đồng", href: "/community", icon: Users, description: "Thảo luận, phòng luyện nói và ghép cặp.", ready: false },
      { title: "Bảng xếp hạng", href: "/leaderboard", icon: Trophy, description: "Xếp hạng theo thời gian học trong tuần.", ready: false },
    ],
  },
];

export const ACCOUNT_NAV: NavItem[] = [
  { title: "Hồ sơ", href: "/profile", icon: UserRound, description: "Thống kê, lịch sử học và thành tích.", ready: false },
  { title: "Cài đặt", href: "/settings", icon: Settings, description: "Mục tiêu hằng ngày, giao diện và tài khoản.", ready: false },
];

/** Bottom bar on mobile: the five most used destinations. */
export const MOBILE_NAV_HREFS = ["/dashboard", "/topics", "/dictation", "/shadowing", "/review"];

export const ALL_NAV_ITEMS: NavItem[] = [...NAV_GROUPS.flatMap((g) => g.items), ...ACCOUNT_NAV];

export function findNavItem(href: string): NavItem | undefined {
  return ALL_NAV_ITEMS.find((i) => i.href === href);
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
