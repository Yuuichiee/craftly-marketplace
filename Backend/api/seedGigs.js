import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Gig from "./models/gig.model.js";

const sampleGigs = [
  {
    userId: "650000000000000000000001",
    title: "I will create stunning AI art characters from your prompts",
    desc: "Transform your imagination into high-resolution digital character artwork using state-of-the-art AI technology. Perfect for avatars, concept art, game assets, and book covers.",
    totalStars: 25,
    starNumber: 5,
    cat: "ai-artists",
    price: 15,
    cover: "https://images.pexels.com/photos/7532110/pexels-photo-7532110.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: ["https://images.pexels.com/photos/7532110/pexels-photo-7532110.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    shortTitle: "Basic AI Character Concept",
    shortDesc: "1 High Resolution AI generated portrait + Commercial License",
    deliveryTime: 1,
    revisionNumber: 2,
    features: ["High Resolution", "Commercial Use", "Prompt Included", "Up-scaling"],
    sales: 18,
  },
  {
    userId: "650000000000000000000002",
    title: "I will design a minimalist modern logo for your brand",
    desc: "Get a unique, memorable, and minimalist logo designed specifically for modern businesses and tech startups. Clean typography and iconic geometry.",
    totalStars: 48,
    starNumber: 10,
    cat: "logo-design",
    price: 20,
    cover: "https://images.pexels.com/photos/11295165/pexels-photo-11295165.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: ["https://images.pexels.com/photos/11295165/pexels-photo-11295165.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    shortTitle: "Starter Logo Branding",
    shortDesc: "2 Logo concepts + Vector SVG files + Transparent PNG",
    deliveryTime: 2,
    revisionNumber: 3,
    features: ["Vector File", "Transparent PNG", "Print Ready", "Source File"],
    sales: 42,
  },
  {
    userId: "650000000000000000000003",
    title: "I will build a custom responsive WordPress website",
    desc: "Professional WordPress development tailored for your business. Fast loading speeds, mobile-friendly design, SEO optimized, and easy-to-manage admin panel.",
    totalStars: 60,
    starNumber: 12,
    cat: "wordpress",
    price: 75,
    cover: "https://images.pexels.com/photos/4371669/pexels-photo-4371669.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: ["https://images.pexels.com/photos/4371669/pexels-photo-4371669.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    shortTitle: "Standard WordPress Landing Page",
    shortDesc: "5 Page Responsive WordPress Site + Contact Form + SEO Plugin Setup",
    deliveryTime: 3,
    revisionNumber: 5,
    features: ["5 Pages", "Mobile Friendly", "SEO Plugin", "Speed Optimized"],
    sales: 29,
  },
  {
    userId: "650000000000000000000004",
    title: "I will record an engaging studio quality voice over",
    desc: "Professional male/female voice over in American/British accent for commercials, YouTube videos, e-learning courses, podcasts, and audiobooks.",
    totalStars: 35,
    starNumber: 7,
    cat: "voice-over",
    price: 18,
    cover: "https://images.pexels.com/photos/7608079/pexels-photo-7608079.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: ["https://images.pexels.com/photos/7608079/pexels-photo-7608079.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    shortTitle: "150 Words Studio Audio",
    shortDesc: "High quality WAV audio file up to 150 words + Background Noise Removal",
    deliveryTime: 1,
    revisionNumber: 2,
    features: ["HQ WAV File", "Commercial Rights", "Fast Delivery", "Noise Free"],
    sales: 31,
  },
  {
    userId: "650000000000000000000005",
    title: "I will create 2D animated 4K video explainer for your product",
    desc: "Engaging animated explainer videos that convert viewers into paying customers. Includes script writing, voice over sync, background music, and sound effects.",
    totalStars: 40,
    starNumber: 8,
    cat: "video-explainer",
    price: 85,
    cover: "https://images.pexels.com/photos/13388047/pexels-photo-13388047.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: ["https://images.pexels.com/photos/13388047/pexels-photo-13388047.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    shortTitle: "30 Seconds 2D Animation",
    shortDesc: "30 seconds HD video + Scriptwriting + Voiceover + Royalty Free Music",
    deliveryTime: 4,
    revisionNumber: 3,
    features: ["1080p HD", "Voiceover Sync", "Royalty Music", "Subtitles Included"],
    sales: 19,
  },
  {
    userId: "650000000000000000000006",
    title: "I will manage your social media accounts and increase growth",
    desc: "Strategic social media management for Instagram, TikTok, LinkedIn, and Facebook. Custom posts, engaging captions, targeted hashtags, and monthly analytics reports.",
    totalStars: 20,
    starNumber: 4,
    cat: "social-media",
    price: 50,
    cover: "https://images.pexels.com/photos/11378899/pexels-photo-11378899.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: ["https://images.pexels.com/photos/11378899/pexels-photo-11378899.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    shortTitle: "1 Week Social Management",
    shortDesc: "7 Days management + 7 custom graphics/posts + Hashtag Strategy",
    deliveryTime: 7,
    revisionNumber: 2,
    features: ["7 Branded Posts", "Hashtag Research", "Content Schedule", "Growth Strategy"],
    sales: 24,
  },
  {
    userId: "650000000000000000000007",
    title: "I will perform technical SEO audit and rank your website on Google",
    desc: "Complete technical SEO optimization, keyword research, meta tag optimization, speed boost, backlink strategy, and competitor analysis to get #1 Google rankings.",
    totalStars: 55,
    starNumber: 11,
    cat: "seo",
    price: 45,
    cover: "https://images.pexels.com/photos/4820241/pexels-photo-4820241.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: ["https://images.pexels.com/photos/4820241/pexels-photo-4820241.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    shortTitle: "Full Site Technical Audit",
    shortDesc: "Complete SEO Audit Report + On-page Fixes + 20 High DA Backlinks",
    deliveryTime: 3,
    revisionNumber: 2,
    features: ["SEO Audit Report", "On-Page Fixes", "High DA Backlinks", "Keyword Report"],
    sales: 57,
  },
  {
    userId: "650000000000000000000008",
    title: "I will draw custom digital vector illustrations and book art",
    desc: "Beautiful hand-drawn digital vector illustrations for children's books, website banners, merchandise, and editorial art. Unique colorful art style.",
    totalStars: 30,
    starNumber: 6,
    cat: "illustration",
    price: 22,
    cover: "https://images.pexels.com/photos/15032623/pexels-photo-15032623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: ["https://images.pexels.com/photos/15032623/pexels-photo-15032623.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    shortTitle: "1 Character Vector Illustration",
    shortDesc: "Full color vector illustration with simple background + AI/PSD source files",
    deliveryTime: 2,
    revisionNumber: 3,
    features: ["High Resolution", "Full Color", "Source Files", "Commercial Rights"],
    sales: 38,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO || "mongodb+srv://shivam1523be24_db_user:FiverrMongo2026X7K9@cluster0.j60sgzn.mongodb.net/fiverr?retryWrites=true&w=majority");
    console.log("Connected to MongoDB for seeding...");

    await Gig.deleteMany({});
    console.log("Cleared existing gigs.");

    await Gig.insertMany(sampleGigs);
    console.log("Successfully seeded database with initial services!");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
