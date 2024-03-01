import './app.css'
// import Counter from "./Counter.svelte";
// const app = new Counter({
//   target: document.getElementById('app'),
//   props: {
//     count: 0
//   }
// })
import DualRange from "./DualRange.svelte";
const app = new DualRange({
  target: document.getElementById('app'),
  props: {
     min: -1.0,
     max: 1.0
  }
})

export default app
