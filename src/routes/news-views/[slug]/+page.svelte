<script lang="ts">
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { query } from '$lib/graphql-client';
import { gql } from '@apollo/client/core';
import { page } from '$app/stores';

const POST_QUERY = gql`
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      seo {
        title
        metaDesc
        fullHead
      }
    }
  }
`;

let postQuery;

$: postSlug = $page.params.slug;

onMount(() => {
  if (browser) {
    postQuery = query(POST_QUERY, { variables: { slug: postSlug } });
  }
});
</script>

<svelte:head>
  {#if $postQuery?.data?.post?.seo}
    <title>{$postQuery.data.post.seo.title}</title>
    <meta name="description" content={$postQuery.data.post.seo.metaDesc} />
    {@html $postQuery.data.post.seo.fullHead}
  {/if}
</svelte:head>

{#if browser}
  {#if $postQuery?.loading}
    <p>Loading...</p>
  {:else if $postQuery?.error}
    <p>Error: {$postQuery.error.message}</p>
  {:else if $postQuery?.data}
    {@const post = $postQuery.data.post}

    <article>
      <h1>{post.title}</h1>
      <p>Published on: {new Date(post.date).toLocaleDateString()}</p>
      <p>Author: {post.author.node.name}</p>
      <p>Categories: 
        {#each post.categories.nodes as category}
          <span>{category.name}</span>
        {/each}
      </p>
      {@html post.content}
    </article>
  {/if}
{/if}

<style>
  article {
    max-width: 800px;
    margin: 0 auto;
  }
</style>