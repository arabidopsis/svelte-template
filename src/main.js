import "./app.css"
import { mount } from "svelte"
import DualRange from "./DualRange.svelte"
const app = mount(DualRange, {
    target: document.getElementById("app"),
    props: {
        min: -1.0,
        max: 1.0,
    },
})

export default app
