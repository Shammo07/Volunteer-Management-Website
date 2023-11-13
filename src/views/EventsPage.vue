<script setup>
import { ref, onMounted, watch } from 'vue'

import { useRoute } from 'vue-router'


const events = ref([])
const totalPages = ref(0)
let page = ref(1)
let perPage = ref(6)

const keyword = ref('')

const route = useRoute()

const getEvents = () => {
    const titleParam = keyword.value || ''
    let params = [`page=${page.value}`, `perPage=${perPage.value}`]
    if (titleParam) {
        params.push(`title=${titleParam}`)
    }
    params = params.join('&')

    fetch(`/api/events?${params}`)
        .then((response) => response.json())
        .then((result) => {
            totalPages.value = result.totalPages
            console.log(totalPages.value)
            events.value = result.events
        })
        .catch((error) => {
            events.value = []
            totalPages.value = 0
            throw error
        })
}

watch(
    () => route.query.title,
    (newKeyword) => {
        keyword.value = newKeyword
        getEvents()
    },
    { immediate: true }
)

const onPageChange = (p) => {
    page.value = p
    getEvents()
}

onMounted(() => {
    getEvents()
})
</script>

<template>
    <main>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
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
        </nav>
        <div class="container-fluid">
            <div class="row mb-3">
                <div class="col-sm-6 my-4">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb d-inline-flex p-2 bg-light">
                            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                            <li class="breadcrumb-item active" v-if="route.name === 'events'" aria-current="page">Events</li>
                            <li class="breadcrumb-item" v-if="route.name === 'newEvents'"><router-link to="/events">Events</router-link></li>
                            <li class="breadcrumb-item active" v-if="route.name === 'newEvents'" aria-current="page">New Event</li>
                        </ol>
                    </nav>
                </div>
                <div class="col-sm-6 my-4 text-end" v-if="route.name === 'events'">
                    <router-link to="/events/new" class="btn btn-primary">New</router-link>
                </div>
            </div>
        </div>

        
        <div class="row mb-3" v-if="route.name === 'events'">
            <div class="col-md-4" v-for="event in events" :key="event._id">
                <div class="card">
                    <a :href="'/events/edit/' + event._id">
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
                            Last updated 5 min ago
                        </small>
                        <div class="text-end">
                            <a :href="'/events/edit/' + event._id" class="btn btn-primary">Edit</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <nav aria-label="Page navigation" v-if="route.name === 'events'">
            <ul class="pagination">
                <li class="page-item" v-for="i in Array.from({ length: totalPages }, (_, i) => i + 1)" :key="i">
                    <a class="page-link" @click="onPageChange(i)">
                        {{ i }}
                    </a>
                </li>
            </ul>
        </nav>

        <div class="container-fluid" v-if="route.name === 'newEvents'">
            <div class="container my-4">
        <form action="/events" method="POST">
            <div class="row">
                <div class="col-md-6">
                    <div class = "my-4">
                        <label for="eventTitle" class="form-label">Event Title</label>
                        <input type="text" name="title" class="form-control" id="eventTitle">
                    </div>
                    <div>
                        <label for="organizer" class="form-label">Organizer</label>
                        <input type="text" name="organizer" class="form-control" id="organizer">
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" name="description" id="description" rows="6"></textarea>
                </div>

                <div class="col-md-6 my-4">
                    <label for="dateTime" class="form-label">Datetime</label>
                    <input type="datetime-local" name="Datetime" class="form-control" id="dateTime">
                </div>

                <div class="col-md-6 my-4">
                    <label for="quota" class="form-label">Quota</label>
                    <input type="number" name="quota" class="form-control" id="quota">
                </div>

                <div class="col-md-6 my-4">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" name="location" class="form-control" id="location">
                </div>

                <div class="col-md-6 my-4">
                    <label for="image" class="form-label">Image</label>
                    <input type="text" name="image" class="form-control" id="image">
                </div>

                <div class="container my-4 d-flex justify-content-between">
                    <div class="form-check">
                        <input class="form-check-input" name="highlight" type="checkbox" id="highlight">
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






    </main>
</template>