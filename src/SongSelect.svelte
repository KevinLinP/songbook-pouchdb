<script>
  import {push} from 'svelte-spa-router'
  import Select from 'svelte-select'
  
  export let songs
  let selectOptions = [{title: 'loading ...', loading: true}]

  const selectProps = {
    isVirtualList: true,
    placeholder: 'Search ...',
    optionIdentifier: '_id',
    getOptionLabel: (option, filterText) => option.title,
    getSelectionLabel: (option) => option.title,
    inputStyles: 'font-size: 1rem;',
  }

  let selectedValue = null;

  $: if (songs.length > 0) {
    selectOptions = [{title: 'Home', route: '/'}].concat(songs)
  }
  $: if (selectedValue) {
    if (selectedValue.loading) {
      // intentionally blank
    } else if (selectedValue.slug) {
      push(`/${selectedValue.slug}`)
      selectedValue = null
    } else {
      push(selectedValue.route)
      selectedValue = null
    }
  }
</script>

<Select items={selectOptions} {...selectProps} bind:selectedValue></Select>