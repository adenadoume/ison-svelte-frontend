<script lang="ts">
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import type { HomeData } from '$lib/types';

let homeData: HomeData | null = null;
let loading = true;
let error: Error | null = null;

const apiUrl = import.meta.env.VITE_WP_API_URL;

onMount(async () => {
  if (browser) {
    try {
      const [pageResponse, postsResponse] = await Promise.all([
        fetch(`${apiUrl}/wp/v2/pages?slug=ison`),
        fetch(`${apiUrl}/wp/v2/posts?per_page=5&_embed`)
      ]);
      
      const [pages, posts] = await Promise.all([
        pageResponse.json(),
        postsResponse.json()
      ]);

      homeData = { pages, posts };
      loading = false;
    } catch (e) {
      error = e instanceof Error ? e : new Error('An unknown error occurred');
      loading = false;
    }
  }
});
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p>Error: {error.message}</p>
{:else if homeData}
  {#if homeData.pages[0]}
    <h1>{@html homeData.pages[0].title.rendered}</h1>
    {@html homeData.pages[0].content.rendered}
  {/if}

  <h2>Recent Posts</h2>
  {#if homeData.posts.length > 0}
    <ul>
      {#each homeData.posts as post}
        <li>
          <h3>{@html post.title.rendered}</h3>
          <p>Published on: {new Date(post.date).toLocaleDateString()}</p>
          {#if post._embedded && post._embedded['wp:term']}
            <p>Categories: 
              {#each post._embedded['wp:term'][0] as category}
                <span>{category.name}</span>
              {/each}
            </p>
          {/if}
          {@html post.excerpt.rendered}
          <a href="/news-views/{post.slug}">Read more</a>
        </li>
      {/each}
    </ul>
  {/if}
{/if}
