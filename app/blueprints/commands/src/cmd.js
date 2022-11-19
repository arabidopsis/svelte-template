
import "./style.css"
import Command from './Command.svelte'
const app = new Command({
  target: document.getElementById('app'),
  props: {

    maxHeight: 20
  }
})
