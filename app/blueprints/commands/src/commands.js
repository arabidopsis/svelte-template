import "./style.css"
import { mount } from "svelte"
import App from "./Command.svelte"
function Command(args) {
    return mount(App, args)
}
window.Command = Command
