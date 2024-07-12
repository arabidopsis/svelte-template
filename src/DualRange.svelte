<script lang="ts">
    export let max: number = 1.0
    export let min: number = 0.0
    export let step: number = 0.01
    export let name_max: string = "max_value"
    export let name_min: string = "min_value"
    // from https://codepen.io/sarmunbustillo/pen/XWEYERa
    type SliderConfig = {
        max: number
        min: number
        step?: number
    }
    function dual_slider(element: HTMLElement, config: SliderConfig) {
        const [inputStart, inputEnd] = element.querySelectorAll("input")

        const thumbLeft = element.querySelector(
            ".thumb.left",
        ) as HTMLInputElement
        const thumbRight = element.querySelector(
            ".thumb.right",
        ) as HTMLInputElement
        const rangeBetween = element.querySelector(
            ".range-between",
        ) as HTMLElement
        const labelMin = element.querySelector(
            ".range-label-start",
        ) as HTMLElement
        const labelMax = element.querySelector(
            ".range-label-end",
        ) as HTMLElement
        let step = 1.0

        // workaround: stop svelte removing these css dependencies
        thumbLeft.classList.remove("hover", "active")

        setStartValueCustomSlider()
        setEndValueCustomSlider()
        const args = setEvents()

        update(config)

        return {
            update,
            destroy,
        }

        // functions

        function destroy() {
            args.forEach((f) => f())
        }

        function update(config: SliderConfig) {
            if (config.max <= config.min) return
            step = config.step = config.step
                ? config.step
                : (config.max - config.min) / 100.0
            inputStart.max = String(config.max)
            inputStart.min = String(config.min)
            inputStart.step = String(config.step)
            inputStart.value = String(inputStart.min)
            inputEnd.max = String(config.max)
            inputEnd.min = String(config.min)
            inputEnd.step = String(config.step)
            inputEnd.value = String(inputEnd.max)

            setTimeout(() => {
                setStartValueCustomSlider()
                setEndValueCustomSlider()
                setLabelValue(labelMin, inputStart)
                setLabelValue(labelMax, inputEnd)
            }, 0)
        }

        function setLabelValue(label: HTMLElement, input: HTMLInputElement) {
            label.innerHTML = `${input.value}`
        }

        function setStartValueCustomSlider() {
            const maximum = Math.min(
                parseFloat(inputStart.value),
                parseFloat(inputEnd.value) - step,
            )
            const percent =
                ((maximum - +inputStart.min) /
                    (+inputStart.max - +inputStart.min)) *
                100
            thumbLeft.style.left = percent + "%"
            rangeBetween.style.left = percent + "%"
        }

        function setEndValueCustomSlider() {
            const minimum = Math.max(
                parseFloat(inputEnd.value),
                parseFloat(inputStart.value) + step,
            )
            const percent =
                ((minimum - +inputEnd.min) / (+inputEnd.max - +inputEnd.min)) *
                100
            thumbRight.style.right = 100 - percent + "%"
            rangeBetween.style.right = 100 - percent + "%"
        }

        function setEvents() {
            function updateStart() {
                setStartValueCustomSlider()
                setLabelValue(labelMin, inputStart)
            }

            function updateEnd() {
                setEndValueCustomSlider()
                setLabelValue(labelMax, inputEnd)
            }

            function add(elem: HTMLElement, key: string) {
                return () => elem.classList.add(key)
            }
            function remove(elem: HTMLElement, key: string) {
                return () => elem.classList.remove(key)
            }

            const args = []

            inputStart.addEventListener("input", updateStart)
            args.push(() =>
                inputStart.removeEventListener("input", updateStart),
            )

            inputEnd.addEventListener("input", updateEnd)
            args.push(() => inputEnd.removeEventListener("input", updateEnd))
            ;[
                ["mouseover", "mouseout", "hover"],
                ["mousedown", "pointerup", "active"],
                ["touchstart", "touchend", "active"],
            ].forEach(([on, off, cls]) => {
                let on_f = add(thumbLeft, cls)
                let off_f = remove(thumbLeft, cls)
                inputStart.addEventListener(on, on_f)
                inputStart.addEventListener(off, off_f)

                args.push(() => inputStart.removeEventListener(on, on_f))
                args.push(() => inputStart.removeEventListener(off, off_f))

                on_f = add(thumbRight, cls)
                off_f = remove(thumbRight, cls)
                inputEnd.addEventListener(on, on_f)
                inputEnd.addEventListener(off, off_f)

                args.push(() => inputEnd.removeEventListener(on, on_f))
                args.push(() => inputEnd.removeEventListener(off, off_f))
            })

            return args
        }
    }
</script>

<div class="range-slider" use:dual_slider={{ max, min, step }}>
    <div class="range-labels">
        <span class="range-label range-label-start">0</span>
        <span class="range-label range-label-end">1</span>
    </div>
    <input type="range" min="0" value="0" max="1" step="0.01" name={name_min} />
    <input type="range" min="0" value="1" max="1" step="0.01" name={name_max} />

    <div class="track-wrapper">
        <div class="track"></div>
        <div class="range-between"></div>
        <div class="thumb left active hover"></div>
        <div class="thumb right"></div>
    </div>
</div>

<style lang="postcss">
    .range-slider {
        --_height: 5px;
        --_thumb-size: calc(var(--_height) * 3);
        position: relative;
        width: 100%;
        display: grid;
        margin-bottom: calc(var(--_thumb-size) * -1);

        .range-labels {
            display: flex;
            justify-content: space-between;

            padding-bottom: 10px;

            .range-label {
                display: inline-flex;
                font-size: 16px;
                color: var(--bs-body);
                line-height: 1;

                &.range-label-start {
                    align-self: flex-start;
                }

                &.range-label-end {
                    align-self: flex-end;
                }
            }
        }

        .track-wrapper {
            position: relative;
            z-index: 1;
            height: var(--_height);
            margin-bottom: var(--_thumb-size);
            display: grid;
            align-items: center;
            margin: 0 calc(var(--_thumb-size) / 2);

            .track {
                position: absolute;
                z-index: 1;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                border-radius: 5px;
                background-color: var(--bs-gray-300);
            }

            .range-between {
                position: absolute;
                z-index: 2;
                left: 0%;
                right: 0%;
                top: 0;
                bottom: 0;
                border-radius: 5px;
                background-color: var(--bs-primary);
            }

            .thumb {
                --_shadow-sizer: 2;
                --_shadow-size: calc(var(--_thumb-size) * var(--_shadow-sizer));
                --_shadow-color: var(--bs-primary);
                --_shadow-opacity: 0;
                position: absolute;
                z-index: 3;
                width: var(--_thumb-size);
                height: var(--_thumb-size);
                background-color: var(--bs-primary);
                border-radius: 50%;
                transition: box-shadow 0.3s ease-in-out;

                &::before {
                    content: "";
                    pointer-events: none;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: -1;
                    background-color: var(--_shadow-color);
                    width: var(--_shadow-size);
                    height: var(--_shadow-size);
                    border-radius: inherit;
                    opacity: var(--_shadow-opacity);
                }

                &.left {
                    left: 0%;
                    transform: translate(calc(var(--_thumb-size) / -2), 0px);
                }

                &.right {
                    right: 0%;
                    transform: translate(calc(var(--_thumb-size) / 2), 0px);
                }

                &.hover {
                    --_shadow-opacity: 0.2;
                }

                &.active {
                    --_shadow-opacity: 0.4;
                    --_shadow-sizer: 3;
                }
            }
        }

        input[type="range"] {
            position: absolute;
            pointer-events: none;
            z-index: 2;
            height: var(--_height);
            width: 100%;
            opacity: 0;
            cursor: pointer;
            bottom: 0;
        }

        input[type="range"]::-webkit-slider-thumb {
            pointer-events: all;
            width: var(--_thumb-size);
            height: var(--_thumb-size);
            border-radius: 0;
            border: 0 none;
            background-color: var(--bs-primary);
        }

        input[type="range"]::-moz-range-thumb {
            pointer-events: all;
            width: var(--_thumb-size);
            height: var(--_thumb-size);
            border-radius: 0;
            border: 0 none;
            background-color: var(--bs-primary);
        }
    }
</style>
