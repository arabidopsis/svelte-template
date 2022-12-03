// just need to import to use
import InsertForm from './InsertForm.svelte'
import Forms from './Forms.svelte'
const app = document.getElementById('app')
if (app)
  new Forms({
    target: app,
    props: {
      pubmed: 'pubmed'
    }
  })
