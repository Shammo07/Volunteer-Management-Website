<script setup>
import { ref, onMounted } from 'vue';
import DonutChart from '../components/DonutChart.vue'
import NavBar from '../components/NavBar.vue';
import { formatDistanceStrict } from 'date-fns'
// import { useRoute } from 'vue-router';
// const route = useRoute();

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
    getEvents()
})

const events = ref([])
const totalPages = ref(0)
let page = ref(1)
let perPage = ref(3)

const getEvents = () => {
    let params = [`page=${page.value}`, `perPage=${perPage.value}`]
    params = params.join('&')

    fetch(`/api/volunteer/events?${params}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then((response) => response.json())
        .then((result) => {
            totalPages.value = (result.total % result.perPage) !== 0
                ? (result.total / result.perPage + 1)
                : (result.total / result.perPage)
            console.log(totalPages.value)
            events.value = result.events
        })
        .catch((error) => {
            events.value = []
            totalPages.value = 0
            throw error
        })
}

const onPageChange = (p) => {
    page.value = p
    getEvents()
}

const getVolunteer = async function () {
    const response = await fetch('/api/volunteer/detail', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    if (!response.ok) {
        throw new Error(json.message)
    }
    const json = await response.json()
    volunteer.value = json.volunteer
    volunteer.value.password = ''
}
</script>


<template>
    <main>
        <NavBar />

        <div class="container my-4">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb d-inline-flex p-2 bg-light">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item active" aria-current="page">
                        My Events</li>
                </ol>
            </nav>
        </div>

        <div class="container my-4">
            <div class="row">
                <div class="col-12 col-md-8">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">
                                Update Profile
                            </h3>
                            <form class="container" @submit.prevent="submitVolunteer">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="inputEmail" class="form-label">Email</label>
                                            <input type="email" v-model="volunteer.email" class="form-control"
                                                id="inputEmail" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="inputPassword" class="form-label">Password</label>
                                            <input type="password" v-model="volunteer.password" class="form-control"
                                                id="inputPassword" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="inputName" class="form-label">Name</label>
                                            <input type="text" v-model="volunteer.name" class="form-control" id="inputName"
                                                required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="inputContact" class="form-label">Contact</label>
                                            <input type="text" v-model="volunteer.contact" class="form-control"
                                                id="inputContact" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="inputAge" class="form-label">Age Group</label>
                                            <select class="form-select" aria-label="Default select example"
                                                v-model="volunteer.ageGroup" id="inputAge" required>
                                                <option selected disabled>Dropdown...</option>
                                                <option value="18-25">18-25</option>
                                                <option value="26-36">26-36</option>
                                                <option value="36+">36+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="remarks" class="form-label">About me and remarks</label>
                                            <textarea class="form-control" v-model="volunteer.remarks" id="remarks" rows="3"
                                                required></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" v-model="volunteer.terms"
                                                id="gridCheck1" required>
                                            <label class="form-check-label" for="gridCheck1">
                                                Agree to Terms and Conditions
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <button type="submit" class="btn btn-primary">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>


                </div>

                <div class="col-12 col-md-4 my-2">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Event Organizers</h5>
                            <DonutChart />
                        </div>

                    </div>
                </div>

            </div>

            <div class="container">
                <div class="row">
                    <div class="col-md-4 my-4" v-for="event in events" :key="event._id">
                        <div class="card">
                            <a :href="'/events/detail/' + event._id">
                                <img :src="event.image" class="card-img-top" alt="Image" />
                            </a>
                            <div class="card-body">
                                <h5 class="card-title card-title-new" style="text-overflow: ellipsis">
                                    {{ event.title }}
                                </h5>
                                <p class="card-text card-text-body" style="text-overflow: ellipsis">
                                    {{ event.description }}
                                    <br />
                                    <br />
                                </p>
                                <small class="text-muted">
                                    Last updated: {{
                                        formatDistanceStrict(new Date(event.modifiedAt), Date.now(), {
                                            addSuffix: true,
                                        })
                                    }}
                                </small>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <div class="container">
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
        </div>
    </main>
</template>