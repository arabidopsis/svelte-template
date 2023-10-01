import './app.css'
import Counter from "./Counter.svelte";

const app = new Counter({
  target: document.getElementById('app'),
  props: {
    count: 0
  }
})

export default app
