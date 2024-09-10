<script>
  import { onMount } from 'svelte';
  import client from './lib/apollo-client';
  import { gql } from '@apollo/client';

  let pageContent = '';
  let pageTitle = '';
  let loading = true;
  let error = null;

  const GET_HOME_PAGE = gql`
    query GetHomePage {
      pageBy(uri: "ison") {
        title
        content
      }
    }
  `;

  onMount(async () => {
    try {
      const { data } = await client.query({ query: GET_HOME_PAGE });
      pageTitle = data.pageBy.title;
      pageContent = data.pageBy.content;
      loading = false;
    } catch (e) {
      error = e.message;
      loading = false;
    }
  });
</script>

<main>
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else}
    <h1>{pageTitle}</h1>
    {@html pageContent}
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
</style>