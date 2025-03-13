
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, SearchIcon, Tag } from 'lucide-react';

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "10 xu hướng Digital Marketing không thể bỏ qua trong năm 2023",
    excerpt: "Khám phá những xu hướng Digital Marketing đang thay đổi cách doanh nghiệp tiếp cận khách hàng trong năm 2023.",
    category: "Digital Marketing",
    date: "15/06/2023",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1415&q=80",
    author: "Nguyễn Văn Anh",
    tags: ["Digital Marketing", "Xu hướng", "Marketing 2023"]
  },
  {
    id: 2,
    title: "Cách xây dựng chiến lược Content Marketing hiệu quả",
    excerpt: "Bài viết chia sẻ quy trình 5 bước để xây dựng chiến lược Content Marketing mang lại kết quả cho doanh nghiệp.",
    category: "Content Marketing",
    date: "28/05/2023",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: "Trần Minh Hiếu",
    tags: ["Content Marketing", "Chiến lược", "Content"]
  },
  {
    id: 3,
    title: "7 kỹ năng cần có của một Social Media Manager",
    excerpt: "Những kỹ năng thiết yếu giúp bạn trở thành một Social Media Manager chuyên nghiệp và được nhà tuyển dụng săn đón.",
    category: "Social Media",
    date: "10/04/2023",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    author: "Lê Thị Hương",
    tags: ["Social Media", "Kỹ năng", "Nghề nghiệp"]
  },
  {
    id: 4,
    title: "Kinh nghiệm phỏng vấn vị trí Marketing Manager",
    excerpt: "Chia sẻ những câu hỏi thường gặp và cách trả lời hiệu quả khi phỏng vấn cho vị trí Marketing Manager.",
    category: "Nghề nghiệp",
    date: "05/03/2023",
    image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: "Phạm Thanh Tùng",
    tags: ["Phỏng vấn", "Marketing Manager", "Nghề nghiệp"]
  },
  {
    id: 5,
    title: "Cập nhật thuật toán mới nhất của Facebook và cách thích ứng",
    excerpt: "Tìm hiểu về những thay đổi trong thuật toán Facebook và chiến lược để duy trì hiệu quả quảng cáo trên nền tảng này.",
    category: "Social Media",
    date: "18/02/2023",
    image: "https://images.unsplash.com/photo-1612810806695-30f7a8258391?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    author: "Nguyễn Thị Mai",
    tags: ["Facebook", "Thuật toán", "Social Media"]
  },
  {
    id: 6,
    title: "Cách tính ROI trong chiến dịch Digital Marketing",
    excerpt: "Hướng dẫn chi tiết cách đo lường và tính toán ROI cho các chiến dịch Digital Marketing của doanh nghiệp.",
    category: "Digital Marketing",
    date: "02/01/2023",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: "Lê Văn Bình",
    tags: ["ROI", "Digital Marketing", "Phân tích"]
  }
];

// Categories for filter
const categories = [
  { value: "all", label: "Tất cả" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Content Marketing", label: "Content Marketing" },
  { value: "Social Media", label: "Social Media" },
  { value: "Nghề nghiệp", label: "Nghề nghiệp" }
];

const Blog = () => {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts based on category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = category === "all" || post.category === category;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-transparent pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Blog & Kiến thức Marketing</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Chia sẻ kiến thức, xu hướng và kinh nghiệm trong ngành Marketing
            </p>
            
            <div className="flex items-center max-w-lg mx-auto relative">
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="all" className="mb-8" onValueChange={setCategory}>
          <TabsList className="w-full max-w-3xl mx-auto flex justify-start overflow-x-auto hide-scrollbar p-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="flex-shrink-0">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Không tìm thấy bài viết phù hợp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden border border-border hover:shadow-md transition-all">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <CardHeader className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarIcon size={12} className="mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <CardTitle className="text-xl transition-colors cursor-pointer hover:text-primary">
                    <a href={`/blog/${post.id}`}>{post.title}</a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-4">
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
                <CardFooter className="px-6 pb-6 flex flex-col items-start">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs px-2 py-1 bg-secondary/50 rounded-full flex items-center"
                      >
                        <Tag size={10} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Bởi: {post.author}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
