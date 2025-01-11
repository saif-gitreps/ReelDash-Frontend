"use client";

import { useParams } from "next/navigation";
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from "recharts";
import Navbar from "../../../components/navbar";

const dummyStats = [
   { date: "2023-05-01", views: 1000, likes: 200, comments: 50 },
   { date: "2023-05-02", views: 1500, likes: 300, comments: 75 },
   { date: "2023-05-03", views: 2000, likes: 400, comments: 100 },
   { date: "2023-05-04", views: 1800, likes: 350, comments: 80 },
   { date: "2023-05-05", views: 2500, likes: 500, comments: 120 },
];

export default function VideoStats() {
   const params = useParams();
   const videoId = params.id as string;

   return (
      <div className="container mx-auto p-4 pb-16">
         <Navbar />
         <h1 className="text-2xl font-bold mb-4">Video Statistics</h1>
         <p className="mb-4">Video ID: {videoId}</p>
         <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart
                  data={dummyStats}
                  margin={{
                     top: 5,
                     right: 30,
                     left: 20,
                     bottom: 5,
                  }}
               >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" />
                  <Bar dataKey="likes" fill="#82ca9d" />
                  <Bar dataKey="comments" fill="#ffc658" />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
   );
}
