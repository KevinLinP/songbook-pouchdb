<script>
  import {push} from 'svelte-spa-router'
  import Select from 'svelte-select'
  
  export let songOptions
  let selectOptions = [{title: 'loading ...', loading: true}]
  const staticOptions = [
    {title: 'Home', route: '/', icon: '🏠'}
  ]

  const selectProps = {
    isVirtualList: true,
    placeholder: 'Search ...',
    optionIdentifier: '_id',
    inputStyles: 'font-size: 1rem;',
    listPlacement: 'bottom',
    getOptionLabel: (option, filterText) => {
      let html = option.title

      if (option.loading) {
        html = `<span class="text-muted">${html}</span>`
      }

      if (option.icon) {
        html = `<div class="d-flex justify-content-between"><div>${html}</div><div style="filter: saturate(0);">${option.icon}</div></div>`
      }

      return html
    },
  }

  let selectedValue = null;

  $: if (songOptions.length > 0) {
    selectOptions = staticOptions.concat(songOptions)
  }

  $: if (selectedValue) {
    if (selectedValue.slug) {
      push(`/${selectedValue.slug}`)
    } else if (selectedValue.route) {
      push(selectedValue.route)
    }

    selectedValue = null
  }
</script>

<Select items={selectOptions} {...selectProps} bind:selectedValue></Select>