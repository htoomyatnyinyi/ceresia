import Link from "next/link";

const page = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};

export default page;

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Weather from "@/components/weather/Weather";

function Hero() {
  return (
    <div className="   ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24  ">
        <div className="grid md:grid-cols-2 gap-12 items-center  ">
          <div>
            <h2 className=" mb-4">Summer Collection 2025</h2>
            <p className="text-neutral-300 mb-8 text-lg">
              Discover our latest arrivals and exclusive deals. Quality products
              at unbeatable prices.
            </p>
            <Button size="lg" variant="default">
              {/* Shop Now */}
              <Link href="/admin">Admin Page</Link>
            </Button>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            {/* <ImageWithFallback
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
              alt="Shopping collection"
              className="w-full h-full object-cover"
            /> */}
            <Image
              src="/coffee.png"
              alt="Shopping collection"
              // className="w-full h-full object-cover"
              className="w-full h-full dark:invert"
              fill
            />
          </div>
        </div>
      </div>
      <Weather />
    </div>
  );
}

// import prisma from "@/lib/prisma";

// const Admin = () => {
//   //----------------------------------------------------------------
//   // 1. Fetch everything in parallel
//   // -----------------------------------------------------------------
//   const [profile, jobPosts, applications] = await Promise.all([
//     // Company profile
//     prisma.employerProfile.findUnique({
//       where: { userId: session?.userId },
//       select: {
//         id: true,
//         companyName: true,
//         logoUrl: true,
//         companyDescription: true,
//         stats: true,
//         subscriptionPlan: true,
//         city: true,
//         country: true,
//       },
//     }),

//     // All job posts belonging to this employer
//     prisma.jobPost.findMany({
//       where: { employer: { userId: session?.userId } },
//       orderBy: { postedAt: "desc" },
//       include: {
//         _count: { select: { jobApplications: true } },
//       },
//     }),

//     // All applications received on any of the employer’s jobs
//     prisma.jobApplication.findMany({
//       where: { jobPost: { employer: { userId: session?.userId } } },
//       include: {
//         jobSeekerProfile: {
//           select: {
//             fullName: true,
//             profileImageUrl: true,
//           },
//         },
//         jobPost: { select: { title: true } },
//         resume: { select: { fileName: true } },
//       },
//       orderBy: { appliedAt: "desc" },
//       take: 10, // limit for the “Recent Applicants” section
//     }),
//   ]);
//   return <div>page</div>;
// };

// export default Admin;
