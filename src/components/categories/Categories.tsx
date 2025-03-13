
import { 
  BarChart2, Megaphone, PenTool, Share2, Mail, 
  SearchCheck, TrendingUp, Video, Facebook, LineChart 
} from 'lucide-react';
import CategoryCard from './CategoryCard';

const Categories = () => {
  const categories = [
    {
      title: 'Digital Marketing',
      icon: <TrendingUp className="w-6 h-6" />,
      jobCount: 145,
      slug: 'digital-marketing',
    },
    {
      title: 'Content Marketing',
      icon: <PenTool className="w-6 h-6" />,
      jobCount: 98,
      slug: 'content-marketing',
    },
    {
      title: 'Social Media',
      icon: <Share2 className="w-6 h-6" />,
      jobCount: 112,
      slug: 'social-media',
    },
    {
      title: 'SEO/SEM',
      icon: <SearchCheck className="w-6 h-6" />,
      jobCount: 87,
      slug: 'seo-sem',
    },
    {
      title: 'Email Marketing',
      icon: <Mail className="w-6 h-6" />,
      jobCount: 64,
      slug: 'email-marketing',
    },
    {
      title: 'Marketing Analytics',
      icon: <BarChart2 className="w-6 h-6" />,
      jobCount: 76,
      slug: 'marketing-analytics',
    },
    {
      title: 'Video Marketing',
      icon: <Video className="w-6 h-6" />,
      jobCount: 53,
      slug: 'video-marketing',
    },
    {
      title: 'Facebook Ads',
      icon: <Facebook className="w-6 h-6" />,
      jobCount: 81,
      slug: 'facebook-ads',
    },
    {
      title: 'Google Ads',
      icon: <LineChart className="w-6 h-6" />,
      jobCount: 68,
      slug: 'google-ads',
    },
    {
      title: 'Brand Marketing',
      icon: <Megaphone className="w-6 h-6" />,
      jobCount: 59,
      slug: 'brand-marketing',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {categories.map((category) => (
        <CategoryCard
          key={category.slug}
          title={category.title}
          icon={category.icon}
          jobCount={category.jobCount}
          slug={category.slug}
        />
      ))}
    </div>
  );
};

export default Categories;
