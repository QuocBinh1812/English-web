import {
  AudioLines,
  BookOpen,
  Briefcase,
  Coffee,
  Cpu,
  FlaskConical,
  HeartPulse,
  Landmark,
  Leaf,
  ListMusic,
  Newspaper,
  Plane,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** Topic.icon is stored as a plain string so it can live in the database. */
const ICONS: Record<string, LucideIcon> = {
  coffee: Coffee,
  plane: Plane,
  briefcase: Briefcase,
  cpu: Cpu,
  flask: FlaskConical,
  heart: HeartPulse,
  landmark: Landmark,
  newspaper: Newspaper,
  book: BookOpen,
  music: ListMusic,
  utensils: UtensilsCrossed,
  leaf: Leaf,
  audio: AudioLines,
};

export function TopicIcon({ name, ...props }: { name: string | undefined } & LucideProps) {
  const Icon = (name && ICONS[name]) || Sparkles;
  return <Icon {...props} />;
}
