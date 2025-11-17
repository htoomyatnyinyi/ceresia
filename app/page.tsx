import Link from "next/link";

const page = () => {
  return (
    <div>
      <p>Enter</p>
      <Link href="/admin">Admin Page</Link>
    </div>
  );
};

export default page;

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
