<script>
  import {push} from 'svelte-spa-router'
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
    push(`/${selectedValue.slug}`)
    selectedValue = null
  }
</script>

<Select items={songs} {...selectProps} bind:selectedValue></Select>