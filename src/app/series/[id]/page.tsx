// src/app/series/[id]/page.tsx

import ReviewsSection from "./ReviewsSection";
import type { Metadata } from "next"; // MODIFICATION: Import Metadata type for dynamic titles

export const runtime = 'edge';

// MODIFICATION: Expanded the Series interface to include all new fields from your JSON data
interface Series {
  id: number;
  title: string;
  description: string;
  alternative_titles?: string[];
  covers?: { raw: string; small: string; default: string; };
  tags?: string[] | null;
  genres?: string[];
  type?: string;
  demographic?: string | null;
  published_year?: number | null;
  status?: string;
  artists?: string[];
  authors?: string[];
  publishers?: string[];
  has_anime?: boolean;
  final_volume?: string | null;
  final_chapter?: string | null;
  total_chapters?: string | null;
  translation_completed?: string | null;
  ratings?: { main: number | null; sources: Record<string, number | null>; };
  links?: string[];
}

// NEW: Helper function to get the correct icon and title for external links
const getLinkIcon = (url: string) => {
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        if (domain.includes('tappytoon.com')) return { icon: 'fas fa-book-open', title: 'Tappytoon' };
        if (domain.includes('amazon')) return { icon: 'fab fa-amazon', title: 'Amazon' };
        if (domain.includes('kakao.com')) return { icon: 'fas fa-globe', title: 'KakaoPage' };
        if (domain.includes('anime-planet.com')) return { icon: 'fas fa-rocket', title: 'Anime-Planet' };
        if (domain.includes('myanimelist.net')) return { icon: 'fas fa-star', title: 'MyAnimeList' };
        if (domain.includes('anilist.co')) return { icon: 'fa-solid fa-a', title: 'Anilist' };
        // Add more mappings here for other sites
        return { icon: 'fas fa-link', title: 'Official Link' }; // Default fallback
    } catch (e) {
        return { icon: 'fas fa-link', title: 'Official Link' }; // Fallback for invalid URLs
    }
};

// MODIFICATION: Updated the return type to Promise<Series | null> and removed debug logs
async function getSeriesData(id: string): Promise<Series | null> {
  const apiUrl = `https://manga-api.warpe.workers.dev/api/series/${id}`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return null;
    }
    const data: Series = await res.json();
    return data;
  } catch (error) {
    console.error("A critical error occurred during fetch:", error);
    return null;
  }
}

// NEW: This function generates the dynamic browser tab title
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const series = await getSeriesData(params.id);
  if (!series) {
    return { title: "Series Not Found | MangaWebsite" };
  }
  return {
    title: `${series.title} | MangaWebsite`,
    description: series.description,
  };
}

// MODIFICATION: The entire page component is replaced with the new layout
export default async function SeriesPage({ params }: { params: { id: string } }) {
  const series = await getSeriesData(params.id);

  if (!series) {
    return <div className="text-center mt-10 text-xl">Series not found.</div>;
  }

  // Combine genres and tags for the tag section
  const allTags = [...(series.genres || []), ...(series.tags || [])];

  return (
    // Use a Fragment <> to return multiple top-level elements
    <>
      <div className="container">
        <div className="left-column">
          <img src={series.covers?.default} alt={`${series.title} Cover`} className="cover-image" />
          
          {series.links && series.links.length > 0 && (
            <div className="external-links">
              {series.links.map(link => {
                const { icon, title } = getLinkIcon(link);
                return (
                  <a href={link} target="_blank" rel="noopener noreferrer" title={title} key={link}>
                    <i className={icon}></i>
                  </a>
                );
              })}
            </div>
          )}

          <div className="info-section">
            <h3>Details</h3>
            <ul>
              {/* Conditionally render each piece of info only if it exists */}
              {series.type && <li><strong>Format:</strong> <span>{series.type}</span></li>}
              {series.demographic && <li><strong>Demographic:</strong> <span>{series.demographic}</span></li>}
              {series.published_year && <li><strong>Published:</strong> <span>{series.published_year}</span></li>}
              {series.status && <li><strong>Status:</strong> <span>{series.status}</span></li>}
              {series.artists && series.artists.length > 0 && <li><strong>Artists:</strong> <span>{series.artists.join(', ')}</span></li>}
              {series.authors && series.authors.length > 0 && <li><strong>Authors:</strong> <span>{series.authors.join(', ')}</span></li>}
              {series.publishers && series.publishers.length > 0 && <li><strong>Publishers:</strong> <span>{series.publishers.join(', ')}</span></li>}
            </ul>
          </div>
        </div>

        <div className="right-column">
          <h1 className="title">{series.title}</h1>
          
          {series.alternative_titles && series.alternative_titles.length > 0 && (
            <div className="alt-titles">
              <span>{series.alternative_titles.join(', ')}</span>
            </div>
          )}

          <div className="description">
            <p>{series.description || "No description available."}</p>
          </div>

          {allTags.length > 0 && (
            <div className="tags-section">
              <h3>Tags</h3>
              <div className="tags">
                {allTags.map(tag => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* The ReviewsSection is now placed outside the main container for better layout control */}
      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 24px' }}>
        <ReviewsSection seriesId={series.id} />
      </div>
    </>
  );
}