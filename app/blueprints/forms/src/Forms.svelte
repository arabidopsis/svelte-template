<script lang="ts">
    export let pubmed: string
    let form: HTMLFormElement
    let multi: HTMLSelectElement
    let json = ""

    function atleast(min: number = 1): boolean {
        if (multi.selectedOptions.length < min) {
            multi.classList.add("is-invalid")
            return false
        } else {
            multi.classList.remove("is-invalid")
            return true
        }
    }
    function submit(event: SubmitEvent) {
        console.log(Array.from(multi.selectedOptions).map((v) => v.value))
        if (!form.checkValidity() || !atleast()) {
            event.preventDefault()
            event.stopPropagation()
        }
        form.classList.add("was-validated")
        const fd = new FormData(form)
        json = JSON.stringify(Array.from(fd.entries()))
        event.preventDefault()
    }
    function serializeForm(form: HTMLFormElement): Record<string, any> {
        var obj: Record<string, any> = {}
        var formData = new FormData(form)
        for (const [key, value] of formData.entries()) {
            const v = obj[key]
            if (v === undefined) {
                obj[key] = value
            } else if (Array.isArray(v)) {
                v.push(value)
            } else {
                obj[key] = [v, value]
            }
            return obj
        }
        // for (const key of formData.keys()) {
        //     obj[key] = formData.get(key);
        // }
        return obj
    }
</script>

<pre>
    {json}
</pre>
<h3>Form for {pubmed}</h3>
<form
    id="myform"
    class="row g-3"
    novalidate
    on:submit={submit}
    on:change={() => {
        form.classList.remove("was-validated")
        atleast()
    }}
    bind:this={form}
>
    <div class="col-md-4">
        <label for="validationCustom01" class="form-label">First name</label>
        <input
            type="text"
            class="form-control"
            id="validationCustom01"
            value={pubmed}
            name="first_name"
            required
        />
        <div class="valid-feedback">Looks good!</div>
    </div>
    <div class="col-md-4">
        <label for="validationCustom02" class="form-label">Last name</label>
        <input
            type="text"
            class="form-control"
            id="validationCustom02"
            value="Otto"
            name="last_name"
            required
        />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">We need a name</div>
    </div>
    <div class="col-md-4">
        <label for="validationCustomUsername" class="form-label">Username</label
        >
        <div class="input-group has-validation">
            <span class="input-group-text" id="inputGroupPrepend">@</span>
            <input
                type="text"
                class="form-control"
                id="validationCustomUsername"
                aria-describedby="inputGroupPrepend"
                name="username"
                required
            />
            <div class="invalid-feedback">Please choose a username.</div>
        </div>
    </div>
    <div class="col-md-6">
        <label for="validationCustom03" class="form-label">City</label>
        <input
            type="text"
            class="form-control"
            id="validationCustom03"
            name="city"
            required
        />
        <div class="invalid-feedback">Please provide a valid city.</div>
    </div>
    <div class="col-md-3">
        <label for="validationCustom04" class="form-label">State</label>
        <select
            class="form-select"
            id="validationCustom04"
            required
            name="state"
            multiple
            bind:this={multi}
        >
            <option value="WA">WA</option>
            <option value="QLD">QLD</option>
            <option value="VIC">VIC</option>
            <option value="NSW">NSW</option>
        </select>
        <div class="invalid-feedback">Please select a valid state.</div>
    </div>
    <div class="col-md-3">
        <label for="validationCustom05" class="form-label">Zip</label>
        <input
            type="text"
            class="form-control"
            id="validationCustom05"
            name="zip"
            required
        />
        <div class="invalid-feedback">Please provide a valid zip.</div>
    </div>
    <div class="col-12">
        <div class="form-check">
            <input
                class="form-check-input"
                type="checkbox"
                value="ok"
                id="invalidCheck"
                name="agree"
                required
            />
            <label class="form-check-label" for="invalidCheck">
                Agree to terms and conditions
            </label>
            <div class="invalid-feedback">
                You must agree before submitting.
            </div>
        </div>
    </div>
    <div class="col-12">
        <button class="btn btn-primary" type="submit">Submit form</button>
    </div>
</form>
