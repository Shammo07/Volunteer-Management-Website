<template>
    <main>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Navbar</span>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link active" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link active" to="/events">Events</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link active" to="/becomeVolunteer">Become Volunteer</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link active" to="/volunteers">Volunteers</router-link>
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
    </main>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    let searchQuery = ref('')

    const router = useRouter()

    const searchEvents = () => {
    router.push({ name: 'searchEvent', query: { title: searchQuery.value } })
    }
</script>