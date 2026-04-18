import { FileText, Mic, Video, Code2, Brain, FolderKanban, TrendingUp } from "lucide-react";

export const SERVICES = [
  {
    id: "resume-masterclass",
    title: "Resume Masterclass",
    description: "Get your resume reviewed and optimized by industry experts to stand out to recruiters",
    tags: ["Resume review", "ATS optimization", "Industry-specific tips", "Action items"],
    duration: 45,
    price: 79,
    icon: FileText,
  },
  {
    id: "audio-mock-interview",
    title: "Audio Mock Interview",
    description: "Practice behavioral interviews with real-time feedback and improvement suggestions",
    tags: ["Audio interview", "Real-time feedback", "STAR method coaching", "Follow-up notes"],
    duration: 60,
    price: 99,
    icon: Mic,
  },
  {
    id: "video-mock-interview",
    title: "Video Mock Interview",
    description: "Full video interview simulation with body language and communication feedback",
    tags: ["Video interview", "Body language tips", "Communication coaching", "Recording access"],
    duration: 60,
    price: 129,
    icon: Video,
  },
  {
    id: "technical-interview",
    title: "Technical Interview Guidance",
    description: "Master technical interviews with coding challenges and system design practice",
    tags: ["Coding practice", "System design", "Problem-solving", "Best practices"],
    duration: 90,
    price: 149,
    icon: Code2,
  },
  {
    id: "vince-mindset",
    title: "The Vince Mindset",
    description: "Develop the mental framework for career success and professional growth",
    tags: ["Mindset coaching", "Goal setting", "Success strategies", "Growth planning"],
    duration: 60,
    price: 119,
    icon: Brain,
  },
  {
    id: "project-playback",
    title: "Project Playback",
    description: "Review your projects and learn to showcase them effectively to employers",
    tags: ["Project review", "Storytelling tips", "Portfolio optimization", "Impact metrics"],
    duration: 60,
    price: 99,
    icon: FolderKanban,
  },
  {
    id: "career-mentorship",
    title: "Career Mentorship",
    description: "Long-term mentorship for strategic career planning and professional development",
    tags: ["Career strategy", "Industry insights", "Network building", "Ongoing support"],
    duration: 60,
    price: 139,
    icon: TrendingUp,
  },
];

export const STEPS = [{ label: "Select Service" }, { label: "Select Slot & Mentor" }, { label: "Order Summary" }];

export const PLATFORM_FEE_PER_MIN = 0.5;
export const TAX_RATE = 0.08;
