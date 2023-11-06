<template>
  <p class="mt-5 ms-6">&nbsp; Single File Upload</p>
  <div class="flex flex-wrap">
    <SingleFileUpload :uploadedFile="uploadedFile" :callback="handleFileUploading">
      <template v-slot="file">
        <div class="m-5">
          <div class="flex items-center justify-center">
            <label
              v-if="!file.file.previewUrl"
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6 px-10">
                <img
                  src="../assets/images/canvas.svg"
                  alt="canvas"
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                />
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
              </div>
            </label>
            <div v-else>
              <div class="w-full h-64">
                <img
                  v-if="file.file.previewType != 'video'"
                  class="h-full w-full object-contain rounded-2xl"
                  :src="file.file.previewUrl"
                />
                <video v-else autoplay loop class="h-full w-full object-contain">
                  <source :src="file.file.previewUrl" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          <p class="flex items-center justify-center text-center">
            {{ file.file ? file.file.previewName : '' }}
          </p>
        </div>
      </template>
    </SingleFileUpload>
  </div>
  <br />
  <hr />
  <p class="mt-5 ms-6">&nbsp; Multiple File Upload</p>
  <div class="flex flex-wrap">
    <MultipleFileUpload
      :removeBtnText="'remove'"
      :uploadBtnText="'Save'"
      :progressBtnText="'Saving...'"
      :uploadedFiles="uploadedFiles"
      :callback="handleMultipleFileUpload"
    >
      <template v-slot="file">
        <div class="m-5">
          <div class="flex items-center justify-center">
            <label
              v-if="!file.file"
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6 px-10">
                <img
                  src="../assets/images/canvas.svg"
                  alt="canvas"
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                />
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
              </div>
            </label>
            <div v-else>
              <div class="w-full h-64">
                <img
                  v-if="file.file.previewType != 'video'"
                  class="h-full w-full object-contain rounded-2xl"
                  :src="file.file.previewUrl"
                />
                <video v-else autoplay loop class="h-full w-full object-contain">
                  <source :src="file.file.previewUrl" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          <p class="flex items-center justify-center text-center">
            {{ file.file ? file.file.previewName : '' }}
          </p>
        </div>
      </template>
    </MultipleFileUpload>
  </div>
</template>

<script lang="ts">
import MultipleFileUpload from '../components/MultipleFile.vue'
import SingleFileUpload from '../components/SingleFile.vue'

export default {
  name: 'IndexView',
  components: {
    MultipleFileUpload,
    SingleFileUpload
  },
  data() {
    return {
      uploadedFile: {} as {
        fileType: string
        fileUrl: string
        fileName: string
      },
      uploadedFiles: [] as Array<{
        fileType: string
        fileUrl: string
        fileName: string
      }>
    }
  },
  methods: {
    async handleFileUploading(file: any) {
      // add your fileuploading logic to server and set data to the uploadedFile
      this.uploadedFile.fileType = 'image'
      this.uploadedFile.fileUrl = 'https://picsum.photos/300/224'
      this.uploadedFile.fileName = file.name

      await new Promise((resolve) => setTimeout(resolve, 2000))
    },
    async handleMultipleFileUpload(files: any) {
      this.uploadedFiles = []

      // add your fileuploading logic to server and set data to the uploadedFiles
      for (var i = 0; i < files.length; i++) {
        this.uploadedFiles.push({
          fileType: 'image',
          fileUrl: 'https://picsum.photos/300/224',
          fileName: 'example-image.jpg'
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
}
</script>
