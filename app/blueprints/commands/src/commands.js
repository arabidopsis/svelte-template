import "./style.css"
import Command from "./Command.svelte"
// const app = new Command({
//   target: document.getElementById('app'),
//   props: {
//       maxHeight: 20
//   }
// })
// Instead of building Command Immediately we give it over
// to the template
window.Command = Command
