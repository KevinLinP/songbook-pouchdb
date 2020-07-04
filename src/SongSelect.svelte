<script>
  // import { navigateTo } from 'svelte-router-spa'
  import Select from 'svelte-select'
  
  export let songs

  const selectProps = {
    isVirtualList: true,
    placeholder: 'Search ...',
    optionIdentifier: '_id',
    getOptionLabel: (option, filterText) => option.title,
    getSelectionLabel: (option) => option.title,
    inputStyles: 'font-size: 1rem;',
  }

  let selectedValue = null;

  $: if (selectedValue) {
    // navigateTo(`/s/${selectedValue._id}`)
    selectedValue = null
  }
</script>

<Select items={songs} {...selectProps} bind:selectedValue></Select>