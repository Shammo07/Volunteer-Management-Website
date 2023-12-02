<script setup>
import { ref, onMounted } from "vue";

const options = ref({});
const series = ref([]);

onMounted(async () => {
    var response = await fetch("/api/volunteer/stats/organizers", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    var json = await response.json();
    options.value = {
        labels: json.map((item) => item._id)
    };
    series.value = json.map((item) => item.total);
});
</script>

<template>
    <div>
        <apexchart type="donut" :options="options" :series="series" />
    </div>
</template>