<script lang="ts">
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { query } from '$lib/graphql-client';
import { gql } from '@apollo/client/core';

const MENU_QUERY = gql`
  query GetMainMenu {
    menu(id: "main-menu", idType: NAME) {
      menuItems {
        nodes {
          id
          label
          path
        }
      }
    }
  }
`;

let menuItems;

onMount(() => {
  if (browser) {
    menuItems = query(MENU_QUERY);
  }
});
</script>

<header>
  <nav>
    {#if browser}
      {#if $menuItems?.loading}
        <p>Loading menu...</p>
      {:else if $menuItems?.error}
        <p>Error loading menu: {$menuItems.error.message}</p>
      {:else if $menuItems?.data}
        <ul>
          {#each $menuItems.data.menu.menuItems.nodes as item}
            <li><a href={item.path}>{item.label}</a></li>
          {/each}
        </ul>
      {/if}
    {/if}
  </nav>
</header>

<main>
  <slot />
</main>

<footer>
  <p>&copy; {new Date().getFullYear()} ISON. All rights reserved.</p>
</footer>

<style>
  header, main, footer {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  nav ul {
    list-style-type: none;
    padding: 0;
  }

  nav ul li {
    display: inline;
    margin-right: 1rem;
  }

  footer {
    text-align: center;
    margin-top: 2rem;
  }
</style>