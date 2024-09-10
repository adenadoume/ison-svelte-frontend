<script lang="ts">
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import client from '$lib/apollo-client';
import { gql } from '@apollo/client/core';

const HOME_QUERY = gql`
  query GetHomeContent {
    pages(where: {name: "ison"}) {
      nodes {
        id
        title
        content
        slug
        seo {
          title
          metaDesc
          fullHead
        }
      }
    }
    posts(first: 5) {
      nodes {
        id
        title
        date
        excerpt
        slug
        seo {
          title
          metaDesc
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

let homeContent;
let loading = true;
let error = null;

onMount(async () => {
  if (browser) {
    try {
      console.log('Fetching data...');
      const result = await client.query({ query: HOME_QUERY });
      console.log('Fetch result:', result);
      homeContent = result.data;
      loading = false;
    } catch (e) {
      console.error('Fetch error:', e);
      error = e;
      loading = false;
    }
  }
});
</script>

<svelte:head>
  {#if homeContent?.pages?.nodes[0]?.seo}
    <title>{homeContent.pages.nodes[0].seo.title}</title>
    <meta name="description" content={homeContent.pages.nodes[0].seo.metaDesc} />
    {@html homeContent.pages.nodes[0].seo.fullHead}
  {/if}
</svelte:head>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p>Error: {error.message}</p>
{:else if homeContent}
  {@const homePage = homeContent.pages.nodes[0]}
  {@const recentPosts = homeContent.posts.nodes}

  <h1>{homePage.title}</h1>
  {@html homePage.content}

  <h2>Recent Posts</h2>
  <ul>
    {#each recentPosts as post}
      <li>
        <h3>{post.title}</h3>
        <p>Published on: {new Date(post.date).toLocaleDateString()}</p>
        <p>Categories: 
          {#each post.categories.nodes as category}
            <span>{category.name}</span>
          {/each}
        </p>
        {@html post.excerpt}
        <a href="/news-views/{post.slug}">Read more</a>
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 2rem;
  }

  h2 {
    margin-top: 2rem;
  }
</style>
