import { mount } from "svelte"
import Delay from "./Delay.svelte"
const app = mount(Delay, {
    target: document.getElementById("app"),
})
