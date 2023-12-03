<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import { formatDistanceStrict } from 'date-fns'


const events = ref([])
const totalPages = ref(0)
const loading = ref(false)
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
    loading.value = true
    fetch(`/api/events?${params}`)
        .then((response) => response.json())
        .then((result) => {
            totalPages.value = (result.total % result.perPage) !== 0
                ? (result.total / result.perPage + 1)
                : (result.total / result.perPage)
            events.value = result.events
            loading.value = false
        })
        .catch((error) => {
            events.value = []
            totalPages.value = 0
            loading.value = false
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
        <NavBar />

        <div class="container my-4">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb d-inline-flex p-2 bg-light">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item active" aria-current="page">
                        Search</li>
                </ol>
            </nav>
        </div>

        <div class="row mb-3">
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
                            Last Modified: {{
                                formatDistanceStrict(new Date(event.modifiedAt), Date.now(), {
                                    addSuffix: true,
                                })
                            }}
                        </small>
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

    </main>
</template>