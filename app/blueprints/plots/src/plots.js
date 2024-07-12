import App from "./Plots2.svelte"
import { mount } from "svelte"
// import App from './Frappe.svelte'
// import App from './GoogleChart.svelte'
const app = mount(App, {
    target: document.getElementById("app"),
})
