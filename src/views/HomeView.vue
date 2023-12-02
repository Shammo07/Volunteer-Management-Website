<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue';

const router = useRouter();

const highlightedEvents = ref([])
const recentEvents = ref([])
const userRole = inject('userRole')

const getEvents = async () => {
  const response = await fetch('/api/events')
  const json = await response.json()
  highlightedEvents.value = json.highlightedEvents
  recentEvents.value = json.recentEvents
}

const join = async function (eventId) {
    const response = await fetch(`/api/volunteer/join/${eventId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    const json = await response.json()
    alert(JSON.stringify(json))
    window.location.href = '/'
    router.push('/')
}

onMounted(getEvents)
</script>

<template>
  <main>
    <NavBar />

    <div class="container-fluid">
      <div id="carouselExampleIndicators" class="carousel slide my-4" data-bs-ride="carousel">
        <div class="carousel-indicators"> <button v-for="(event, index) in highlightedEvents" :key="event._id"
            type="button" data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="index"
            :class="{ active: index === 0 }"></button> </div>
        <div class="carousel-inner">
          <div v-for="(event, index) in highlightedEvents" :key="event._id" class="carousel-item"
            :class="{ active: index === 0 }"> <router-link :to="'/events/detail/' + event._id">
              <div class="d-flex justify-content-center align-items-center"> <img :src="event.image"
                  class="card-img-carousel img-fluid" alt="Event Image"
                  style="width: 100%; height: 30vw; object-fit: cover" /> </div>
            </router-link> </div>
        </div> <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true"></span> <span
            class="visually-hidden">Previous</span> </button> <button class="carousel-control-next" type="button"
          data-bs-target="#carouselExampleIndicators" data-bs-slide="next"> <span class="carousel-control-next-icon"
            aria-hidden="true"></span> <span class="visually-hidden">Next</span> </button>
      </div>
    </div>

    <div class="container">
      <ul class="nav nav-tabs my-2">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Recents</a>
        </li>
      </ul>
      <div class="row">
        <div class="col-md-4" v-for="event in recentEvents.slice(0, 3)" :key="event._id">
          <div class="card">
            <router-link :to="'/events/detail/' + event._id">
              <img :src="event.image" class="card-img-top img-fluid" alt="Event Image" />
            </router-link>
            <div class="card-body">
              <h5 class="card-title card-title-new">{{ event.title }}</h5>
              <p class="card-text card-text-body">
                {{ event.description }}
                <br /><br />
              </p>
              <small class="text-muted">
                Last updated {{ event.modifiedAt }}
              </small>
              <div class="text-end" v-if= "userRole == 'Staff'">
                <router-link :to="'/events/edit/' + event._id" class="btn btn-primary">
                  Edit
                </router-link>
              </div>
              <div class="text-end" v-if= "userRole == 'Volunteer'">
                <button @click="join(event._id)" class="btn btn-outline-primary">Join</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </main>
</template>
