<script setup>

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
                            <li class="breadcrumb-item active" aria-current="page">Volunteers
                            </li>
                        </ol>
                    </nav>
                </div>
                <div class="col-sm-6 my-4 text-end">
                    <router-link to="/becomeVolunteer" class="btn btn-primary">New</router-link>
                </div>
            </div>
        </div>

        


   </main>
</template>