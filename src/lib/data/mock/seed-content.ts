import type {
  Accent,
  CefrLevel,
  Collection,
  Difficulty,
  LearningMethod,
  Lesson,
  MediaType,
  Topic,
  UserProfile,
} from "@/types/domain";

/**
 * Seed content used by the mock repository and mirrored by supabase/seed.sql.
 * Lesson media is not curated yet (mediaId = null): real, licensed videos are
 * attached when the Dictation player is built.
 */

export const TOPICS: Topic[] = [
  { slug: "daily-life", name: "Đời sống", icon: "coffee" },
  { slug: "travel", name: "Du lịch", icon: "plane" },
  { slug: "work", name: "Công việc", icon: "briefcase" },
  { slug: "technology", name: "Công nghệ", icon: "cpu" },
  { slug: "science", name: "Khoa học", icon: "flask" },
  { slug: "health", name: "Sức khỏe", icon: "heart" },
  { slug: "culture", name: "Văn hóa", icon: "landmark" },
  { slug: "news", name: "Tin tức", icon: "newspaper" },
  { slug: "stories", name: "Truyện", icon: "book" },
  { slug: "music", name: "Âm nhạc", icon: "music" },
  { slug: "food", name: "Ẩm thực", icon: "utensils" },
  { slug: "environment", name: "Môi trường", icon: "leaf" },
  { slug: "pronunciation", name: "Phát âm", icon: "audio" },
];

export const COLLECTIONS: Collection[] = [
  { slug: "everyday-english", name: "Tiếng Anh hằng ngày", description: "Hội thoại ngắn cho tình huống quen thuộc." },
  { slug: "travel-talk", name: "Du lịch", description: "Sân bay, khách sạn, hỏi đường, ăn uống." },
  { slug: "workplace", name: "Tiếng Anh công sở", description: "Phỏng vấn, họp, trò chuyện với đồng nghiệp." },
  { slug: "science-explained", name: "Khoa học dễ hiểu", description: "Giải thích hiện tượng bằng tiếng Anh rõ ràng." },
  { slug: "world-news", name: "Tin tức dễ nghe", description: "Chủ đề thời sự với tốc độ vừa phải." },
  { slug: "short-stories", name: "Truyện ngắn", description: "Truyện kể có giọng đọc truyền cảm." },
  { slug: "ielts-listening", name: "Luyện nghe IELTS", description: "Bài nghe mô phỏng format IELTS." },
  { slug: "pronunciation", name: "Phát âm cơ bản", description: "Âm khó, nối âm và ngữ điệu." },
];

type LessonRow = [
  slug: string,
  title: string,
  description: string,
  level: CefrLevel,
  difficulty: Difficulty,
  topics: string[],
  collection: string,
  methods: LearningMethod[],
  media: MediaType,
  durationSec: number,
  segmentCount: number,
  accent: Accent,
  isPro: boolean,
  learnerCount: number,
  publishedDaysAgo: number,
];

const D: LearningMethod[] = ["dictation"];
const S: LearningMethod[] = ["shadowing"];
const DS: LearningMethod[] = ["dictation", "shadowing"];

const ROWS: LessonRow[] = [
  ["ordering-coffee", "Ordering coffee like a local", "Gọi đồ uống, hỏi size và thanh toán ở quán cà phê.", "A1", "easy", ["daily-life", "food"], "everyday-english", DS, "youtube", 142, 14, "us", false, 18420, 120],
  ["introducing-yourself", "Introducing yourself at a party", "Chào hỏi, giới thiệu tên, công việc và sở thích.", "A1", "easy", ["daily-life"], "everyday-english", DS, "youtube", 118, 12, "uk", false, 22110, 200],
  ["asking-for-directions", "Asking for directions in the city", "Hỏi và chỉ đường, các giới từ chỉ vị trí.", "A1", "easy", ["travel", "daily-life"], "travel-talk", DS, "youtube", 156, 15, "us", false, 15030, 180],
  ["th-sounds", "The two “th” sounds", "Phân biệt /θ/ và /ð/ qua cặp từ tối thiểu.", "A1", "easy", ["pronunciation"], "pronunciation", S, "youtube", 128, 12, "us", false, 19870, 300],
  ["at-the-airport", "Checking in at the airport", "Làm thủ tục, gửi hành lý và hỏi cửa ra máy bay.", "A2", "easy", ["travel"], "travel-talk", DS, "youtube", 204, 18, "uk", false, 12880, 90],
  ["hotel-complaint", "Making a polite complaint at a hotel", "Phàn nàn lịch sự và đề nghị cách giải quyết.", "A2", "medium", ["travel"], "travel-talk", DS, "youtube", 187, 16, "us", false, 8340, 60],
  ["weekend-plans", "Talking about weekend plans", "Thì tương lai gần và cách rủ rê, từ chối khéo.", "A2", "easy", ["daily-life"], "everyday-english", DS, "youtube", 133, 13, "au", false, 11200, 45],
  ["grocery-shopping", "Grocery shopping on a budget", "Từ vựng siêu thị, số lượng và giá cả.", "A2", "easy", ["daily-life", "food"], "everyday-english", D, "audio", 171, 15, "us", false, 7420, 30],
  ["fox-and-crow", "The fox and the crow", "Truyện ngụ ngôn kinh điển, câu ngắn và rõ.", "A2", "easy", ["stories"], "short-stories", DS, "audio", 154, 12, "us", false, 12340, 210],
  ["the-lost-key", "The lost key", "Truyện ngắn về một buổi sáng rắc rối.", "A2", "easy", ["stories"], "short-stories", DS, "audio", 198, 15, "au", false, 8760, 140],
  ["intonation-questions", "Rising and falling intonation", "Lên giọng, xuống giọng trong câu hỏi.", "A2", "easy", ["pronunciation"], "pronunciation", S, "youtube", 166, 14, "uk", false, 10240, 160],
  ["song-lyrics-practice", "Learning English with song lyrics", "Nghe chép lời bài hát tự sáng tác, nhịp chậm.", "A2", "easy", ["music"], "everyday-english", D, "youtube", 205, 18, "us", false, 15640, 130],
  ["job-interview-strengths", "Answering “What are your strengths?”", "Trả lời phỏng vấn có cấu trúc và ví dụ cụ thể.", "B1", "medium", ["work"], "workplace", DS, "youtube", 246, 20, "us", true, 9870, 75],
  ["small-talk-office", "Small talk with coworkers", "Mở đầu câu chuyện và giữ hội thoại tự nhiên.", "B1", "easy", ["work", "daily-life"], "workplace", DS, "youtube", 198, 17, "uk", false, 10450, 110],
  ["meeting-follow-up", "Following up after a meeting", "Cuộc gọi tóm tắt việc cần làm sau buổi họp.", "B1", "medium", ["work"], "workplace", D, "audio", 225, 19, "us", false, 5210, 20],
  ["how-sleep-memory", "How sleep shapes your memory", "Giấc ngủ giúp não ghi nhớ thông tin ra sao.", "B1", "medium", ["science", "health"], "science-explained", DS, "youtube", 289, 22, "us", false, 14320, 150],
  ["why-sky-blue", "Why is the sky blue?", "Ánh sáng tán xạ được giải thích bằng câu đơn giản.", "B1", "easy", ["science"], "science-explained", DS, "youtube", 176, 14, "uk", false, 16780, 240],
  ["plastic-bottle-journey", "The journey of a plastic bottle", "Vòng đời chai nhựa từ nhà máy ra đại dương.", "B1", "medium", ["environment", "science"], "science-explained", D, "youtube", 263, 21, "us", false, 6120, 15],
  ["street-food-hanoi", "A food tour through Hanoi’s old quarter", "Mô tả món ăn, hương vị và trải nghiệm phố cổ.", "B1", "easy", ["food", "culture", "travel"], "travel-talk", DS, "youtube", 238, 19, "au", false, 13450, 40],
  ["smartphone-habits", "Breaking your smartphone habit", "Thói quen dùng điện thoại và cách thay đổi.", "B1", "easy", ["technology", "health"], "science-explained", DS, "youtube", 232, 19, "us", false, 9120, 22],
  ["lighthouse-keeper", "The last lighthouse keeper", "Truyện dài hơn, nhiều mệnh đề quan hệ.", "B1", "medium", ["stories"], "short-stories", DS, "audio", 362, 28, "uk", false, 9560, 100],
  ["linking-sounds", "Linking words in fast speech", "Nối âm phụ âm - nguyên âm khi nói nhanh.", "B1", "medium", ["pronunciation"], "pronunciation", DS, "youtube", 192, 16, "us", false, 8930, 85],
  ["city-bikes", "Cities that run on bicycles", "Các thành phố thân thiện với xe đạp.", "B2", "medium", ["environment", "news"], "world-news", D, "youtube", 271, 22, "uk", false, 5480, 25],
  ["remote-work-future", "Is remote work here to stay?", "Tranh luận về làm việc từ xa sau đại dịch.", "B2", "medium", ["work", "news"], "world-news", DS, "youtube", 312, 25, "us", true, 7310, 12],
  ["ai-in-classrooms", "AI tools in the classroom", "Giáo viên và học sinh dùng AI như thế nào.", "B2", "hard", ["technology", "news"], "world-news", D, "youtube", 334, 27, "us", false, 6890, 8],
  ["coral-reefs", "Saving the world’s coral reefs", "Rạn san hô, nguyên nhân suy thoái và giải pháp.", "B2", "medium", ["environment", "science"], "science-explained", DS, "youtube", 298, 23, "uk", false, 4920, 55],
  ["negotiating-salary", "Negotiating a better salary", "Đàm phán lương: mở lời, đưa lý do, chốt thỏa thuận.", "B2", "hard", ["work"], "workplace", DS, "youtube", 276, 22, "us", true, 8030, 65],
  ["music-and-mood", "How music changes your mood", "Âm nhạc tác động đến cảm xúc và sự tập trung.", "B2", "medium", ["music", "health"], "science-explained", DS, "youtube", 274, 21, "us", false, 6740, 50],
  ["ielts-library-membership", "IELTS Listening Part 1: Library membership", "Điền form đăng ký thẻ thư viện, số và tên riêng.", "B2", "medium", ["daily-life"], "ielts-listening", D, "audio", 305, 24, "uk", true, 11020, 35],
  ["ielts-museum-tour", "IELTS Listening Part 2: Museum tour", "Nghe mô tả sơ đồ bảo tàng và lịch tham quan.", "B2", "hard", ["culture"], "ielts-listening", D, "audio", 342, 26, "uk", true, 7640, 28],
  ["ielts-research-project", "IELTS Listening Part 3: Research project", "Hai sinh viên thảo luận đề tài với giảng viên.", "C1", "hard", ["science"], "ielts-listening", D, "audio", 368, 29, "uk", true, 5120, 18],
  ["rooftop-farming", "Farming on city rooftops", "Nông nghiệp đô thị và an ninh lương thực.", "C1", "hard", ["environment", "news"], "world-news", DS, "youtube", 356, 28, "au", false, 3410, 6],
  ["history-of-coffee", "A short history of coffee", "Từ Ethiopia đến quán cà phê hiện đại.", "C1", "medium", ["culture", "food"], "world-news", DS, "youtube", 318, 25, "uk", false, 4210, 10],
  ["why-time-flies", "Why time feels faster as we age", "Tâm lý học về cảm nhận thời gian.", "C2", "hard", ["science", "health"], "science-explained", DS, "youtube", 392, 31, "uk", true, 2870, 4],
];

/** Fixed reference date so seeded "publishedAt" values are stable across restarts. */
const PUBLISH_REFERENCE = Date.UTC(2026, 10, 1);

export const LESSONS: Lesson[] = ROWS.map((r, i) => {
  const [slug, title, description, level, difficulty, topicSlugs, collectionSlug, methods, mediaType, durationSec, segmentCount, accent, isPro, learnerCount, daysAgo] = r;
  return {
    id: `les_${String(i + 1).padStart(3, "0")}`,
    slug,
    title,
    description,
    level,
    difficulty,
    topicSlugs,
    collectionSlug,
    methods,
    mediaType,
    mediaId: null,
    thumbnailUrl: null,
    durationSec,
    segmentCount,
    accent,
    isPro,
    learnerCount,
    publishedAt: new Date(PUBLISH_REFERENCE - daysAgo * 86_400_000).toISOString(),
  };
});

export const MOCK_USER: UserProfile = {
  id: "usr_demo",
  displayName: "Minh Anh",
  email: "demo@example.com",
  avatarUrl: null,
  level: "B1",
  dailyGoalMinutes: 20,
  isPro: false,
};
