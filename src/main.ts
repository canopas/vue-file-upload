import '../dist/output.css'
import '../dist/style.scss'

import SingleFileUpload from './components/SingleFile.vue'
import MultipleFileUpload from './components/MultipleFile.vue'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('SingleFileUpload', SingleFileUpload)
app.component('MultipleFileUpload', MultipleFileUpload)

app.use(router)

app.mount('#app')

export { SingleFileUpload, MultipleFileUpload }
