// just need to import to use
import InsertForm, { clearForm , setEndpoint} from "./InsertForm.svelte"
// import Forms from "./Forms.svelte"
// import { mount } from "svelte"
// const app = document.getElementById("app")
// if (app)
//     mount(Forms, {
//         target: app,
//         props: {
//             pubmed: "pubmed",
//         },
//     })
window.InsertForm = InsertForm
InsertForm.clearForm = clearForm
InsertForm.setEndpoint = setEndpoint
