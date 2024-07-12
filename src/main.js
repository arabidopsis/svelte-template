import "./app.css"
import { mount } from "svelte"
import App from "./DualRange.svelte"
// import App from "./Counter.svelte"
const app = mount(App, {
    target: document.getElementById("app"),
    props: {
        min: -1.0,
        max: 1.0,
        count: 5
    },
})
