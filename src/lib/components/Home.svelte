<script>
    import DotsToImage from '$lib/components/DotsToImage.svelte';
    import { getStories } from '$lib/data.remote';
</script>

<div class="content-container hero-container">
    <div id="hero-section">
        <div class="hero-text">
            <h1>HOME PAGE</h1>
            <p>INSPIRATIONAL DESCRIPTION</p>
        </div>
        <DotsToImage imgFilePath='/UVM_Logo_Primary_Horiz_W_PunchOut.png' />
    </div>
</div>

<hr>

<div class="content-container stories-section">
    <h2>Stories</h2>
    {#await getStories()}
        <div class="loading">Loading stories...</div>
    {:then stories}
        <div class="story-grid">
            {#each stories as story (story.slug)}
                <a href="/{story.slug}" class="story-card">
                    <div class="card-content">
                        <h3>{story.title}</h3>
                        <p class="description">{story.description}</p>
                        <div class="card-footer">
                            <p class="date">{story.date}</p>
                            <span class="read-more">Read more →</span>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/await}
</div>


<style>

    h1 {
        font-size: 4.5rem;
        font-weight: 400;
        font-family: var(--serif);
        margin: 0;
    }

    h3 {
        font-family: var(--sans);
        font-weight: var(--font-weight-bold, 700);
        font-size: 1.5rem;
        margin: 0;
        line-height: 1.3;
        color: var(--color-fg);
    }

    p {
        font-size: 1.5rem;
        font-family: var(--serif);
        margin: 0;
    }

    .hero-container {
        padding: 0;
        margin-top: -3rem; /* Compensate for layout padding on home page */
    }

    #hero-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4rem;
        height: 100vh;
        padding-right: var(--margin-left);
    }


    .hero-text {
        display: flex;
        flex-direction: column;
        max-width: 55%;
        gap: 2rem;
    }
    
    .hero-text p {
        font-size: 1.5rem;
    }

    .loading {
        text-align: center;
        padding: 3rem;
        font-size: 1.2rem;
        color: var(--color-fg);
        opacity: 0.7;
    }

    .story-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
    }

    .story-card {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-height: 280px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
    }

    .story-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        background: rgba(255, 255, 255, 1);
        border-color: rgba(0, 0, 0, 0.12);
    }

    .card-content {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 1rem;
    }

    .card-footer {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
    }

    .read-more {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-primary, #007a87);
        transition: transform 0.2s ease;
    }

    .story-card:hover .read-more {
        transform: translateX(4px);
    }
    

    .description {
        font-size: 1rem;
        line-height: 1.6;
        color: rgba(0, 0, 0, 0.7);
        flex-grow: 1;
    }

    .date {
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.5);
        font-family: var(--sans);
    }

    
    @media (max-width: 768px) {
        
        h1 {
            font-size: 2.5rem;
        }
        
        h3 {
            font-size: 1.25rem;
        }

        #hero-section {
            flex-direction: column;
            text-align: left;
            justify-content: center;
            height: auto;
            padding: 3rem 0;
            gap: 3rem;
        }
        .hero-container {
            margin-top: 0; /* Additional compensation for mobile */
        }

        .hero-text {
            max-width: 90%;
        }

        .hero-text p {
            font-size: 1.2rem;
        }

        .story-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .story-card {
            min-height: 220px;
        }

        .card-content {
            padding: 1.5rem;
        }

    }

</style>