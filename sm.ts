algorithm based on sm

function calculateScore(video: Video, user: User): number {
    return (video.country === user.country ? 3 : 0) +
           (user.likedCategories.includes(video.category) ? 2 : 0) +
           (user.savedVideos.includes(video.id) ? 5 : 0) +
           (video.likes * 0.5) + (video.shares * 0.3) + (video.comments * 0.2) + (video.watchTime * 0.1);
}
