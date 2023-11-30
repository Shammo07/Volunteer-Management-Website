<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const volunteer = ref({
    name: '',
    email: '',
    contact: '',
    password: '',
    ageGroup: '',
    remarks: '',
    terms: false,
})
onMounted(() => {
    getVolunteer()
})

const getVolunteer = async function () {
    const response = await fetch('/api/volunteer/detail/' + route.params.id)
    const json = await response.json()
    volunteer.value = json.volunteer
}
</script>


<template>
    <main>

        <div class="container my-4">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb d-inline-flex p-2 bg-light">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">
                            My Events</li>
                    </ol>
                </nav>
            </div>

        <div class="row">
            <div class="col-md-6">
                <form class="container" @submit.prevent="submitVolunteer">
                    <div class="mb-3">
                        <label for="imputEmail" class="form-label">Email</label>
                        <input type="email" v-model="volunteer.email" class="form-control" id="imputEmail" required>
                    </div>
                    <div class="mb-3">
                        <label for="inputPassword" class="form-label">Password</label>
                        <input type="password" v-model="volunteer.password" class="form-control" id="imputPassword"
                            required>
                    </div>
                    <div class="mb-3">
                        <label for="inputName" class="form-label">Name</label>
                        <input type="text" v-model="volunteer.name" class="form-control" id="inputName" required>
                    </div>
                    <div class="mb-3">
                        <label for="inputContact" class="form-label">Contact</label>
                        <input type="text" v-model="volunteer.contact" class="form-control" id="inputContact" required>
                    </div>
                    <div class="mb-3">
                        <label for="inputAge" class="form-label">Age Group</label>
                        <select class="form-select" aria-label="Default select example" v-model="volunteer.ageGroup"
                            id="inputAge">
                            <option selected disabled>Dropdown...</option>
                            <option value="18-25">18-25</option>
                            <option value="26-36">26-36</option>
                            <option value="36+">36+</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="remarks" class="form-label">About me and remarks</label>
                        <textarea class="form-control" v-model="volunteer.remarks" id="remarks" rows="3"></textarea>
                    </div>

                    <div class="row mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="volunteer.terms" id="gridCheck1">
                            <label class="form-check-label" for="gridCheck1">
                                Agree to Terms and Conditions
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary">Save</button>

                </form>
            </div>




        </div>
    </main>
</template>