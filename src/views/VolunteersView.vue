<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';
const route = useRoute();
const router = useRouter();
const volunteer = ref({
    name: '',
    email: '',
    contact: '',
    password: '',
    ageGroup: '',
    remarks: '',
    terms: false,
})

const events = ref([])

const removeFromEvent = async function (eventId) {
    const volunteerId = route.params.id;
    const response = await fetch(
      `/api/staff/volunteerEventRemove/${eventId}/${volunteerId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    const json = await response.json()
    alert(JSON.stringify(json))
    router.push('/volunteers')
}

const getAllEvents = async function () {
    const volunteerId = route.params.id
    const response = await fetch(`/api/staff/volunteers/${volunteerId}/events`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    const json = await response.json()
    events.value = json.events
}

const volunteers = ref([])
const totalPages = ref(0)
let page = ref(1)
let perPage = ref(3)

const keyword = ref('')

const getVolunteers = () => {
    const titleParam = keyword.value || ''
    let params = [`page=${page.value}`, `perPage=${perPage.value}`]
    if (titleParam) {
        params.push(`title=${titleParam}`)
    }
    params = params.join('&')

    fetch(`/api/staff/volunteer?${params}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }
    )
        .then((response) => response.json())
        .then((result) => {
            totalPages.value = (result.total % result.perPage) !== 0
                ? (result.total / result.perPage + 1)
                : (result.total / result.perPage)
            console.log(totalPages.value)
            volunteers.value = result.volunteers
        })
        .catch((error) => {
            volunteers.value = []
            totalPages.value = 0
            throw error
        })
}

const getVolunteer = async function () {
    const response = await fetch('/api/staff/volunteer/detail/' + route.params.id, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    const json = await response.json()
    volunteer.value = json.volunteer
}

const submitVolunteer = async function () {
    var url = '/api/staff/volunteer/edit/' + route.params.id
    var method = 'PUT'

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(volunteer.value),
    })
    const json = await response.json()

    // alert the user
    alert(JSON.stringify(json))
    router.push('/')
}

const deleteVolunteer = async function () {
    const response = await fetch('/api/staff/volunteer/delete/' + route.params.id, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    const json = await response.json()
    alert(JSON.stringify(json))
    router.push('/')
    return json.email;
}

const deleted = async function () {
    const email = await deleteVolunteer();
    await deleteUser(email);
}

const deleteUser = async function (email) {
    const response = await fetch('/api/users/delete/' + email, {
        method: 'DELETE',
    })
    const json = await response.json()
    alert(JSON.stringify(json))
}

const onPageChange = (p) => {
    page.value = p
    getVolunteers()
}

onMounted(() => {
    getVolunteers()
    if (route.params.id) {
        getVolunteer()
        getAllEvents()
    }
})
</script>

<template>
    <main>
        <NavBar />

        <div class="container-fluid">
            <div class="row mb-3">
                <div class="col-sm-6 my-4">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb d-inline-flex p-2 bg-light">
                            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                            <li class="breadcrumb-item active" v-if="route.name === 'volunteers'" aria-current="page">
                                Volunteers
                            </li>
                            <li class="breadcrumb-item" v-if="route.name === 'editVolunteer'"><router-link
                                    to="/volunteers">Volunteers</router-link></li>
                            <li class="breadcrumb-item active" v-if="route.name === 'editVolunteer'" aria-current="page">
                                Edit</li>
                        </ol>
                    </nav>
                </div>
                <div class="col-sm-6 my-4 text-end" v-if="route.name === 'volunteers'">
                    <router-link to="/becomeVolunteer" class="btn btn-primary">New</router-link>
                </div>
                <div class="col-sm-6 my-4 text-end" v-if="route.name === 'editVolunteer'">
                    <button v-on:click="deleted" type="button" class="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>

        <table class="table" v-if="route.name === 'volunteers'">
            <thead>
                <tr>
                    <td scope="col"> Volunteer Name </td>
                    <td scope="col"> Email </td>
                    <td scope="col"> Contact </td>
                    <td scope="col"> Action </td>
                </tr>
            </thead>
            <tr v-for="vol in volunteers" :key="vol._id">
                <td> {{ vol.name }} </td>
                <td> {{ vol.email }} </td>
                <td> {{ vol.contact }} </td>
                <td> <a :href="'/volunteers/edit/' + vol._id" class="btn btn-primary">Edit</a>
                </td>
            </tr>
        </table>

        <div class="container" v-if="route.name === 'volunteers'">
            <nav aria-label="Page navigation">
                <ul class="pagination">
                    <li class="page-item" v-for="i in Array.from({ length: totalPages }, (_, i) => i + 1)" :key="i">
                        <button v-if="i != page" class="btn btn-outline-primary" @click="onPageChange(i)">
                            {{ i }}
                        </button>
                        <button v-if="i == page" class="btn btn-primary">
                            {{ i }}
                        </button>
                    </li>
                </ul>
            </nav>
        </div>

        <div class="container" v-if="route.name === 'editVolunteer'">
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


                <div class="col-md-6">
                    <table class="table">
                        <thead>
                            <tr>
                                <td scope="col"> Event Title </td>
                                <td scope="col"> Action </td>
                                <td></td>
                            </tr>
                        </thead>
                        <tr v-for="eve in events" :key="eve._id">
                            <td> {{ eve.title }} </td>
                            <td> <a :href="'/events/edit/' + eve._id" class="btn btn-primary">Edit</a>
                            </td>
                            <td> <button @click="removeFromEvent(eve._id)" type="button" class="btn btn-danger" style="background-color: red;" 
                                > X </button></td>
                        </tr>
                    </table>
                </div>

            </div>
        </div>

    </main>
</template>