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
            <li class="nav-item" v-if="userRole != 'Volunteer' && userRole != 'Staff'">
              <router-link class="nav-link active" to="/becomeVolunteer">Become Volunteer</router-link>
            </li>
            <li class="nav-item" v-if="userRole == 'Staff'">
              <router-link class="nav-link active" to="/volunteers">Volunteers</router-link>
            </li>
            <li class="nav-item" v-if="userRole == 'Volunteer'">
              <router-link class="nav-link active" to="/myevents">My Events</router-link>
            </li>

          </ul>
          <form class="d-flex" @submit.prevent="searchEvents">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"
              v-model="searchQuery" />
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
          <template v-if="userRole == 'Volunteer' || userRole == 'Staff'">
            <form class="d-flex" @click="logout">
              <button class="btn btn-outline-primary" type="submit">Logout</button>
            </form>
          </template>
          <template v-else>
            <form class="d-flex" @submit.prevent="login">
              <button class="btn btn-primary" type="submit">Login</button>
            </form>
          </template>
        </div>
      </div>
    </nav>
  </main>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const router = useRouter();

const userRole = inject('userRole')

const searchEvents = () => {
  router.push({ name: "searchEvent", query: { title: searchQuery.value } });
};

const login = () => {
  router.push("/login");
};

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = '/'
  router.push('/')
};
</script>