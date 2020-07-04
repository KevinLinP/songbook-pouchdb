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

  $: selectOptions = [{title: 'Home', route: '/'}].concat(songs)
  $: if (selectedValue) {
    if (selectedValue.slug) {
      push(`/${selectedValue.slug}`)
    } else {
      push(selectedValue.route)
    }
    selectedValue = null
  }
</script>

<Select items={selectOptions} {...selectProps} bind:selectedValue></Select>