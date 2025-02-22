import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { client } from "@/sanity/lib/client";
// import { client } from "@/sanity/lib/client";
import { SanityLive } from "@/sanity/lib/live";
import { STARTUP_QUERY } from "@/sanity/lib/querys";

export default async function Home({ searchParams } : {
  searchParams: Promise<{query?: string}>
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const startups = await client.fetch<StartupTypeCard[]>(STARTUP_QUERY, params);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect With Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>
        <SearchForm query={query} />
      </section>

      {/* Section for show the startups */}
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search result for "${query}"`: "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {
            startups?.length > 0 ? (
              startups.map((post: StartupTypeCard) => (
                <StartupCard
                  key={post?._id}
                  post={post}
                />
              ))
            ) : (
              <p className="no-results">No Startup Found</p>
            )
          }
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
