// import {
//    useQuery,
//    useMutation,
//    UseQueryResult,
//    UseMutationResult,
// } from "@tanstack/react-query";

// // Define your API base URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

// // Helper function to handle API errors
// const handleApiError = (error: unknown) => {
//    if (error instanceof Error) {
//       console.error("API Error:", error.message);
//       throw error;
//    }
//    console.error("Unknown API Error:", error);
//    throw new Error("An unknown error occurred");
// };

// // Generic GET request
// const fetchData = async <T>(endpoint: string): Promise<T> => {
//    const response = await fetch(`${API_BASE_URL}${endpoint}`);
//    if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//    }
//    return response.json();
// };

// // Generic POST request
// const postData = async <T>(endpoint: string, data: any): Promise<T> => {
//    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       method: "POST",
//       headers: {
//          "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//    });
//    if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//    }
//    return response.json();
// };

// // Example API functions

// // Fetch user profile
// export const useUserProfile = (userId: string): UseQueryResult<UserProfile, Error> => {
//    return useQuery<UserProfile, Error>(
//       ["userProfile", userId],
//       () => fetchData<UserProfile>(`/users/${userId}`),
//       {
//          onError: handleApiError,
//       }
//    );
// };

// // Fetch video feed
// export const useVideoFeed = (page: number): UseQueryResult<VideoFeed, Error> => {
//    return useQuery<VideoFeed, Error>(
//       ["videoFeed", page],
//       () => fetchData<VideoFeed>(`/videos/feed?page=${page}`),
//       {
//          onError: handleApiError,
//       }
//    );
// };

// // Post a new video
// export const usePostVideo = (): UseMutationResult<Video, Error, NewVideoData> => {
//    return useMutation<Video, Error, NewVideoData>(
//       (newVideo) => postData<Video>("/videos", newVideo),
//       {
//          onError: handleApiError,
//       }
//    );
// };

// // Like a video
// export const useLikeVideo = (): UseMutationResult<void, Error, string> => {
//    return useMutation<void, Error, string>(
//       (videoId) => postData<void>(`/videos/${videoId}/like`, {}),
//       {
//          onError: handleApiError,
//       }
//    );
// };

// // Fetch user's uploaded videos
// export const useUserVideos = (userId: string): UseQueryResult<UserVideos, Error> => {
//    return useQuery<UserVideos, Error>(
//       ["userVideos", userId],
//       () => fetchData<UserVideos>(`/users/${userId}/videos`),
//       {
//          onError: handleApiError,
//       }
//    );
// };

// // Fetch user's watch history
// export const useWatchHistory = (userId: string): UseQueryResult<WatchHistory, Error> => {
//    return useQuery<WatchHistory, Error>(
//       ["watchHistory", userId],
//       () => fetchData<WatchHistory>(`/users/${userId}/watch-history`),
//       {
//          onError: handleApiError,
//       }
//    );
// };

// // Type definitions (you should replace these with your actual types)
// interface UserProfile {
//    id: string;
//    username: string;
//    email: string;
//    // Add other profile fields
// }

// interface VideoFeed {
//    videos: Video[];
//    nextPage: number | null;
// }

// interface Video {
//    id: string;
//    title: string;
//    description: string;
//    url: string;
//    // Add other video fields
// }

// interface NewVideoData {
//    title: string;
//    description: string;
//    file: File;
// }

// interface UserVideos {
//    videos: Video[];
// }

// interface WatchHistory {
//    videos: Video[];
// }
