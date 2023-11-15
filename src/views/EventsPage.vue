<script setup>
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import NavBar from '../components/NavBar.vue';

const router = useRouter()


const newEvent = ref({
    title: '',
    description: '',
    organizer: '',
    datetime: '',
    quota: 0,
    location: '',
    image: '',
    highlight: false,
})

const submitEvent = async function () {
    var url = '/api/events'
    var method = 'POST'

    if (route.name === 'editEvent') {
        url = url + '/edit/' + newEvent.value._id
        method = 'PUT'
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent.value),
    })
    const json = await response.json()

    // alert the user
    alert(JSON.stringify(json))
    router.push('/events')
}

const getEvent = async function () {
    const response = await fetch('/api/events/detail/' + route.params.id)
    const json = await response.json()

    newEvent.value = json.events
}

const deleteEvent = async function () {
    const response = await fetch('/api/events/delete/' + route.params.id, {
        method: 'DELETE',
    })
    const json = await response.json()
    alert(JSON.stringify(json))
    router.push('/')
}

const events = ref([])
const totalPages = ref(0)
let page = ref(1)
let perPage = ref(6)

const route = useRoute()

const getEvents = () => {
    let params = [`page=${page.value}`, `perPage=${perPage.value}`]
    params = params.join('&')

    fetch(`/api/events?${params}`)
        .then((response) => response.json())
        .then((result) => {
            totalPages.value = (result.total / result.perPage + 1)
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

onMounted(() => {
    if (route.params.id) {
        getEvent()
    } else {
        getEvents()
    }
})

</script>

<template>
    <main>
        <!-- <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <span class="navbar-brand mb-0 h1">Navbar</span>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/events">Events</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/becomeVolunteer">Become Volunteer</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/volunteers">Volunteers</router-link>
                        </li>
                    </ul>
                    <form class="d-flex" @submit.prevent="searchEvents">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                            v-model="searchQuery" />
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav> -->
        <NavBar />
        

        <div class="container-fluid">
            <div class="row mb-3">
                <div class="col-sm-6 my-4">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb d-inline-flex p-2 bg-light">
                            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                            <li class="breadcrumb-item active" v-if="route.name === 'events'" aria-current="page">Events
                            </li>
                            <li class="breadcrumb-item" v-if="route.name === 'newEvents'"><router-link
                                    to="/events">Events</router-link></li>
                            <li class="breadcrumb-item active" v-if="route.name === 'newEvents'" aria-current="page">New
                                Event</li>
                            <li class="breadcrumb-item" v-if="route.name === 'eventDetails'"><router-link
                                    to="/events">Events</router-link></li>
                            <li class="breadcrumb-item active" v-if="route.name === 'eventDetails'" aria-current="page">
                                event title</li>
                            <li class="breadcrumb-item" v-if="route.name === 'editEvent'"><router-link
                                    to="/events">Events</router-link></li>
                            <li class="breadcrumb-item active" v-if="route.name === 'editEvent'" aria-current="page">
                                Edit event</li>
                        </ol>
                    </nav>
                </div>
                <div class="col-sm-6 my-4 text-end" v-if="route.name === 'events'">
                    <router-link to="/events/new" class="btn btn-primary">New</router-link>
                </div>
                <div class="col-sm-6 my-4 text-end" v-if="route.name === 'editEvent'">
                    <button v-on:click="deleteEvent" type="button" class="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>


        <div class="row mb-3" v-if="route.name === 'events'">
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
                            Last updated {{ event.modifiedAt }}
                        </small>
                        <div class="text-end">
                            <a :href="'/events/edit/' + event._id" class="btn btn-primary">Edit</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid" v-if="route.name === 'newEvents'">
            <div class="container my-4">
                <form class="container" @submit.prevent="submitEvent">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="my-4">
                                <label for="eventTitle" class="form-label">Event Title</label>
                                <input type="text" v-model="newEvent.title" class="form-control" id="eventTitle">
                            </div>
                            <div>
                                <label for="organizer" class="form-label">Organizer</label>
                                <input type="text" v-model="newEvent.organizer" class="form-control" id="organizer">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control" v-model="newEvent.description" id="description"
                                rows="6"></textarea>
                        </div>

                        <div class="col-md-6 my-4">
                            <label for="dateTime" class="form-label">Datetime</label>
                            <input type="datetime-local" v-model="newEvent.datetime" class="form-control" id="dateTime">
                        </div>

                        <div class="col-md-6 my-4">
                            <label for="quota" class="form-label">Quota</label>
                            <input type="number" v-model="newEvent.quota" class="form-control" id="quota">
                        </div>

                        <div class="col-md-6 my-4">
                            <label for="location" class="form-label">Location</label>
                            <input type="text" v-model="newEvent.location" class="form-control" id="location">
                        </div>

                        <div class="col-md-6 my-4">
                            <label for="image" class="form-label">Image</label>
                            <input type="text" v-model="newEvent.image" class="form-control" id="image">
                        </div>

                        <div class="container my-4 d-flex justify-content-between">
                            <div class="form-check">
                                <input class="form-check-input" name="highlight" type="checkbox"
                                    v-model="newEvent.highlight" id="highlight">
                                <label class="form-check-label" for="highlight">
                                    Highlight
                                </label>


                            </div>

                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </form>
            </div>

        </div>

        <div class="container-fluid" v-if="route.name === 'eventDetails'">
            <div class="container my-4">
                <div class="row">
                    <div class="col-12 col-md-6 my-2">
                        <div class="card">
                            <div class="card-body">
                                <h3 class="card-title">
                                    {{ newEvent.title }}
                                </h3>
                                <h4 class="card-subtitle mb-2 text-body-secondary">
                                    {{ newEvent.organizer }}
                                </h4>
                                <p class="card-text my-4">
                                    {{ newEvent.description }}
                                </p>
                                <div class="container card">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">
                                            {{ newEvent.Datetime }}
                                        </li>
                                        <li class="list-group-item">
                                            {{ newEvent.location }}
                                        </li>
                                        <li class="list-group-item">
                                            {{ newEvent.quota }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 my-2">
                        <div class="card">
                            <img :src="newEvent.image" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">Become a volunteer!</h5>
                                <p class="card-text">Your time and talent can make a real difference in people's lives.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid" v-if="route.name === 'editEvent'">
            <form class="container" @submit.prevent="submitEvent">
                <div class="row">
                    <div class="col-md-6">
                        <div class="my-4">
                            <label for="eventTitle" class="form-label">Event Title</label>
                            <input type="text" v-model="newEvent.title" class="form-control" id="eventTitle">
                        </div>
                        <div>
                            <label for="organizer" class="form-label">Organizer</label>
                            <input type="text" v-model="newEvent.organizer" class="form-control" id="organizer">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="description" class="form-label">Description</label>
                        <textarea class="form-control" v-model="newEvent.description" id="description" rows="6"></textarea>
                    </div>

                    <div class="col-md-6 my-4">
                        <label for="dateTime" class="form-label">Datetime</label>
                        <input type="datetime-local" v-model="newEvent.datetime" class="form-control" id="dateTime">
                    </div>

                    <div class="col-md-6 my-4">
                        <label for="quota" class="form-label">Quota</label>
                        <input type="number" v-model="newEvent.quota" class="form-control" id="quota">
                    </div>

                    <div class="col-md-6 my-4">
                        <label for="location" class="form-label">Location</label>
                        <input type="text" v-model="newEvent.location" class="form-control" id="location">
                    </div>

                    <div class="col-md-6 my-4">
                        <label for="image" class="form-label">Image</label>
                        <input type="text" v-model="newEvent.image" class="form-control" id="image">
                    </div>

                    <div class="container my-4 d-flex justify-content-between">
                        <div class="form-check">
                            <input class="form-check-input" name="highlight" type="checkbox" v-model="newEvent.highlight"
                                id="highlight">
                            <label class="form-check-label" for="highlight">
                                Highlight
                            </label>


                        </div>

                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>
        </div>

        <div class="container" v-if="route.name === 'events'">
            <nav aria-label="Page navigation">
                <ul class="pagination">
                    <li class="page-item" v-for="i in Array.from({ length: totalPages }, (_, i) => i + 1)" :key="i">
                        <button v-if="i != page" class="btn btn-outline-primary" @click="onPageChange(i)">
                            {{ i }}
                        </button>
                        <button v-if="i == page" class="btn btn-primary" >
                            {{ i }}
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </main>
</template>