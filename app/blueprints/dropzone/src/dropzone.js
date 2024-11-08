import Dropzone from "./Dropzone.svelte"
import { mount } from "svelte"
const app = mount(Dropzone, {
    target: document.getElementById("app"),
})
