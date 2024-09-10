<script lang="ts">
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { query } from '$lib/graphql-client';
import { gql } from '@apollo/client/core';
import { page } from '$app/stores';

const PAGE_QUERY = gql`
  query GetPage($slug: ID!) {
    page(id: $slug, idType: URI) {
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
`;

let pageQuery;

$: pageSlug = $page.params.slug;

onMount(() => {
  if (browser) {
    pageQuery = query(PAGE_QUERY, { variables: { slug: pageSlug } });
  }
});
</script>

<svelte:head>
  {#if $pageQuery?.data?.page?.seo}
    <title>{$pageQuery.data.page.seo.title}</title>
    <meta name="description" content={$pageQuery.data.page.seo.metaDesc} />
    {@html $pageQuery.data.page.seo.fullHead}
  {/if}
</svelte:head>

{#if browser}
  {#if $pageQuery?.loading}
    <p>Loading...</p>
  {:else if $pageQuery?.error}
    <p>Error: {$pageQuery.error.message}</p>
  {:else if $pageQuery?.data}
    {@const pageData = $pageQuery.data.page}

    <article>
      <h1>{pageData.title}</h1>
      {@html pageData.content}
    </article>
  {/if}
{/if}

<style>
  article {
    max-width: 800px;
    margin: 0 auto;
  }
</style>