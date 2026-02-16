export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string;
    opinionCount: number;
};

export type Opinion = {
    id: string;
    content: string;
    isAnonymous: boolean;
    authorName?: string;
    voteScore: number;
    // using string for simplicity in mock data
    timestamp: string;
    categoryId: string;
    categoryName?: string;
};

export const categories: Category[] = [
    {
        id: "1",
        name: "Workplace Culture",
        slug: "workplace-culture",
        description: "Share experiences about work environments, management, and company culture",
        opinionCount: 47
    },
    {
        id: "2",
        name: "Academic Institutions",
        slug: "academic-institutions",
        description: "Discuss university policies, teaching quality, and educational experiences",
        opinionCount: 32
    },
    {
        id: "3",
        name: "Healthcare Experiences",
        slug: "healthcare-experiences",
        description: "Patient stories, medical professional insights, and healthcare system discussions",
        opinionCount: 56
    },
    {
        id: "4",
        name: "Technology Industry",
        slug: "technology-industry",
        description: "Trends, innovations, ethical concerns, and the future of tech",
        opinionCount: 89
    },
    {
        id: "5",
        name: "Government Policy",
        slug: "government-policy",
        description: "Opinions on local and national policies, laws, and governance",
        opinionCount: 120
    },
    {
        id: "6",
        name: "Consumer Products",
        slug: "consumer-products",
        description: "Reviews, complaints, and praise for products and services",
        opinionCount: 15
    },
    {
        id: "7",
        name: "Entertainment & Media",
        slug: "entertainment-media",
        description: "Movies, TV, music, and the state of modern entertainment",
        opinionCount: 42
    },
    {
        id: "8",
        name: "Social Dynamics",
        slug: "social-dynamics",
        description: "Observations on changing social norms and human interaction",
        opinionCount: 67
    }
];

export const opinions: Opinion[] = [
    {
        id: "1",
        content: "The new return-to-office policy was announced without any employee consultation. Morale has dropped significantly and many talented people are looking elsewhere.",
        isAnonymous: true,
        authorName: "John Doe",
        voteScore: 24,
        timestamp: "2 hours ago",
        categoryId: "1",
        categoryName: "Workplace Culture"
    },
    {
        id: "2",
        content: "Our team lead actively encourages work-life balance and blocks off time for deep work. It's refreshing to see leadership that actually cares.",
        isAnonymous: false,
        authorName: "Sarah Chen",
        voteScore: 18,
        timestamp: "5 hours ago",
        categoryId: "1",
        categoryName: "Workplace Culture"
    },
    {
        id: "3",
        content: "University tuition fees have outpaced inflation by a wide margin, but the quality of education hasn't improved proportionally. It feels like a business, not a place of learning.",
        isAnonymous: true,
        voteScore: 156,
        timestamp: "1 day ago",
        categoryId: "2",
        categoryName: "Academic Institutions"
    },
    {
        id: "4",
        content: "The waiting times for specialist appointments are unacceptable. We need a better triage system.",
        isAnonymous: false,
        authorName: "Dr. Emily R.",
        voteScore: 45,
        timestamp: "3 days ago",
        categoryId: "3",
        categoryName: "Healthcare Experiences"
    },
    {
        id: "5",
        content: "AI code generation is helpful, but it's making junior developers lazy about understanding the underlying logic. We're going to have a skills gap in 5 years.",
        isAnonymous: true,
        voteScore: 89,
        timestamp: "4 hours ago",
        categoryId: "4",
        categoryName: "Technology Industry"
    },
    {
        id: "6",
        content: "City planning needs to prioritize pedestrians over cars. The current infrastructure is hostile to anyone not driving.",
        isAnonymous: false,
        authorName: "Urbanist_99",
        voteScore: 112,
        timestamp: "6 hours ago",
        categoryId: "5",
        categoryName: "Government Policy"
    },
    {
        id: "7",
        content: "Streaming services are becoming just as expensive and fragmented as cable TV was. Piracy is going to come back in a big way.",
        isAnonymous: true,
        voteScore: 230,
        timestamp: "12 hours ago",
        categoryId: "7",
        categoryName: "Entertainment & Media"
    },
    {
        id: "8",
        content: "People have forgotten how to have a disagreement without taking it personally. Social media has trained us to see difference of opinion as an attack.",
        isAnonymous: false,
        authorName: "Marcus Aurelius Fan",
        voteScore: 67,
        timestamp: "1 day ago",
        categoryId: "8",
        categoryName: "Social Dynamics"
    },
    {
        id: "9",
        content: "My laptop battery died after 13 months, just one month out of warranty. Planned obsolescence is real and infuriating.",
        isAnonymous: true,
        voteScore: 34,
        timestamp: "2 days ago",
        categoryId: "6",
        categoryName: "Consumer Products"
    },
    {
        id: "10",
        content: "Remote work has actually improved our team's productivity. We have fewer interruptions and more documented communication.",
        isAnonymous: false,
        authorName: "Dev Manager",
        voteScore: 56,
        timestamp: "3 days ago",
        categoryId: "1",
        categoryName: "Workplace Culture"
    }
];

export const stats = {
    totalOpinions: 1245,
    totalUsers: 850,
    pendingReports: 12,
    categoriesCount: 8
};
