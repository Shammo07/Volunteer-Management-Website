<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue';

const router = useRouter()

const volunteer = ref({
    name: '',
    email: '',
    password: '',
    contact: '',
    ageGroup: '',
    remarks: '',
    terms: false,
})

const user = ref({
    name: '',
    email: '',
    password: '',
    role:'',
})

const submitForm = async function () {

    submitVolunteer();
    submitUser();
} 

const submitVolunteer = async function () {
    var url = '/api/volunteer'
    var method = 'POST'


    // post the booking to the backend
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteer.value),
    })
    const json = await response.json()
    console.log(json)
    // alert the user
    alert(JSON.stringify(json))
    router.push('/')
}

const submitUser = async function () {
    var url = '/api/users'
    var method = 'POST'
    

    user.value.email = volunteer.value.email;
    user.value.password = volunteer.value.password;
    user.value.name = volunteer.value.name;
    user.value.role = 'Volunteer';


    // post the booking to the backend
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user.value),
    })



    const json = await response.json()
    console.log(json)
    alert(JSON.stringify(json))
}

const route = useRoute()
</script>

<template>
    <main>
        <div class="container-fluid">
            <div>
                <NavBar />
            </div>



            <div class="container my-4">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb d-inline-flex p-2 bg-light">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active" v-if="route.name === 'becomeVolunteer'" aria-current="page">
                            Become Volunteer!</li>
                    </ol>
                </nav>
            </div>



            <div class="container">
                <div class="row">
                    <div class="col-md-6" >
                        <form class="container" @submit.prevent="submitForm" >
                            <div class="mb-3">
                                <label for="imputEmail" class="form-label">Email</label>
                                <input type="email" v-model="volunteer.email" class="form-control" id="imputEmail" requiired>
                            </div>
                            <div class="mb-3">
                                <label for="inputPassword" class="form-label">Password</label>
                                <input type="password" v-model="volunteer.password" class="form-control" id="imputPassword" required>
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
                                    <input class="form-check-input" type="checkbox" v-model="volunteer.terms"
                                        id="gridCheck1">
                                    <label class="form-check-label" for="gridCheck1">
                                        Agree to Terms and Conditions
                                    </label>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary">Register</button>


                        </form>
                    </div>



                    <div class="col-12 col-md-6 my-2" style="max-height: 500px;">
                        <svg class="bd-placeholder-img card-img-top" width="100%" height="60%"
                            xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap"
                            preserveAspectRatio="xMidYMid slice" focusable="false">
                            <title>Placeholder</title>
                            <rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6"
                                dy=".3em">Image cap</text>
                        </svg>
                        <div class="card-body">
                            <h5 class="card-title">Become a Volunteer!</h5>
                            <p class="card-text">Your time and talent can make a real difference in people's life.</p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>