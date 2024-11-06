// pages/[tmdbID].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function VideoPlayerPage() {
    const router = useRouter();
    const { tmdbID } = router.query; // Get the tmdbID from the URL
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        // Fetch video URL using the tmdbID if it's available
        if (tmdbID) {
            fetch(`https://vidsrc-api-js-gold.vercel.app/vidsrc/${tmdbID}`)
                .then((response) => response.json())
                .then((data) => {
                    // Extract the first m3u8 URL
                    const m3u8Source = data.sources.find(source => source.isM3U8)?.url;
                    if (m3u8Source) {
                        setVideoUrl(m3u8Source);
                    } else {
                        console.error("No m3u8 source found.");
                    }
                })
                .catch((error) => console.error("Error fetching video:", error));
        }
    }, [tmdbID]);

    return (
        <div className="video-container">
            {videoUrl ? (
                <video
                    id="player"
                    controls
                    playsInline
                    poster="/thumbnail.jpg"
                    style={{ width: '100%', height: '100%' }}
                >
                    <source src={videoUrl} type="application/vnd.apple.mpegurl" />
                </video>
            ) : (
                <p>Loading video...</p>
            )}

            <style jsx global>{`
                .video-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: black;
                }
            `}</style>
        </div>
    );
}
